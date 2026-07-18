import type { Flashcard } from './types';
import { week01Flashcards } from './weeks/week01';
import { week02Flashcards } from './weeks/week02';
import { week03Flashcards } from './weeks/week03';
import { week04Flashcards } from './weeks/week04';
import { week05Flashcards } from './weeks/week05';
import { week06Flashcards } from './weeks/week06';
import { week07Flashcards } from './weeks/week07';
import { week08Flashcards } from './weeks/week08';
import { week09Flashcards } from './weeks/week09';
import { week10Flashcards } from './weeks/week10';
import { week11Flashcards } from './weeks/week11';
import { week12Flashcards } from './weeks/week12';

/**
 * Flashcards voor actieve recall.
 * ----------------------------
 * Aggregaat van alle weekkaarten (./weeks/weekNN.ts, conventie `wNN-lMM-fK`)
 * plus de stage-1-voorbeeldkaarten van les w02-l03 (conventie `fc-wNN-lMM-x`).
 * Dubbele ids: de week-versie wint (zie dedupe hieronder).
 * De spaced-repetition-engine (tabel flashcardStates) komt in stage 3.
 */

/** Stage-1-voorbeeldkaarten (les w02-l03 "Ademhalen met aandacht"). */
const sampleFlashcards: Flashcard[] = [
  {
    id: 'fc-w02-l03-a',
    lessonId: 'w02-l03',
    skillId: 'ademanker',
    front: 'Wat doe je als je aandacht afdwaalt tijdens het ademen?',
    back: 'Helemaal niets bijzonders — en dát is de oefening. Merk zachtjes op dat je afdwaalde en breng je aandacht terug naar je adem. Zonder jezelf af te raffelen.'
  },
  {
    id: 'fc-w02-l03-b',
    lessonId: 'w02-l03',
    skillId: 'ademanker',
    front: 'Hoe lang en hoe vaak oefen je met je adem?',
    back: 'Kort en vaak werkt beter dan lang en zelden. Begin met 2 minuten per dag. Je adem is er altijd, dus oefenen kan overal.'
  }
];

const weekFlashcards: Flashcard[] = [
  ...week01Flashcards,
  ...week02Flashcards,
  ...week03Flashcards,
  ...week04Flashcards,
  ...week05Flashcards,
  ...week06Flashcards,
  ...week07Flashcards,
  ...week08Flashcards,
  ...week09Flashcards,
  ...week10Flashcards,
  ...week11Flashcards,
  ...week12Flashcards
];

// Dedupe op id: de week-versie wint; samplekaarten alleen als het id nog niet bestaat.
const seen = new Set(weekFlashcards.map((f) => f.id));
export const flashcards: Flashcard[] = [
  ...weekFlashcards,
  ...sampleFlashcards.filter((f) => !seen.has(f.id))
];

/** Zoek flashcards op id (behoudt de volgorde van de invoer). */
export function getFlashcards(ids: string[]): Flashcard[] {
  return ids.map((id) => flashcards.find((f) => f.id === id)).filter((f): f is Flashcard => f !== undefined);
}
