import { curriculum } from '../content/curriculum';
import type { Lesson, Week } from '../content/types';

/**
 * Ontgrendellogica voor weken (stage 3 — progress-engine).
 * ========================================================
 * Regels:
 *  - Week 1 is altijd open.
 *  - Week N is open zodra ≥ 60% van iedere eerdere week 'done' is.
 *    Daardoor kan oude of beschadigde toekomstige voortgang geen weken overslaan.
 *  - De instelling 'alle-weken-open' (settings) opent alles; die wordt
 *    via useSettings gelezen in src/lib/courseHooks.ts (hooks mogen hier
 *    niet — deze functie blijft puur en de signature blijft gelijk).
 *
 * Aanroep: src/lib/courseHooks.ts, src/screens/Cursus.tsx.
 */
export function isWeekUnlocked(week: Week, done: Set<string>): boolean {
  if (week.number <= 1) return true;
  const earlierWeeks = curriculum.filter((candidate) => candidate.number < week.number);
  if (earlierWeeks.length !== week.number - 1) return false;
  return earlierWeeks.every((earlierWeek) => {
    const total = earlierWeek.lessons.length;
    if (total === 0) return true;
    const doneCount = earlierWeek.lessons.filter((lesson) => done.has(lesson.id)).length;
    return doneCount / total >= 0.6;
  });
}

/** Eerste eerdere les in dezelfde week die nog niet is afgerond. */
export function getBlockingLesson(lesson: Lesson, done: Set<string>): Lesson | undefined {
  const week = curriculum.find((candidate) => candidate.id === lesson.weekId);
  if (!week) return undefined;
  return [...week.lessons]
    .sort((a, b) => a.order - b.order)
    .find((candidate) => candidate.order < lesson.order && !done.has(candidate.id));
}

/**
 * Een les is bereikbaar als de week open is én alle eerdere lessen van die
 * week af zijn. Afgeronde lessen blijven altijd terugleesbaar, ook voor oude
 * voortgang die vóór deze sequentiële regel is opgeslagen.
 */
export function isLessonUnlocked(lesson: Lesson, done: Set<string>, allWeeksOpen = false): boolean {
  if (allWeeksOpen) return true;
  if (done.has(lesson.id)) return true;
  const week = curriculum.find((candidate) => candidate.id === lesson.weekId);
  if (!week) return false;
  if (!isWeekUnlocked(week, done)) return false;
  return getBlockingLesson(lesson, done) === undefined;
}

/** Een week is pas echt voltooid als iedere les als afgerond is opgeslagen. */
export function isWeekComplete(week: Week, done: Set<string>): boolean {
  return week.lessons.length > 0 && week.lessons.every((lesson) => done.has(lesson.id));
}

/** Settings-key die álle weken opent (waarde '1' | 'true' | 'ja'). */
export const ALL_WEEKS_OPEN_KEY = 'alle-weken-open';

/** Interpreteer de settings-waarde van 'alle-weken-open' als boolean. */
export function isAllWeeksOpen(value: string): boolean {
  const v = value.trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'ja';
}
