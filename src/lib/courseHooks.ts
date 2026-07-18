import { useMemo } from 'react';
import { curriculum } from '../content/curriculum';
import type { Lesson, Week } from '../content/types';
import { useDoneLessonIds, useSettings } from '../db/hooks';
import { ALL_WEEKS_OPEN_KEY, isAllWeeksOpen, isWeekUnlocked } from './unlock';

/**
 * Course-hooks — combineren content, voortgang en instellingen.
 * -------------------------------------------------------------
 * Staat bewust NIET in src/db/hooks.ts (die blijft ongewijzigd).
 *  - useAllWeeksOpen()        · instelling 'alle-weken-open' actief?
 *  - useIsWeekUnlocked(week)  · ontgrendeld, incl. instelling-override
 *  - useNextCourseLesson()    · eerste onafgeronde les van de vroegste
 *                               ontgrendelde week (voor Vandaag)
 */

/** true als de instelling 'alle-weken-open' álle weken ontgrendelt. */
export function useAllWeeksOpen(): boolean {
  const { get } = useSettings();
  return isAllWeeksOpen(get(ALL_WEEKS_OPEN_KEY));
}

/** Is deze week ontgrendeld? Houdt rekening met 'alle-weken-open'. */
export function useIsWeekUnlocked(week: Week): boolean {
  const done = useDoneLessonIds();
  const allOpen = useAllWeeksOpen();
  return useMemo(() => allOpen || isWeekUnlocked(week, done ?? new Set<string>()), [allOpen, week, done]);
}

export interface NextCourseLesson {
  /** Nog aan het laden (voortgang nog niet opgehaald). */
  ready: boolean;
  /** De eerstvolgende les, of undefined als alles afgerond/geblokkeerd is. */
  lesson?: Lesson;
  /** De week waar de les bij hoort. */
  week?: Week;
  /** true als elke les van de cursus is afgerond. */
  allDone: boolean;
}

/**
 * De les voor 'Vandaag': de eerste onafgeronde les van de vroegste
 * ontgrendelde week. Zijn alle ontgrendelde lessen klaar, dan is er
 * geen suggestie ('Klaar voor vandaag'-staat op Vandaag).
 */
export function useNextCourseLesson(): NextCourseLesson {
  const done = useDoneLessonIds();
  const allOpen = useAllWeeksOpen();

  return useMemo(() => {
    if (done === undefined) return { ready: false, allDone: false };
    for (const week of curriculum) {
      if (!allOpen && !isWeekUnlocked(week, done)) continue;
      const lesson = week.lessons.find((l) => !done.has(l.id));
      if (lesson) return { ready: true, lesson, week, allDone: false };
    }
    const anyDone = done.size > 0;
    return { ready: true, allDone: anyDone };
  }, [done, allOpen]);
}

/** De les direct na `lesson` binnen dézelfde week (undefined = laatste les van de week). */
export function followingLessonInWeek(lesson: Lesson): Lesson | undefined {
  const week = curriculum.find((w) => w.id === lesson.weekId);
  if (!week) return undefined;
  return week.lessons.filter((l) => l.order > lesson.order).sort((a, b) => a.order - b.order)[0];
}
