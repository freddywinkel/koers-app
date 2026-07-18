import { curriculum } from '../content/curriculum';
import type { Week } from '../content/types';

/**
 * Ontgrendellogica voor weken (stage 3 — progress-engine).
 * ========================================================
 * Regels:
 *  - Week 1 is altijd open.
 *  - Week N is open zodra ≥ 60% van de lessen van week N-1 'done' is.
 *  - De instelling 'alle-weken-open' (settings) opent alles; die wordt
 *    via useSettings gelezen in src/lib/courseHooks.ts (hooks mogen hier
 *    niet — deze functie blijft puur en de signature blijft gelijk).
 *
 * Aanroep: src/lib/courseHooks.ts, src/screens/Cursus.tsx.
 */
export function isWeekUnlocked(week: Week, done: Set<string>): boolean {
  if (week.number <= 1) return true;
  const prev = curriculum.find((w) => w.number === week.number - 1);
  if (!prev) return false;
  const total = prev.lessons.length;
  if (total === 0) return true;
  const doneCount = prev.lessons.filter((l) => done.has(l.id)).length;
  return doneCount / total >= 0.6;
}

/** Settings-key die álle weken opent (waarde '1' | 'true' | 'ja'). */
export const ALL_WEEKS_OPEN_KEY = 'alle-weken-open';

/** Interpreteer de settings-waarde van 'alle-weken-open' als boolean. */
export function isAllWeeksOpen(value: string): boolean {
  const v = value.trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'ja';
}
