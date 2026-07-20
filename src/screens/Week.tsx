import { Link, useLocation, useParams } from 'react-router-dom';
import { getWeek, KIND_LABELS } from '../content/helpers';
import { useDoneLessonIds } from '../db/hooks';
import { useIsWeekUnlocked } from '../lib/courseHooks';
import NotFound from './NotFound';

/** Kind-chip: les = neutraal, oefening = eucalyptus, herhaling = warme abrikoos. */
function KindChip({ kind }: { kind: keyof typeof KIND_LABELS }) {
  const warm = kind === 'herhaling';
  return <span className={['chip', warm ? 'chip-warm' : '', '!px-2.5 !py-[4px] !text-[11px]'].join(' ')}>{KIND_LABELS[kind]}</span>;
}

/**
 * Weekdetail: lijst van lessen met afgerond-vinkjes en kind-chips.
 * Toont een warme afsluitkaart als Les.tsx hierheen navigeert na de laatste
 * les van de week (state.weekComplete). Vergrendelde weken (deep-link)
 * krijgen een zachte 'Nog vergrendeld'-kaart.
 */
export default function Week() {
  const { weekId } = useParams<{ weekId: string }>();
  const week = weekId ? getWeek(weekId) : undefined;
  const done = useDoneLessonIds();
  const location = useLocation();
  const weekComplete = (location.state as { weekComplete?: boolean } | null)?.weekComplete === true;

  // Hook altijd aanroepen (ook als week niet bestaat) met een veilige fallback.
  const unlocked = useIsWeekUnlocked(week ?? { id: '', number: 0, title: '', lessons: [] });

  if (!week) return <NotFound />;
  const doneSet = done ?? new Set<string>();
  const doneCount = week.lessons.filter((l) => doneSet.has(l.id)).length;

  if (!unlocked) {
    return (
      <div className="screen-stack">
        <div className="flex items-center gap-3 px-0.5 pt-1">
          <Link
            to="/cursus"
            aria-label="Terug naar cursus"
            className="grid h-10 w-10 flex-none place-items-center rounded-[14px] border border-line bg-sand text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 3.5 5.5 9 11 14.5" />
            </svg>
          </Link>
          <span className="eyebrow min-w-0 truncate !text-ink-soft">Week {week.number}</span>
        </div>
        <header className="px-1">
          <h1 className="hyphens-auto font-display text-[29px] font-semibold leading-[1.16] tracking-[-0.01em]">{week.title}</h1>
          {week.tagline && <p className="sub mt-1.5">{week.tagline}</p>}
        </header>
        <section className="card">
          <span className="chip">Nog vergrendeld</span>
          <h2 className="card-title mt-3">Deze week opent vanzelf</h2>
          <p className="sub mt-1.5">
            Rond ongeveer tweederde van week {week.number - 1} af, dan gaat deze week open. Rustig aan — het tempo
            bepaal je zelf.
          </p>
          <Link to="/cursus" className="btn-secondary mt-4 w-full">
            Terug naar je weken
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="screen-stack">
      <div className="flex items-center gap-3 px-0.5 pt-1">
        <Link
          to="/cursus"
          aria-label="Terug naar cursus"
          className="grid h-10 w-10 flex-none place-items-center rounded-[14px] border border-line bg-sand text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 3.5 5.5 9 11 14.5" />
          </svg>
        </Link>
        <span className="eyebrow min-w-0 truncate !text-ink-soft">Week {week.number}</span>
      </div>

      <header className="px-1">
        <h1 className="hyphens-auto font-display text-[29px] font-semibold leading-[1.16] tracking-[-0.01em]">{week.title}</h1>
        {week.tagline && <p className="sub mt-1.5">{week.tagline}</p>}
        <p className="sub mt-1">
          {doneCount} van {week.lessons.length} lessen afgerond
        </p>
      </header>

      {weekComplete && (
        <section className="card !bg-eucatint">
          <p className="eyebrow">Week {week.number} afgerond</p>
          <h2 className="card-title mt-1">Mooi werk.</h2>
          <p className="mt-1.5 text-[15px] leading-[1.55] text-ink">
            Je hebt deze week helemaal gedaan. Neem even een rustig moment voor jezelf — je mag trots zijn. De volgende
            week staat voor je klaar wanneer jij er klaar voor bent.
          </p>
        </section>
      )}

      {week.lessons.map((lesson) => {
        const isDone = doneSet.has(lesson.id);
        return (
          <Link key={lesson.id} to={`/les/${lesson.id}`} className="card flex items-center gap-3.5 transition-transform active:scale-[0.99]">
            <span
              className={[
                'grid h-10 w-10 flex-none place-items-center rounded-[14px] font-display text-lg font-semibold',
                isDone ? 'bg-eucatint text-euca-deep' : 'bg-dune text-ink'
              ].join(' ')}
              aria-hidden="true"
            >
              {isDone ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3.5 9.5 3.5 3.5 7.5-8" />
                </svg>
              ) : (
                lesson.order
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold text-ink">{lesson.title}</span>
              <span className="mt-1.5 flex flex-wrap items-center gap-2">
                <KindChip kind={lesson.kind} />
                <span className="sub">
                  {lesson.minutes ? `± ${lesson.minutes} min` : ''}
                  {isDone ? `${lesson.minutes ? ' · ' : ''}afgerond` : ''}
                </span>
              </span>
            </span>
            <svg className="flex-none text-ink-soft" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6.5 3.5 11 9l-4.5 5.5" />
            </svg>
          </Link>
        );
      })}
    </div>
  );
}
