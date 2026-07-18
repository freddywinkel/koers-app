import Dexie, { type Table } from 'dexie';
import type { PanValue } from '../content/types';

/**
 * Koers — local-first datalaag (Dexie / IndexedDB)
 * ---------------------------------------------------------
 * Alle gegevens blijven op het apparaat (privacy-by-design, AVG art. 9).
 * Tabellen zijn getypt; hooks en helpers staan in src/db/hooks.ts.
 */

/** Dagelijkse check-in via het pannetjesmodel. Eén of meerdere per dag mogelijk;
 *  saveCheckin() werkt de laatste van vandaag bij. */
export interface CheckinRow {
  id?: number;
  /** Unix-timestamp (ms). */
  ts: number;
  pan: PanValue;
  /** Vrij tekstveld voor het gevoel; mag leeg blijven. */
  emotion: string;
  note?: string;
}

export type LessonStatus = 'open' | 'done';

/** Voortgang per les. Rijen ontstaan zodra een les gestart/afgerond wordt. */
export interface LessonProgressRow {
  lessonId: string;
  status: LessonStatus;
  completedAt?: number;
}

/** Spaced-repetition-status per flashcard (SM-2-achtig; engine = stage 3). */
export interface FlashcardStateRow {
  flashcardId: string;
  /** Volgende herhaaldatum (timestamp ms). */
  due: number;
  /** Interval in dagen. */
  interval: number;
  /** Ease-factor (start 2.5). */
  ease: number;
  reps: number;
}

/** Log van losse oefenmomenten met een vaardigheid (toolbox). */
export interface PracticeLogRow {
  id?: number;
  ts: number;
  skillId: string;
  note?: string;
}

/** Emotiehanteringsplan (EHP): vrije secties met sleutel, bv. 'signalen'. */
export interface EhpSectionRow {
  key: string;
  content: string;
}

/** Instellingen als key-value. Bekende keys:
 *  'theme' ('systeem'|'licht'|'donker'), 'naam', 'herinnering-tijd' ('19:00'). */
export interface SettingRow {
  key: string;
  value: string;
}

/** Resultaat van een vragenlijst/meting (bv. wekelijkse stemming). */
export interface MeasureResultRow {
  id?: number;
  /** Naam van het instrument, bv. 'stemming-5'. */
  instrument: string;
  ts: number;
  score: number;
  answers: number[];
}

export class VVDatabase extends Dexie {
  checkins!: Table<CheckinRow, number>;
  lessonProgress!: Table<LessonProgressRow, string>;
  flashcardStates!: Table<FlashcardStateRow, string>;
  practiceLogs!: Table<PracticeLogRow, number>;
  ehpSections!: Table<EhpSectionRow, string>;
  settings!: Table<SettingRow, string>;
  measureResults!: Table<MeasureResultRow, number>;

  constructor() {
    super('vaardig-en-vrij');
    this.version(1).stores({
      checkins: '++id, ts, pan',
      lessonProgress: 'lessonId, status',
      flashcardStates: 'flashcardId, due',
      practiceLogs: '++id, ts, skillId',
      ehpSections: 'key',
      settings: 'key',
      measureResults: '++id, instrument, ts'
    });
  }
}

export const db = new VVDatabase();
