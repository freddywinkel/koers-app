import { Link } from 'react-router';
import KoersCompass from '../components/KoersCompass';
import { curriculum } from '../content/curriculum';
import { courseProgress as getCourseProgress, weekProgress } from '../content/helpers';
import { theoryProgress } from '../content/theory';
import { useDoneLessonIds } from '../db/hooks';
import { getLanguage } from '../i18n';
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
  const language = getLanguage();
  const theory = theoryProgress(doneSet);
  const theoryCopy = language === 'en'
    ? {
        eyebrow: 'New: theory route',
        title: 'Understand what you practise',
        text: '24 short ACT and VERS theory lessons, plus a searchable glossary. Theory is placed between the weekly lessons but never blocks your practice.',
        progress: `${theory.done} of ${theory.total} read`,
        open: 'Open theory & terms'
      }
    : {
        eyebrow: 'Nieuw: theorieroute',
        title: 'Begrijp wat je oefent',
        text: '24 korte ACT- en VERS-theorielessen, plus een doorzoekbare begrippenlijst. Theorie staat tussen de weeklessen, maar blokkeert het oefenen nooit.',
        progress: `${theory.done} van ${theory.total} gelezen`,
        open: 'Open theorie & begrippen'
      };
  const coreProgress = getCourseProgress(doneSet);
  const currentWeekId = curriculum.find((week) => {
    const unlocked = allOpen || isWeekUnlocked(week, doneSet);
    const progress = weekProgress(week, doneSet);
    return unlocked && progress.done < progress.total;
  })?.id;

  return (
    <div className="screen-stack course-screen">
      <header className="card course-overview">
        <KoersCompass className="course-compass" />
        <div className="course-overview-copy">
          <p className="eyebrow">Cursus</p>
          <h1 className="mt-1.5 font-display text-[29px] font-semibold leading-[1.16] tracking-[-0.01em]">Jouw 12 weken</h1>
          <p className="sub mt-1.5">
            Rustig tempo, één week tegelijk. Een nieuwe week opent als je ongeveer tweederde van de vorige week hebt
            gedaan. Je mag altijd terug naar eerdere lessen.
          </p>
        </div>
        <div className="route-progress">
          <div className="route-progress-label">
            <span>{coreProgress.done} van {coreProgress.total} lessen afgerond</span>
            <span>{coreProgress.percent}%</span>
          </div>
          <span
            className="route-progress-track"
            role="progressbar"
            aria-label="Voortgang"
            aria-valuemin={0}
            aria-valuemax={coreProgress.total}
            aria-valuenow={coreProgress.done}
          >
            <span style={{ width: `${coreProgress.percent}%` }} />
          </span>
        </div>
      </header>

      <Link to="/theorie" className="card flex items-center gap-3.5 border-ap-border transition-transform active:scale-[0.99]" data-no-translate>
        <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-apricot-soft text-ap-deep" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 5.5A3.5 3.5 0 0 1 8 2h4v17H8a3.5 3.5 0 0 0-3.5 3.5v-17Z" />
            <path d="M19.5 5.5A3.5 3.5 0 0 0 16 2h-4v17h4a3.5 3.5 0 0 1 3.5 3.5v-17Z" />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="eyebrow !text-ap-deep">{theoryCopy.eyebrow}</span>
          <span className="card-title mt-0.5 block">{theoryCopy.title}</span>
          <span className="sub mt-1 block">{theoryCopy.text}</span>
          <span className="mt-2 block text-xs font-extrabold text-euca-deep">{theoryCopy.progress} · {theoryCopy.open}</span>
        </span>
        <svg className="flex-none text-ink-soft" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6.5 3.5 11 9l-4.5 5.5" />
        </svg>
      </Link>

      <ol className="course-route-grid">
        {curriculum.map((week) => {
          const unlocked = allOpen || isWeekUnlocked(week, doneSet);
          const progress = weekProgress(week, doneSet);
          const frac = progress.total > 0 ? progress.done / progress.total : 0;
          const complete = unlocked && progress.done === progress.total && progress.total > 0;
          const current = week.id === currentWeekId;

          const inner = (
            <>
              <span
                className={[
                  'course-week-number grid h-12 w-12 flex-none place-items-center rounded-2xl font-display text-xl font-semibold',
                  unlocked ? 'bg-eucatint text-euca-deep' : 'bg-dune text-ink-soft'
                ].join(' ')}
              >
                {week.number}
              </span>
              <span className="min-w-0 flex-1">
                <span className="card-title block">{week.title}</span>
                <span className="sub mt-0.5 block">
                  {unlocked
                    ? complete
                      ? `${week.lessons.length} lessen · helemaal afgerond`
                      : `${week.lessons.length} lessen · ${progress.done} van ${progress.total} afgerond`
                    : `${week.lessons.length} lessen`}
                </span>
                {unlocked && (
                  <span className="course-week-progress mt-2 block" aria-hidden="true">
                    <span style={{ width: `${Math.round(frac * 100)}%` }} />
                  </span>
                )}
              </span>
              {unlocked ? (
                <svg className="course-week-arrow flex-none text-ink-soft" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6.5 3.5 11 9l-4.5 5.5" />
                </svg>
              ) : (
                <span className="chip flex-none">Nog vergrendeld</span>
              )}
            </>
          );

          return (
            <li key={week.id} className="course-route-item">
              {unlocked ? (
                <Link
                  to={`/cursus/week/${week.id}`}
                  className={[
                    'card course-week-card flex items-center gap-3.5 transition-transform active:scale-[0.99]',
                    current ? 'is-current' : '',
                    complete ? 'is-complete' : ''
                  ].join(' ')}
                >
                  {inner}
                </Link>
              ) : (
                <div
                  className="card course-week-card is-locked flex items-center gap-3.5 opacity-60"
                  aria-label={`Week ${week.number} ${week.title} — nog vergrendeld`}
                >
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
