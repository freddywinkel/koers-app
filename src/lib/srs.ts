import { useLiveQuery } from 'dexie-react-hooks';
import { db, type FlashcardStateRow } from '../db/db';
import { addLocalDays, differenceInCalendarDays, startOfLocalDay } from './calendar';

/**
 * srs.ts — spaced-repetition-engine voor flashcards (SM-2-achtig)
 * --------------------------------------------------------------
 * Werkt op de bestaande Dexie-tabel `flashcardStates`
 * ({ flashcardId, due, interval, ease, reps }).
 *
 * Beoordeling 0–3:
 *   0 Opnieuw  · terug naar het begin van de leerreeks, vandaag nog eens
 *   1 Moeilijk · klein stapje vooruit (interval × 1.2), ease iets omlaag
 *   2 Goed     · klassiek SM-2: 1 dag → 6 dagen → interval × ease
 *   3 Makkelijk· extra ruimte (× 1.3), ease omhoog
 *
 * `due` staat altijd op het begin van een dag: kaarten zijn vanaf 's ochtends
 * beschikbaar en nooit "te laat op de avond" — herhaling mag licht blijven.
 * Hooks (useDueCount, useNextDue) staan hier bewust; src/db/hooks.ts blijft
 * ongemoeid. Geef `allIds` als stabiele (module-level) array mee.
 */

export type Grade = 0 | 1 | 2 | 3;

export const GRADE_LABELS: Record<Grade, string> = {
  0: 'Opnieuw',
  1: 'Moeilijk',
  2: 'Goed',
  3: 'Makkelijk'
};

const START_EASE = 2.5;
const MIN_EASE = 1.3;

/** Beginstatus van een nieuwe kaart: meteen 'due', ease 2.5. */
export function newState(flashcardId: string, now: number = Date.now()): FlashcardStateRow {
  return { flashcardId, due: startOfLocalDay(now), interval: 0, ease: START_EASE, reps: 0 };
}

/**
 * Pure SM-2-stap: gegeven de vorige status (of undefined = nieuwe kaart)
 * en een beoordeling, bereken de volgende status inclusief nieuwe `due`.
 */
export function scheduleNext(
  prev: FlashcardStateRow | undefined,
  flashcardId: string,
  grade: Grade,
  now: number = Date.now()
): FlashcardStateRow {
  const base = prev ?? newState(flashcardId, now);
  let { interval, ease, reps } = base;

  if (grade === 0) {
    // Opnieuw: leerreeks opnieuw starten; kaart blijft vandaag 'due'.
    reps = 0;
    interval = 0;
    ease = Math.max(MIN_EASE, ease - 0.2);
  } else {
    reps += 1;
    if (grade === 1) {
      interval = Math.max(1, Math.round(interval * 1.2));
      ease = Math.max(MIN_EASE, ease - 0.15);
    } else if (grade === 2) {
      interval = reps === 1 ? 1 : reps === 2 ? 6 : Math.round(interval * ease);
    } else {
      interval = reps === 1 ? 3 : Math.round((reps === 2 ? 6 : interval * ease) * 1.3);
      ease += 0.15;
    }
  }

  return { flashcardId, due: addLocalDays(now, interval), interval, ease, reps };
}

/** Beoordeel een kaart en sla de nieuwe status op (idempotent, één rij per kaart). */
export async function gradeCard(flashcardId: string, grade: Grade): Promise<FlashcardStateRow> {
  const prev = await db.flashcardStates.get(flashcardId);
  const next = scheduleNext(prev, flashcardId, grade);
  await db.flashcardStates.put(next);
  return next;
}

/**
 * Welke kaarten uit `allIds` zijn nu aan de beurt?
 * Eerst eerder geoefende kaarten op volgorde van `due` (oudste eerst),
 * daarna nieuwe kaarten (nog geen statusrij) in contentvolgorde.
 */
export async function getDueFlashcards(allIds: string[], now: number = Date.now()): Promise<string[]> {
  if (allIds.length === 0) return [];
  const states = await db.flashcardStates.where('flashcardId').anyOf(allIds).toArray();
  const byId = new Map(states.map((s) => [s.flashcardId, s]));
  const dueLearned = allIds.filter((id) => {
    const s = byId.get(id);
    return s !== undefined && s.due <= now;
  });
  dueLearned.sort((a, b) => (byId.get(a)?.due ?? 0) - (byId.get(b)?.due ?? 0));
  const fresh = allIds.filter((id) => !byId.has(id));
  return [...dueLearned, ...fresh];
}

/** Dichtstbijzijnde toekomstige herhaaldatum binnen `allIds`, of null. */
export async function getNextDue(allIds: string[], now: number = Date.now()): Promise<number | null> {
  if (allIds.length === 0) return null;
  const states = await db.flashcardStates.where('flashcardId').anyOf(allIds).toArray();
  let next: number | null = null;
  for (const s of states) {
    if (s.due > now && (next === null || s.due < next)) next = s.due;
  }
  return next;
}

/* --------------------------------- Hooks --------------------------------- */

/** Live aantal kaarten dat nu aan de beurt is (undefined tijdens laden). */
export function useDueCount(allIds: string[]): number | undefined {
  return useLiveQuery(async () => (await getDueFlashcards(allIds)).length, [allIds]);
}

/** Live dichtstbijzijnde toekomstige herhaaldatum (null = geen, undefined = laden). */
export function useNextDue(allIds: string[]): number | null | undefined {
  return useLiveQuery(() => getNextDue(allIds), [allIds]);
}

/* ------------------------------ Hulpteksten ------------------------------ */

/** Vriendelijke Nederlandse aanduiding: 'morgen', 'over 3 dagen', 'over 2 weken'. */
export function formatDueHint(ts: number, now: number = Date.now()): string {
  const days = differenceInCalendarDays(ts, now);
  if (days <= 0) return 'later vandaag';
  if (days === 1) return 'morgen';
  if (days < 7) return `over ${days} dagen`;
  const weeks = Math.round(days / 7);
  return weeks === 1 ? 'over een week' : `over ${weeks} weken`;
}
