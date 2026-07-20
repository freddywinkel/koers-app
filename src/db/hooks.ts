import { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type LessonProgressRow } from './db';
import type { PanValue } from '../content/types';

/**
 * Koers — datahooks en helpers
 * -------------------------------------
 * Publieke API voor schermen en stage 3:
 *   useTodayCheckin()   · check-in van vandaag (live)
 *   saveCheckin()       · maak/werk de check-in van vandaag bij
 *   useStreak()         · vergevende reeks: { count, frozen }
 *   useLessonProgress() · voortgang van één les (live)
 *   useAllLessonProgress() · alle voortgang (live)
 *   markLessonDone()    · rond een les af
 *   useSettings()       · key-value instellingen: { ready, get, set }
 *   useApplyTheme()     · past .dark op <html> toe (1x in App aanroepen)
 *   exportAllData()     · JSON-dump van alle tabellen
 *   clearAllData()      · wist alle lokale gegevens
 */

/** Begin van de dag (00:00 lokale tijd) als timestamp. */
export function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

const DAY_MS = 24 * 60 * 60 * 1000;

/* ------------------------------- Check-ins ------------------------------- */

/** Live query: de meest recente check-in van vandaag, of null. */
export function useTodayCheckin() {
  return useLiveQuery(async () => {
    const rows = await db.checkins.where('ts').aboveOrEqual(startOfDay(Date.now())).sortBy('ts');
    return rows.length > 0 ? rows[rows.length - 1] : null;
  }, []);
}

/**
 * Sla de check-in van vandaag op. Bestaat er al een, dan wordt die bijgewerkt
 * (pan blijft bewust overschrijfbaar — opnieuw voelen mag altijd).
 */
export async function saveCheckin(input: { pan: PanValue; emotion?: string; note?: string }): Promise<void> {
  const rows = await db.checkins.where('ts').aboveOrEqual(startOfDay(Date.now())).toArray();
  const latest = rows.sort((a, b) => b.ts - a.ts)[0];
  if (latest?.id != null) {
    await db.checkins.update(latest.id, {
      ts: Date.now(),
      pan: input.pan,
      emotion: input.emotion ?? latest.emotion,
      note: input.note ?? latest.note
    });
  } else {
    await db.checkins.add({ ts: Date.now(), pan: input.pan, emotion: input.emotion ?? '', note: input.note });
  }
}

/* -------------------------------- Streak --------------------------------- */

export interface StreakInfo {
  /** Aantal dagen op rij met een check-in. */
  count: number;
  /** true als vandaag nog ontbreekt maar gisteren telde mee — de reeks 'bevriest' dan zachtjes. */
  frozen: boolean;
}

/**
 * Vergevende streak: gemiste dagen resetten nooit zichtbaar naar een straf.
 * Vandaag nog niet ingecheckt? Dan blijft de reeks van gisteren staan (frozen),
 * met zachte tekst. Geen "0 dagen", geen schuldtaal (spec §5).
 */
export function useStreak(): StreakInfo {
  const days = useLiveQuery(async () => {
    const all = await db.checkins.toArray();
    return new Set(all.map((r) => startOfDay(r.ts)));
  }, []);
  return computeStreak(days);
}

export function computeStreak(days: Set<number> | undefined): StreakInfo {
  if (!days) return { count: 0, frozen: false };
  let cursor = startOfDay(Date.now());
  let frozen = false;
  if (!days.has(cursor)) {
    cursor -= DAY_MS;
    frozen = true;
    if (!days.has(cursor)) return { count: 0, frozen: false };
  }
  let count = 0;
  while (days.has(cursor)) {
    count += 1;
    cursor -= DAY_MS;
  }
  return { count, frozen };
}

/* ----------------------------- Lesvoortgang ------------------------------ */

/** Live query: voortgangsrij van één les (undefined = nog niet begonnen). */
export function useLessonProgress(lessonId: string): LessonProgressRow | undefined {
  return useLiveQuery(() => db.lessonProgress.get(lessonId), [lessonId]);
}

/** Live query: alle lesvoortgang. */
export function useAllLessonProgress(): LessonProgressRow[] | undefined {
  return useLiveQuery(() => db.lessonProgress.toArray(), []);
}

/** Zet van les-ids met status 'done' — handig voor contenthelpers. */
export function useDoneLessonIds(): Set<string> | undefined {
  const rows = useAllLessonProgress();
  return rows === undefined ? undefined : new Set(rows.filter((r) => r.status === 'done').map((r) => r.lessonId));
}

/** Rond een les af (idempotent). */
export async function markLessonDone(lessonId: string): Promise<void> {
  await db.lessonProgress.put({ lessonId, status: 'done', completedAt: Date.now() });
}

/* ----------------------------- Instellingen ------------------------------ */

/**
 * Key-value instellingen. Gebruik:
 *   const { ready, get, set } = useSettings();
 *   get('naam', '') · set('herinnering-tijd', '19:00')
 */
export function useSettings() {
  const rows = useLiveQuery(() => db.settings.toArray(), []);
  const map = new Map((rows ?? []).map((r) => [r.key, r.value]));
  return {
    ready: rows !== undefined,
    get: (key: string, fallback = ''): string => map.get(key) ?? fallback,
    set: async (key: string, value: string): Promise<void> => {
      if (key === 'theme' || key === 'design') {
        try {
          localStorage.setItem(`koers-${key}`, value);
        } catch {
          // IndexedDB blijft de bron van waarheid als localStorage niet mag.
        }
      }
      await db.settings.put({ key, value });
    }
  };
}

export type ThemeSetting = 'systeem' | 'licht' | 'donker';

/** Past de dark-class toe op <html> op basis van instelling 'theme'. Eén keer aanroepen in App. */
export function useApplyTheme(): void {
  const row = useLiveQuery(() => db.settings.get('theme'), []);
  useEffect(() => {
    const value = (row?.value ?? 'systeem') as ThemeSetting;
    if (row?.value) {
      try {
        localStorage.setItem('koers-theme', value);
      } catch {
        // De themawissel werkt ook zonder deze snelle opstartcache.
      }
    }
    const apply = () => {
      const dark = value === 'donker' || (value === 'systeem' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.classList.toggle('dark', dark);
    };
    apply();
    if (value !== 'systeem') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [row?.value]);
}

/* ------------------------------ Databeheer ------------------------------- */

/** Exporteer alle tabellen als één JSON-object (voor download op Profiel). */
export async function exportAllData(): Promise<string> {
  const dump: Record<string, unknown> = { exportedAt: new Date().toISOString(), app: 'koers', version: 1 };
  for (const table of db.tables) {
    dump[table.name] = await table.toArray();
  }
  return JSON.stringify(dump, null, 2);
}

/** Wis álle lokale gegevens (na bevestiging op Profiel). */
export async function clearAllData(): Promise<void> {
  await Promise.all(db.tables.map((t) => t.clear()));
  try {
    localStorage.removeItem('koers-theme');
    localStorage.removeItem('koers-design');
  } catch {
    // Geen extra actie nodig als localStorage niet beschikbaar is.
  }
}
