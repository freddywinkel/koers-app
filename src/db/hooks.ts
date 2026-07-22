import { useEffect, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  db,
  type CheckinRow,
  type EhpSectionRow,
  type FlashcardStateRow,
  type GSchemaRow,
  type LessonProgressRow,
  type MeasureResultRow,
  type PracticeLogRow,
  type SettingRow,
  type SignaleringsplanRow
} from './db';
import type { PanValue } from '../content/types';
import { isIOS, isStandalone } from '../lib/install';
import { addLocalDays, localDayKey, startOfLocalDay } from '../lib/calendar';

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
export const startOfDay = startOfLocalDay;

/* ------------------------------- Check-ins ------------------------------- */

/** Live query: de meest recente check-in van vandaag, of null. */
export function useTodayCheckin() {
  return useLiveQuery(async () => {
    const today = startOfDay(Date.now());
    const tomorrow = addLocalDays(today, 1);
    const rows = await db.checkins.where('ts').between(today, tomorrow, true, false).sortBy('ts');
    return rows.length > 0 ? rows[rows.length - 1] : null;
  }, []);
}

/** Laatste check-in per lokale kalenderdag, nieuwste eerst. */
export function useRecentCheckins(limit = 7): CheckinRow[] | undefined {
  return useLiveQuery(async () => {
    const rows = await db.checkins.orderBy('ts').reverse().toArray();
    const seenDays = new Set<string>();
    const recent: CheckinRow[] = [];
    for (const row of rows) {
      const day = localDayKey(row.ts);
      if (seenDays.has(day)) continue;
      seenDays.add(day);
      recent.push(row);
      if (recent.length >= limit) break;
    }
    return recent;
  }, [limit]);
}

/**
 * Sla de check-in van vandaag op. Bestaat er al een, dan wordt die bijgewerkt
 * (pan blijft bewust overschrijfbaar — opnieuw voelen mag altijd).
 */
export async function saveCheckin(input: { pan: PanValue; emotion?: string; note?: string }): Promise<void> {
  const today = startOfDay(Date.now());
  const tomorrow = addLocalDays(today, 1);
  const rows = await db.checkins.where('ts').between(today, tomorrow, true, false).toArray();
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
    cursor = addLocalDays(cursor, -1);
    frozen = true;
    if (!days.has(cursor)) return { count: 0, frozen: false };
  }
  let count = 0;
  while (days.has(cursor)) {
    count += 1;
    cursor = addLocalDays(cursor, -1);
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
  return useMemo(
    () => (rows === undefined ? undefined : new Set(rows.filter((r) => r.status === 'done').map((r) => r.lessonId))),
    [rows]
  );
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
      const appearanceChanged =
        (key === 'theme' && (map.get(key) ?? 'systeem') !== value) ||
        (key === 'design' && (map.get(key) ?? 'noordzeemist') !== value);
      if (key === 'theme' || key === 'design') {
        try {
          localStorage.setItem(`koers-${key}`, value);
        } catch {
          // IndexedDB blijft de bron van waarheid als localStorage niet mag.
        }
      }
      await db.settings.put({ key, value });
      // WebKit op iOS/iPadOS 26 ververst de PWA-statusbalk niet betrouwbaar
      // na een live kleurwissel. Eenmalig herladen laat de vroege head-script
      // de opgeslagen appkleur toepassen voordat iOS de bovenbalk vastlegt.
      if (appearanceChanged && isIOS() && isStandalone()) window.location.reload();
    }
  };
}

export type ThemeSetting = 'systeem' | 'licht' | 'donker';

/** Past de dark-class toe op <html> op basis van instelling 'theme'. Eén keer aanroepen in App. */
export function useApplyTheme(): void {
  // null is uitsluitend de laadstatus. Daardoor blijft de in index.html al
  // toegepaste opstartkleur staan totdat IndexedDB echt antwoord heeft.
  const row = useLiveQuery(() => db.settings.get('theme'), [], null);
  useEffect(() => {
    if (row === null) return;
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
      const root = document.documentElement;
      const activeScheme = dark ? 'dark' : 'light';
      // Gebruik precies één actieve browserkleur. `light dark` liet iOS bij
      // een expliciet licht app-thema alsnog de donkere systeemkleur kiezen.
      root.style.colorScheme = activeScheme;
      root.classList.toggle('dark', dark);
      let meta = document.querySelector<HTMLMetaElement>('#koers-color-scheme');
      if (!meta) {
        meta = document.createElement('meta');
        meta.id = 'koers-color-scheme';
        meta.name = 'color-scheme';
        document.head.appendChild(meta);
      }
      meta.content = activeScheme;
    };
    apply();
    if (value !== 'systeem') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      apply();
      if (isIOS() && isStandalone()) window.location.reload();
    };
    mq.addEventListener('change', handleSystemThemeChange);
    return () => mq.removeEventListener('change', handleSystemThemeChange);
  }, [row]);
}

/* ------------------------------ Databeheer ------------------------------- */

const BACKUP_VERSION = 1;
const BACKUP_TABLES = [
  'checkins',
  'lessonProgress',
  'flashcardStates',
  'practiceLogs',
  'ehpSections',
  'settings',
  'measureResults',
  'signaleringsplannen',
  'gSchemas'
] as const;

// Een pincode beschermt dit apparaat en hoort niet in een draagbaar
// exportbestand. De korte hash is bovendien geen veilig back-upgeheim.
const DEVICE_ONLY_SETTING_KEYS = new Set(['pin-hash']);

type BackupTableName = (typeof BACKUP_TABLES)[number];
export type ImportMode = 'merge' | 'replace';

export interface ImportSummary {
  mode: ImportMode;
  totalRows: number;
  exportedAt: string;
  tableCounts: Record<BackupTableName, number>;
}

interface ValidatedBackup {
  exportedAt: string;
  presentTables: Set<BackupTableName>;
  checkins: CheckinRow[];
  lessonProgress: LessonProgressRow[];
  flashcardStates: FlashcardStateRow[];
  practiceLogs: PracticeLogRow[];
  ehpSections: EhpSectionRow[];
  settings: SettingRow[];
  measureResults: MeasureResultRow[];
  signaleringsplannen: SignaleringsplanRow[];
  gSchemas: GSchemaRow[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(row: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(row).every((key) => keys.includes(key));
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isOptionalId(value: unknown): boolean {
  return value === undefined || (typeof value === 'number' && Number.isInteger(value) && value > 0);
}

function isOptionalString(value: unknown): boolean {
  return value === undefined || typeof value === 'string';
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return isRecord(value) && Object.values(value).every((entry) => typeof entry === 'string');
}

function isPercentageRecord(value: unknown): value is Record<string, number> {
  return (
    isRecord(value) &&
    Object.values(value).every((entry) => isFiniteNumber(entry) && entry >= 0 && entry <= 100)
  );
}

function isValidTime(value: string): boolean {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  return Boolean(match && Number(match[1]) <= 23 && Number(match[2]) <= 59);
}

function isCheckinRow(value: unknown): value is CheckinRow {
  if (!isRecord(value) || !hasOnlyKeys(value, ['id', 'ts', 'pan', 'emotion', 'note'])) return false;
  return (
    isOptionalId(value.id) &&
    isFiniteNumber(value.ts) &&
    value.ts >= 0 &&
    [1, 2, 3, 4, 5].includes(value.pan as number) &&
    typeof value.emotion === 'string' &&
    isOptionalString(value.note)
  );
}

function isLessonProgressRow(value: unknown): value is LessonProgressRow {
  if (!isRecord(value) || !hasOnlyKeys(value, ['lessonId', 'status', 'completedAt'])) return false;
  return (
    typeof value.lessonId === 'string' &&
    value.lessonId.length > 0 &&
    (value.status === 'open' || value.status === 'done') &&
    (value.completedAt === undefined || (isFiniteNumber(value.completedAt) && value.completedAt >= 0))
  );
}

function isFlashcardStateRow(value: unknown): value is FlashcardStateRow {
  if (!isRecord(value) || !hasOnlyKeys(value, ['flashcardId', 'due', 'interval', 'ease', 'reps'])) return false;
  return (
    typeof value.flashcardId === 'string' &&
    value.flashcardId.length > 0 &&
    isFiniteNumber(value.due) &&
    value.due >= 0 &&
    isFiniteNumber(value.interval) &&
    value.interval >= 0 &&
    isFiniteNumber(value.ease) &&
    value.ease > 0 &&
    isFiniteNumber(value.reps) &&
    Number.isInteger(value.reps) &&
    value.reps >= 0
  );
}

function isPracticeLogRow(value: unknown): value is PracticeLogRow {
  if (!isRecord(value) || !hasOnlyKeys(value, ['id', 'ts', 'skillId', 'note'])) return false;
  return (
    isOptionalId(value.id) &&
    isFiniteNumber(value.ts) &&
    value.ts >= 0 &&
    typeof value.skillId === 'string' &&
    value.skillId.length > 0 &&
    isOptionalString(value.note)
  );
}

function isEhpSectionRow(value: unknown): value is EhpSectionRow {
  if (!isRecord(value) || !hasOnlyKeys(value, ['key', 'content'])) return false;
  return typeof value.key === 'string' && value.key.length > 0 && typeof value.content === 'string';
}

function isSettingRow(value: unknown): value is SettingRow {
  if (!isRecord(value) || !hasOnlyKeys(value, ['key', 'value'])) return false;
  if (typeof value.key !== 'string' || value.key.length === 0 || typeof value.value !== 'string') return false;
  if (value.key === 'theme') return ['systeem', 'licht', 'donker'].includes(value.value);
  if (value.key === 'design') return ['noordzeemist', 'zand-salie', 'terracotta-linnen'].includes(value.value);
  if (value.key === 'herinnering-tijd') return isValidTime(value.value);
  return true;
}

function isMeasureResultRow(value: unknown): value is MeasureResultRow {
  if (!isRecord(value) || !hasOnlyKeys(value, ['id', 'instrument', 'ts', 'score', 'answers'])) return false;
  return (
    isOptionalId(value.id) &&
    typeof value.instrument === 'string' &&
    value.instrument.length > 0 &&
    isFiniteNumber(value.ts) &&
    value.ts >= 0 &&
    isFiniteNumber(value.score) &&
    Array.isArray(value.answers) &&
    value.answers.every(isFiniteNumber)
  );
}

function isSignaleringsplanRow(value: unknown): value is SignaleringsplanRow {
  if (!isRecord(value) || !hasOnlyKeys(value, ['id', 'createdAt', 'updatedAt', 'fields'])) return false;
  return (
    isOptionalId(value.id) &&
    isFiniteNumber(value.createdAt) &&
    value.createdAt >= 0 &&
    isFiniteNumber(value.updatedAt) &&
    value.updatedAt >= 0 &&
    isStringRecord(value.fields)
  );
}

function isGSchemaRow(value: unknown): value is GSchemaRow {
  if (!isRecord(value) || !hasOnlyKeys(value, ['id', 'createdAt', 'updatedAt', 'fields', 'percentages'])) return false;
  return (
    isOptionalId(value.id) &&
    isFiniteNumber(value.createdAt) &&
    value.createdAt >= 0 &&
    isFiniteNumber(value.updatedAt) &&
    value.updatedAt >= 0 &&
    isStringRecord(value.fields) &&
    isPercentageRecord(value.percentages)
  );
}

function readRows<T>(
  source: Record<string, unknown>,
  tableName: BackupTableName,
  validate: (value: unknown) => value is T
): T[] {
  const value = source[tableName];
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new Error(`Tabel '${tableName}' is geen lijst.`);
  const invalidIndex = value.findIndex((row) => !validate(row));
  if (invalidIndex >= 0) throw new Error(`Tabel '${tableName}' bevat een ongeldige rij op positie ${invalidIndex + 1}.`);
  return value as T[];
}

function validateBackup(json: string): ValidatedBackup {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('Dit bestand bevat geen geldige JSON.');
  }
  if (!isRecord(parsed)) throw new Error('Dit bestand is geen geldige Koers-export.');
  if (parsed.app !== 'koers') throw new Error('Dit bestand is niet door Koers gemaakt.');
  if (parsed.version !== BACKUP_VERSION) throw new Error('Deze versie van het exportbestand wordt niet ondersteund.');
  if (typeof parsed.exportedAt !== 'string' || Number.isNaN(Date.parse(parsed.exportedAt))) {
    throw new Error('De exportdatum ontbreekt of is ongeldig.');
  }

  const allowedKeys = new Set<string>(['app', 'version', 'exportedAt', ...BACKUP_TABLES]);
  const unknownKey = Object.keys(parsed).find((key) => !allowedKeys.has(key));
  if (unknownKey) throw new Error(`Onbekende tabel of eigenschap '${unknownKey}' gevonden.`);
  const presentTables = new Set(BACKUP_TABLES.filter((name) => Object.prototype.hasOwnProperty.call(parsed, name)));
  if (presentTables.size === 0) throw new Error('Deze Koers-export bevat geen gegevens-tabellen.');
  const portableSettings = readRows(parsed, 'settings', isSettingRow).filter(
    (setting) => !DEVICE_ONLY_SETTING_KEYS.has(setting.key)
  );

  return {
    exportedAt: parsed.exportedAt,
    presentTables,
    checkins: readRows(parsed, 'checkins', isCheckinRow),
    lessonProgress: readRows(parsed, 'lessonProgress', isLessonProgressRow),
    flashcardStates: readRows(parsed, 'flashcardStates', isFlashcardStateRow),
    practiceLogs: readRows(parsed, 'practiceLogs', isPracticeLogRow),
    ehpSections: readRows(parsed, 'ehpSections', isEhpSectionRow),
    settings: portableSettings,
    measureResults: readRows(parsed, 'measureResults', isMeasureResultRow),
    signaleringsplannen: readRows(parsed, 'signaleringsplannen', isSignaleringsplanRow),
    gSchemas: readRows(parsed, 'gSchemas', isGSchemaRow)
  };
}

function syncAppearanceCache(settings: SettingRow[], mode: ImportMode): void {
  try {
    for (const key of ['theme', 'design'] as const) {
      const row = settings.find((setting) => setting.key === key);
      if (row) localStorage.setItem(`koers-${key}`, row.value);
      else if (mode === 'replace') localStorage.removeItem(`koers-${key}`);
    }
  } catch {
    // IndexedDB blijft de bron van waarheid als localStorage niet mag.
  }
}

/** Exporteer alle tabellen als één JSON-object (voor download op Profiel). */
export async function exportAllData(): Promise<string> {
  const dump: Record<string, unknown> = {
    exportedAt: new Date().toISOString(),
    app: 'koers',
    version: BACKUP_VERSION
  };
  for (const table of db.tables) {
    const rows = await table.toArray();
    dump[table.name] =
      table.name === 'settings'
        ? rows.filter((row) => !DEVICE_ONLY_SETTING_KEYS.has((row as { key?: unknown }).key as string))
        : rows;
  }
  return JSON.stringify(dump, null, 2);
}

/**
 * Herstel een gevalideerde Koers-export. `merge` werkt bestaande sleutels bij;
 * `replace` wist eerst alle bekende tabellen. De profielpagina bevestigt beide
 * mutaties expliciet voordat deze helper wordt aangeroepen.
 */
export async function importAllData(json: string, mode: ImportMode): Promise<ImportSummary> {
  if (mode !== 'merge' && mode !== 'replace') throw new Error('Onbekende importmodus.');
  const backup = validateBackup(json);
  const deviceOnlySettings = (
    await Promise.all([...DEVICE_ONLY_SETTING_KEYS].map((key) => db.settings.get(key)))
  ).filter((row): row is SettingRow => row !== undefined);

  await db.transaction(
    'rw',
    [
      db.checkins,
      db.lessonProgress,
      db.flashcardStates,
      db.practiceLogs,
      db.ehpSections,
      db.settings,
      db.measureResults,
      db.signaleringsplannen,
      db.gSchemas
    ],
    async () => {
      if (mode === 'replace') {
        for (const table of db.tables) await table.clear();
      }
      if (backup.presentTables.has('checkins')) await db.checkins.bulkPut(backup.checkins);
      if (backup.presentTables.has('lessonProgress')) await db.lessonProgress.bulkPut(backup.lessonProgress);
      if (backup.presentTables.has('flashcardStates')) await db.flashcardStates.bulkPut(backup.flashcardStates);
      if (backup.presentTables.has('practiceLogs')) await db.practiceLogs.bulkPut(backup.practiceLogs);
      if (backup.presentTables.has('ehpSections')) await db.ehpSections.bulkPut(backup.ehpSections);
      if (backup.presentTables.has('settings')) await db.settings.bulkPut(backup.settings);
      if (mode === 'replace' && deviceOnlySettings.length > 0) await db.settings.bulkPut(deviceOnlySettings);
      if (backup.presentTables.has('measureResults')) await db.measureResults.bulkPut(backup.measureResults);
      if (backup.presentTables.has('signaleringsplannen')) {
        await db.signaleringsplannen.bulkPut(backup.signaleringsplannen);
      }
      if (backup.presentTables.has('gSchemas')) await db.gSchemas.bulkPut(backup.gSchemas);
    }
  );

  syncAppearanceCache(backup.settings, mode);
  const tableCounts = Object.fromEntries(BACKUP_TABLES.map((name) => [name, backup[name].length])) as Record<
    BackupTableName,
    number
  >;
  return {
    mode,
    tableCounts,
    totalRows: Object.values(tableCounts).reduce((total, count) => total + count, 0),
    exportedAt: backup.exportedAt
  };
}

/** Wis álle lokale gegevens (na bevestiging op Profiel). */
export async function clearAllData(): Promise<void> {
  await Promise.all(db.tables.map((t) => t.clear()));
  try {
    localStorage.removeItem('koers-theme');
    localStorage.removeItem('koers-design');
    localStorage.removeItem('koers-reminder-last-fired');
    localStorage.removeItem('koers-concept-gschema-recovery');
  } catch {
    // Geen extra actie nodig als localStorage niet beschikbaar is.
  }
}
