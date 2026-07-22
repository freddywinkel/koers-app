import { Link } from 'react-router-dom';
import { allLessons, getWeek } from '../content/helpers';
import { useDoneLessonIds } from '../db/hooks';
import { useAllWeeksOpen } from '../lib/courseHooks';
import { getBlockingLesson, isLessonUnlocked, isWeekUnlocked } from '../lib/unlock';

/** Lijstpagina met alle oefeningen uit de cursuslessen — ook los van de week te doen. */
export default function OefeningenLijst() {
  const oefeningen = allLessons().filter((lesson) => lesson.exercise !== undefined);
  const doneLessonIds = useDoneLessonIds();
  const allWeeksOpen = useAllWeeksOpen();
  const done = doneLessonIds ?? new Set<string>();

  return (
    <div className="screen-stack">
      <header className="px-1 pt-2">
        <Link
          to="/oefenen"
          className="inline-flex min-h-[44px] items-center text-[13px] font-bold text-euca-deep"
        >
          ← Terug naar Oefenen
        </Link>
        <p className="eyebrow">Oefenen</p>
        <h1 className="mt-1.5 font-display text-[29px] font-semibold leading-[1.16] tracking-[-0.01em]">Oefeningen</h1>
        <p className="sub mt-1.5">
          Alle oefeningen uit de cursuslessen. Wat bij je cursusvoortgang past, is meteen beschikbaar.
        </p>
      </header>

      {/* Oefeningen uit de cursus */}
      <section className="flex flex-col gap-3">
        <div className="card flex flex-col divide-y divide-line !p-0">
          {doneLessonIds === undefined ? (
            <p className="sub px-[18px] py-4" role="status">Je oefeningen worden geladen…</p>
          ) : oefeningen.map((les) => {
            const week = getWeek(les.weekId);
            const weekAccessible = allWeeksOpen || (week ? isWeekUnlocked(week, done) : false);
            const accessible = isLessonUnlocked(les, done, allWeeksOpen);
            const blockingLesson = weekAccessible ? getBlockingLesson(les, done) : undefined;
            const inner = (
              <>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold text-ink">{les.title}</span>
                <span className="sub mt-0.5 block">
                  Week {week?.number}
                  {les.minutes ? ` · ± ${les.minutes} min` : ''}
                  {!accessible
                    ? blockingLesson
                      ? ` · eerst Les ${blockingLesson.order}`
                      : ' · week nog vergrendeld'
                    : ''}
                </span>
              </span>
              <svg className="flex-none text-ink-soft" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {accessible ? <path d="M6.5 3.5 11 9l-4.5 5.5" /> : <path d="M6 7V5.5a3 3 0 0 1 6 0V7m-7 0h8v7H5V7Z" />}
              </svg>
              </>
            );
            return accessible ? (
              <Link key={les.id} to={`/les/${les.id}`} className="flex items-center gap-3 px-[18px] py-3.5">
                {inner}
              </Link>
            ) : (
              <div
                key={les.id}
                className="flex items-center gap-3 px-[18px] py-3.5 opacity-60"
                aria-label={`${les.title} — nog vergrendeld`}
              >
                {inner}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
