import type { Lesson, Week } from '../types';
import { actConcepts } from './actConcepts';
import { theoryLessons } from './lessons';
import { getTheorySource, theorySources } from './sources';
import type { LocalizedText, PsychologyConcept, TheoryLesson } from './types';
import { versConcepts } from './versConcepts';

export { getTheorySource, theoryLessons, theorySources };
export type { LocalizedText, PsychologyConcept, TheoryLesson };

/** Eén gedeelde bron van waarheid voor alle begrippen in lessen en bibliotheek. */
export const psychologyConcepts: PsychologyConcept[] = [...actConcepts, ...versConcepts];

const lessonById = new Map(theoryLessons.map((lesson) => [lesson.id, lesson]));
const conceptById = new Map(psychologyConcepts.map((concept) => [concept.id, concept]));

export function localize(value: LocalizedText, language: 'nl' | 'en'): string {
  return value[language];
}

export function getTheoryLesson(theoryLessonId: string): TheoryLesson | undefined {
  return lessonById.get(theoryLessonId);
}

export function getTheoryConcept(conceptId: string): PsychologyConcept | undefined {
  return conceptById.get(conceptId);
}

export function getTheoryLessonsForWeek(weekId: string): TheoryLesson[] {
  return theoryLessons
    .filter((lesson) => lesson.weekId === weekId)
    .sort((a, b) => a.order - b.order);
}

export function getConceptsForTheoryLesson(lesson: TheoryLesson): PsychologyConcept[] {
  const conceptIds = new Set([
    ...lesson.conceptIds,
    ...psychologyConcepts
      .filter((concept) => concept.primaryTheoryLessonId === lesson.id)
      .map((concept) => concept.id)
  ]);
  return [...conceptIds]
    .map((conceptId) => getTheoryConcept(conceptId))
    .filter((concept): concept is PsychologyConcept => concept !== undefined);
}

export type WeekLearningPathItem =
  | { kind: 'core'; lesson: Lesson }
  | { kind: 'theory'; lesson: TheoryLesson };

/**
 * Meng theorie zichtbaar tussen de bestaande lessen zonder Week.lessons te wijzigen.
 * Daardoor blijven kernpercentages, ontgrendeling en bestaande voortgang exact gelijk.
 */
export function getWeekLearningPath(week: Week): WeekLearningPathItem[] {
  const items: Array<WeekLearningPathItem & { position: number }> = [
    ...week.lessons.map((lesson) => ({ kind: 'core' as const, lesson, position: lesson.order * 10 })),
    ...getTheoryLessonsForWeek(week.id).map((lesson) => ({
      kind: 'theory' as const,
      lesson,
      position: lesson.afterLessonOrder * 10 + lesson.order
    }))
  ];
  return items.sort((a, b) => a.position - b.position).map((item): WeekLearningPathItem =>
    item.kind === 'core'
      ? { kind: 'core', lesson: item.lesson }
      : { kind: 'theory', lesson: item.lesson }
  );
}

export function getFollowingTheoryLesson(theoryLessonId: string): TheoryLesson | undefined {
  const current = getTheoryLesson(theoryLessonId);
  if (!current) return undefined;
  return getTheoryLessonsForWeek(current.weekId).find((lesson) => lesson.order > current.order);
}

export function theoryProgress(doneIds: Set<string>): { done: number; total: number } {
  return {
    total: theoryLessons.length,
    done: theoryLessons.filter((lesson) => doneIds.has(lesson.id)).length
  };
}

/** Afgeronde theorie blijft terugleesbaar, ook als de weekinstelling later verandert. */
export function isTheoryLessonAccessible(
  theoryLessonId: string,
  doneIds: Set<string>,
  weekUnlocked: boolean
): boolean {
  return weekUnlocked || doneIds.has(theoryLessonId);
}
