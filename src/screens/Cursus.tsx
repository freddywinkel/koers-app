import { Link } from 'react-router-dom';
import { curriculum } from '../content/curriculum';
import { weekProgress } from '../content/helpers';
import { useDoneLessonIds } from '../db/hooks';
import { useAllWeeksOpen } from '../lib/courseHooks';
import { isWeekUnlocked } from '../lib/unlock';

/**
 * Cursusoverzicht: de 12 weken als kaarten met voortgang en ontgrendelstatus.
 * Vergrendeld = zacht gedempt (Noordzeemist: geen alarmkleuren), met chip
 * 'Nog vergrendeld'. Instelling 'alle-weken-open' opent alles.
 */
export default function Cursus() {
  const done = useDoneLessonIds();
  const allOpen = useAllWeeksOpen();
  const doneSet = done ?? new Set<string>();

  return (
    <div className="screen-stack">
      <header className="px-1 pt-2">
        <p className="eyebrow">Cursus</p>
        <h1 className="mt-1.5 font-display text-[29px] font-semibold leading-[1.16] tracking-[-0.01em]">Jouw 12 weken</h1>
        <p className="sub mt-1.5">
          Rustig tempo, één week tegelijk. Een nieuwe week opent als je ongeveer tweederde van de vorige week hebt
          gedaan. Je mag altijd terug naar eerdere lessen.
        </p>
      </header>

      {curriculum.map((week) => {
        const unlocked = allOpen || isWeekUnlocked(week, doneSet);
        const progress = weekProgress(week, doneSet);
        const frac = progress.total > 0 ? progress.done / progress.total : 0;
        const complete = unlocked && progress.done === progress.total && progress.total > 0;

        const inner = (
          <>
            <span
              className={[
                'grid h-12 w-12 flex-none place-items-center rounded-2xl font-display text-xl font-semibold',
                unlocked ? 'bg-eucatint text-euca-deep' : 'bg-dune text-ink-soft'
              ].join(' ')}
            >
              {week.number}
            </span>
            <span className="min-w-0 flex-1">
              <span className="card-title block truncate">{week.title}</span>
              <span className="sub mt-0.5 block">
                {unlocked
                  ? complete
                    ? `${week.lessons.length} lessen · helemaal afgerond`
                    : `${week.lessons.length} lessen · ${progress.done} van ${progress.total} afgerond`
                  : `${week.lessons.length} lessen`}
              </span>
              {unlocked && (
                <span className="mt-2 block h-1.5 w-full overflow-hidden rounded-full bg-dune" aria-hidden="true">
                  <span className="block h-full rounded-full bg-euca" style={{ width: `${Math.round(frac * 100)}%` }} />
                </span>
              )}
            </span>
            {unlocked ? (
              <svg className="flex-none text-ink-soft" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6.5 3.5 11 9l-4.5 5.5" />
              </svg>
            ) : (
              <span className="chip flex-none">Nog vergrendeld</span>
            )}
          </>
        );

        return unlocked ? (
          <Link key={week.id} to={`/cursus/week/${week.id}`} className="card flex items-center gap-3.5 transition-transform active:scale-[0.99]">
            {inner}
          </Link>
        ) : (
          <div
            key={week.id}
            className="card flex items-center gap-3.5 opacity-60"
            aria-label={`Week ${week.number} ${week.title} — nog vergrendeld`}
          >
            {inner}
          </div>
        );
      })}
    </div>
  );
}
