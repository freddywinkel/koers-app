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

/** Emotiehanteringsplan (EHP): vrije secties met sleutel, bv. 'signalen'.
 *  Verouderd: vanaf db-versie 2 gemigreerd naar `signaleringsplannen`.
 *  De tabel blijft bestaan zodat oudere exports leesbaar blijven. */
export interface EhpSectionRow {
  key: string;
  content: string;
}

/** Signaleringsplan: een volledig ingevuld plan (pan 1–5 + professionele hulp).
 *  Elke keer dat de gebruiker een nieuw plan start ontstaat een nieuwe rij;
 *  oudere plannen blijven bewaard als records met aanmaakdatum. */
export interface SignaleringsplanRow {
  id?: number;
  /** Aanmaakdatum (timestamp ms) — getoond in de records-lijst. */
  createdAt: number;
  /** Laatste wijziging (timestamp ms). */
  updatedAt: number;
  /** Veldinhoud per veldsleutel (zie EHP_SECTIONS in lib/ehp.ts). */
  fields: Record<string, string>;
}

/** Ingevuld G-schema (gedachtenschema): Deel 1 (situatie) + Deel 2 (uitdagen).
 *  Elke invulling is een record met aanmaakdatum; oude blijven terugleesbaar. */
export interface GSchemaRow {
  id?: number;
  /** Aanmaakdatum (timestamp ms) — getoond in de records-lijst. */
  createdAt: number;
  /** Laatste wijziging (timestamp ms). */
  updatedAt: number;
  /** Tekstantwoorden per veldsleutel (zie GSCHEMA_VELDEN in lib/gschema.ts). */
  fields: Record<string, string>;
  /** Percentages 0–100 per veld dat daarom vraagt (gedachten, gevoel). */
  percentages: Record<string, number>;
}

/** Instellingen als key-value. Bekende keys:
 *  'theme' ('systeem'|'licht'|'donker'), 'design', 'naam', 'herinnering-tijd' ('19:00'). */
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
  signaleringsplannen!: Table<SignaleringsplanRow, number>;
  gSchemas!: Table<GSchemaRow, number>;

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

    // Versie 2: signaleringsplannen (met records) en G-schema's.
    // Bestaande EHP-inhoud wordt eenmalig overgezet naar een eerste plan,
    // zodat niemand zijn ingevulde plan verliest bij de update.
    this.version(2)
      .stores({
        signaleringsplannen: '++id, createdAt',
        gSchemas: '++id, createdAt'
      })
      .upgrade(async (tx) => {
        const ehpRows = await tx.table('ehpSections').toArray();
        const fields: Record<string, string> = {};
        for (const row of ehpRows) {
          if (typeof row?.key === 'string' && typeof row?.content === 'string' && row.content.trim() !== '') {
            fields[row.key] = row.content;
          }
        }
        if (Object.keys(fields).length === 0) return; // niets ingevuld → geen migratie nodig
        const now = Date.now();
        await tx.table('signaleringsplannen').add({ createdAt: now, updatedAt: now, fields });
      });
  }
}

export const db = new VVDatabase();
