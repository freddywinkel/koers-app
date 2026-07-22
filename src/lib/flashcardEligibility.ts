import { flashcards } from '../content/flashcards';
import type { Flashcard } from '../content/types';

/** Alleen kaarten uit afgeronde lessen doen mee aan overzicht en herhaling. */
export function getEligibleFlashcards(doneLessonIds: Set<string>): Flashcard[] {
  return flashcards.filter(
    (card) => card.lessonId !== undefined && doneLessonIds.has(card.lessonId)
  );
}

export function getEligibleFlashcardIds(doneLessonIds: Set<string>): string[] {
  return getEligibleFlashcards(doneLessonIds).map((card) => card.id);
}
