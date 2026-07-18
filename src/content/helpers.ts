import { curriculum } from './curriculum';
import type { Lesson, Week } from './types';

/**
 * Contenthelpers — lezen uit de statische contentlaag.
 * Pure functies; de voortgang (doneSet) komt uit src/db/hooks.ts.
 */

/** Alle lessen van alle weken, in cursusvolgorde. */
export function allLessons(): Lesson[] {
  return curriculum.flatMap((w) => w.lessons);
}

export function getWeek(weekId: string): Week | undefined {
  return curriculum.find((w) => w.id === weekId);
}

export function getLesson(lessonId: string): Lesson | undefined {
  return allLessons().find((l) => l.id === lessonId);
}

/** Kruimel zoals in het ontwerp: "Week 2 · Les 3". */
export function lessonCrumb(lesson: Lesson): string {
  const week = getWeek(lesson.weekId);
  return `Week ${week?.number ?? '?'} · Les ${lesson.order}`;
}

/** De eerstvolgende les die nog niet is afgerond (cursusvolgorde). */
export function getNextLesson(done: Set<string>): Lesson | undefined {
  return allLessons().find((l) => !done.has(l.id));
}

/** De les direct na een gegeven les (voor "volgende les" na afronden). */
export function getFollowingLesson(lessonId: string): Lesson | undefined {
  const all = allLessons();
  const i = all.findIndex((l) => l.id === lessonId);
  return i >= 0 ? all[i + 1] : undefined;
}

export interface WeekProgress {
  total: number;
  done: number;
}

/** Aantal afgeronde lessen per week. */
export function weekProgress(week: Week, done: Set<string>): WeekProgress {
  return { total: week.lessons.length, done: week.lessons.filter((l) => done.has(l.id)).length };
}

export const KIND_LABELS: Record<Lesson['kind'], string> = {
  lesson: 'Les',
  oefening: 'Oefening',
  herhaling: 'Herhaling'
};
