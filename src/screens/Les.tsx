import { Link, useNavigate, useParams } from 'react-router-dom';
import MetaphorArt from '../components/MetaphorArt';
import FlashcardView from '../components/FlashcardView';
import { getLesson, lessonCrumb } from '../content/helpers';
import { getFlashcards } from '../content/flashcards';
import { getSkill } from '../content/skills';
import { markLessonDone, useLessonProgress } from '../db/hooks';
import { followingLessonInWeek } from '../lib/courseHooks';
import NotFound from './NotFound';

function stepTime(seconds?: number): string | null {
  if (!seconds) return null;
  return seconds >= 60 ? `± ${Math.round(seconds / 60)} min` : `± ${seconds} sec`;
}

/**
 * Lesrenderer — leest volledig uit de contentlaag (src/content).
 * 'Markeer als voltooid' rondt de les af en navigeert naar de volgende les
 * binnen deze week. Was dit de laatste les, dan ga je terug naar de week met
 * een warme afsluitkaart (state.weekComplete op Week.tsx).
 */
export default function Les() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const lesson = lessonId ? getLesson(lessonId) : undefined;
  const progress = useLessonProgress(lessonId ?? '');
  const navigate = useNavigate();

  if (!lesson) return <NotFound />;

  const isDone = progress?.status === 'done';
  const cards = getFlashcards(lesson.flashcardIds);
  const relatedSkills = lesson.relatedSkillIds.map(getSkill).filter((s) => s !== undefined);
  const nextInWeek = followingLessonInWeek(lesson);
  const hasBody = lesson.intro.length > 0;

  const completeLesson = () => {
    void markLessonDone(lesson.id).then(() => {
      if (nextInWeek) {
        navigate(`/les/${nextInWeek.id}`);
      } else {
        navigate(`/cursus/week/${lesson.weekId}`, { state: { weekComplete: true } });
      }
    });
  };

  return (
    <div className="screen-stack">
      {/* Kruimel + terug */}
      <div className="flex items-center gap-3 px-0.5 pt-1">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Terug"
          className="grid h-10 w-10 flex-none place-items-center rounded-[14px] border border-line bg-sand text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 3.5 5.5 9 11 14.5" />
          </svg>
        </button>
        <span className="eyebrow !text-ink-soft">{lessonCrumb(lesson)}</span>
      </div>

      <h1 className="px-0.5 font-display text-[30px] font-semibold leading-[1.15] tracking-[-0.015em]">{lesson.title}</h1>

      {!hasBody && (
        <section className="card">
          <h2 className="card-title">Deze les wordt nog geschreven</h2>
          <p className="sub mt-1.5">
            Kom binnenkort terug. De opbouw staat al klaar: uitleg, een beeld om te onthouden, een oefening en iets om
            mee te nemen.
          </p>
        </section>
      )}

      {/* Intro-alinea's */}
      {lesson.intro.map((para, i) => (
        <p key={i} className="px-0.5 text-[15px] leading-[1.55] text-ink">
          {para}
        </p>
      ))}

      {/* Beeldkaart */}
      {lesson.metaphorCard && (
        <section className="card overflow-hidden !p-0">
          <div className="h-[148px] bg-dune dark:opacity-90">
            <MetaphorArt art={lesson.metaphorCard.art} />
          </div>
          <div className="px-[18px] pb-[18px] pt-[15px]">
            <p className="eyebrow">Beeld om te onthouden</p>
            <h2 className="card-title mt-1">{lesson.metaphorCard.title}</h2>
            <p className="mt-1.5 text-sm leading-[1.55] text-ink-soft">{lesson.metaphorCard.text}</p>
          </div>
        </section>
      )}

      {/* Chips */}
      {(lesson.minutes || (lesson.tags ?? []).length > 0) && (
        <div className="flex flex-wrap gap-2 px-0.5">
          {lesson.minutes && <span className="chip">± {lesson.minutes} min</span>}
          {(lesson.tags ?? []).map((t) => (
            <span key={t} className="chip chip-warm">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Oefening */}
      {lesson.exercise && (
        <section className="card">
          <p className="eyebrow">Oefening</p>
          <h2 className="card-title mt-1">{lesson.exercise.title}</h2>
          <ol className="mt-3 flex flex-col gap-3">
            {lesson.exercise.steps.map((step) => (
              <li key={step.n} className="flex gap-3">
                <span className="grid h-8 w-8 flex-none place-items-center rounded-xl bg-eucatint text-sm font-extrabold text-euca-deep">
                  {step.n}
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-ink">
                    {step.title}
                    {stepTime(step.seconds) && <span className="ml-2 text-xs font-bold text-ink-soft">{stepTime(step.seconds)}</span>}
                  </p>
                  <p className="mt-0.5 text-sm leading-[1.55] text-ink-soft">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Nabespreking */}
      {lesson.reflection && (
        <section className="card !bg-dune">
          <p className="eyebrow">Even terugkijken</p>
          <p className="mt-1.5 text-[15px] leading-[1.55] text-ink">{lesson.reflection}</p>
        </section>
      )}

      {/* Huiswerk */}
      {lesson.assignment && (
        <section className="card border-ap-border">
          <p className="eyebrow !text-ap-deep">Neem je mee deze week</p>
          <p className="mt-1.5 text-[15px] leading-[1.55] text-ink">{lesson.assignment}</p>
        </section>
      )}

      {/* Flashcards */}
      {cards.length > 0 && (
        <section className="flex flex-col gap-3">
          <p className="eyebrow px-0.5">Onthouden voor later</p>
          {cards.map((c) => (
            <FlashcardView key={c.id} card={c} />
          ))}
        </section>
      )}

      {/* Gerelateerde vaardigheden */}
      {relatedSkills.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-0.5">
          <span className="sub">Past bij deze les:</span>
          {relatedSkills.map((s) => (
            <Link key={s.id} to="/oefenen" className="chip">
              {s.name}
            </Link>
          ))}
        </div>
      )}

      {/* Afronden */}
      {isDone ? (
        <div className="flex flex-col gap-2.5">
          <p className="card flex items-center gap-2 text-[15px] font-bold text-ink">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-eucatint text-euca-deep" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3.5 9.5 3.5 3.5 7.5-8" />
              </svg>
            </span>
            Voltooid — mooi gedaan.
          </p>
          {nextInWeek ? (
            <Link to={`/les/${nextInWeek.id}`} className="btn-primary">
              Volgende les: {nextInWeek.title}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 9h12m-5-5 5 5-5 5" />
              </svg>
            </Link>
          ) : (
            <Link to={`/cursus/week/${lesson.weekId}`} state={{ weekComplete: true }} className="btn-primary">
              Dit was de laatste les van deze week
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 9h12m-5-5 5 5-5 5" />
              </svg>
            </Link>
          )}
        </div>
      ) : (
        <button type="button" className="btn-primary min-h-[54px] rounded-[18px] text-base" onClick={completeLesson}>
          Markeer als voltooid
          <svg width="19" height="19" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 9h12m-5-5 5 5-5 5" />
          </svg>
        </button>
      )}
    </div>
  );
}
