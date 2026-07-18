import type { Week } from './types';
import { week01 } from './weeks/week01';
import { week02 } from './weeks/week02';
import { week03 } from './weeks/week03';
import { week04 } from './weeks/week04';
import { week05 } from './weeks/week05';
import { week06 } from './weeks/week06';
import { week07 } from './weeks/week07';
import { week08 } from './weeks/week08';
import { week09 } from './weeks/week09';
import { week10 } from './weeks/week10';
import { week11 } from './weeks/week11';
import { week12 } from './weeks/week12';

/**
 * Koers — curriculum: 12 weken × 4–5 lessen.
 * --------------------------------------------------
 * Volledig uitgeschreven in stage 2; elke week leeft in ./weeks/weekNN.ts
 * (export `weekNN: Week` + `weekNNFlashcards: Flashcard[]`).
 * Dit bestand is de barrel: schermen importeren alleen `curriculum`.
 * Les-helpers (getWeek/getLesson/…) staan in ./helpers.ts.
 * Schrijfrichtlijnen: zie src/content/README.md.
 */
export const curriculum: Week[] = [
  week01,
  week02,
  week03,
  week04,
  week05,
  week06,
  week07,
  week08,
  week09,
  week10,
  week11,
  week12
];
