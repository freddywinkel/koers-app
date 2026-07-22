import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MetaphorArt from '../components/MetaphorArt';
import FlashcardView from '../components/FlashcardView';
import { getLesson, getWeek, lessonCrumb } from '../content/helpers';
import { getFlashcards } from '../content/flashcards';
import { getSkill } from '../content/skills';
import { markLessonDone, useDoneLessonIds } from '../db/hooks';
import { followingLessonInWeek, useAllWeeksOpen } from '../lib/courseHooks';
import { navigateBackOr } from '../lib/navigation';
import { getBlockingLesson, isLessonUnlocked, isWeekComplete, isWeekUnlocked } from '../lib/unlock';
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
  const doneLessonIds = useDoneLessonIds();
  const allWeeksOpen = useAllWeeksOpen();
  const navigate = useNavigate();
  const [completing, setCompleting] = useState(false);

  if (!lesson) return <NotFound />;
  if (doneLessonIds === undefined) {
    return <p className="card sub" role="status">Je voortgang wordt geladen…</p>;
  }

  const week = getWeek(lesson.weekId);
  const weekUnlocked = allWeeksOpen || (week ? isWeekUnlocked(week, doneLessonIds) : false);
  const blockingLesson = weekUnlocked ? getBlockingLesson(lesson, doneLessonIds) : undefined;
  if (!isLessonUnlocked(lesson, doneLessonIds, allWeeksOpen)) {
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
          <span className="eyebrow min-w-0 truncate !text-ink-soft">{lessonCrumb(lesson)}</span>
        </div>
        <section className="card">
          <span className="chip">Nog vergrendeld</span>
          <h1 className="card-title mt-3">Deze les komt straks</h1>
          <p className="sub mt-1.5">
            {blockingLesson
              ? `Rond eerst Les ${blockingLesson.order}, ${blockingLesson.title}, af. Daarna gaat deze les vanzelf open.`
              : 'Rond eerst genoeg lessen van de eerdere weken af. Daarna gaat deze week vanzelf open.'}
          </p>
          <Link
            to={blockingLesson ? `/les/${blockingLesson.id}` : '/cursus'}
            className="btn-primary mt-4"
          >
            {blockingLesson ? `Ga naar Les ${blockingLesson.order}` : 'Terug naar je weken'}
          </Link>
        </section>
      </div>
    );
  }

  const isDone = doneLessonIds.has(lesson.id);
  const cards = getFlashcards(lesson.flashcardIds);
  const relatedSkills = lesson.relatedSkillIds.map(getSkill).filter((s) => s !== undefined);
  const nextInWeek = followingLessonInWeek(lesson);
  const nextIsUnlocked = nextInWeek ? isLessonUnlocked(nextInWeek, doneLessonIds, allWeeksOpen) : false;
  const hasBody = lesson.intro.length > 0;

  const goBack = () => {
    navigateBackOr(navigate, `/cursus/week/${lesson.weekId}`);
  };

  const completeLesson = async () => {
    if (completing) return;
    setCompleting(true);
    try {
      await markLessonDone(lesson.id);
      const completed = new Set(doneLessonIds);
      completed.add(lesson.id);
      const weekComplete = week ? isWeekComplete(week, completed) : false;
      if (nextInWeek) {
        navigate(`/les/${nextInWeek.id}`);
      } else {
        navigate(`/cursus/week/${lesson.weekId}`, { state: { weekComplete } });
      }
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="screen-stack">
      {/* Kruimel + terug */}
      <div className="flex items-center gap-3 px-0.5 pt-1">
        <button
          type="button"
          onClick={goBack}
          aria-label="Terug"
          className="grid h-10 w-10 flex-none place-items-center rounded-[14px] border border-line bg-sand text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 3.5 5.5 9 11 14.5" />
          </svg>
        </button>
        <span className="eyebrow min-w-0 truncate !text-ink-soft">{lessonCrumb(lesson)}</span>
      </div>

      <h1 className="hyphens-auto px-0.5 font-display text-[30px] font-semibold leading-[1.15] tracking-[-0.015em]">{lesson.title}</h1>

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
          <p className="eyebrow !text-ap-deep">Dit neem je mee deze week</p>
          <p className="mt-1.5 text-[15px] leading-[1.55] text-ink">{lesson.assignment}</p>
        </section>
      )}

      {/* Optionele vervolgstap naar een steunmiddel dat bij de les hoort. */}
      {lesson.supportCta && (
        <section className="card border-euca/25" aria-label="Passend steunmiddel">
          <p className="eyebrow">Meteen toepassen</p>
          {lesson.supportCta.description && (
            <p className="sub mt-1.5">{lesson.supportCta.description}</p>
          )}
          <Link to={lesson.supportCta.to} className="btn-primary mt-3.5">
            <span className="min-w-0">{lesson.supportCta.label}</span>
            <svg className="flex-none" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9h12m-5-5 5 5-5 5" />
            </svg>
          </Link>
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
            <Link key={s.id} to={`/oefenen/vaardigheden?skill=${encodeURIComponent(s.id)}`} className="chip">
              {s.name}
            </Link>
          ))}
        </div>
      )}

      {/* Afronden */}
      {isDone ? (
        <div className="flex flex-col gap-2.5">
          <p className="card flex items-center gap-2 text-[15px] font-bold text-ink">
            <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-eucatint text-euca-deep" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3.5 9.5 3.5 3.5 7.5-8" />
              </svg>
            </span>
            Voltooid — mooi gedaan.
          </p>
          {nextInWeek && nextIsUnlocked ? (
            <Link to={`/les/${nextInWeek.id}`} className="btn-primary">
              <span className="min-w-0">Volgende les: {nextInWeek.title}</span>
              <svg className="flex-none" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 9h12m-5-5 5 5-5 5" />
              </svg>
            </Link>
          ) : (
            <Link
              to={`/cursus/week/${lesson.weekId}`}
              state={{ weekComplete: week ? isWeekComplete(week, doneLessonIds) : false }}
              className="btn-primary"
            >
              <span className="min-w-0">
                {week && isWeekComplete(week, doneLessonIds) ? 'Deze week is helemaal afgerond' : 'Terug naar deze week'}
              </span>
              <svg className="flex-none" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 9h12m-5-5 5 5-5 5" />
              </svg>
            </Link>
          )}
        </div>
      ) : (
        <button
          type="button"
          className="btn-primary min-h-[54px] rounded-[18px] text-base"
          onClick={() => void completeLesson()}
          disabled={completing}
        >
          <span className="min-w-0">{completing ? 'Voortgang opslaan…' : 'Rond deze les af'}</span>
          <svg className="flex-none" width="19" height="19" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 9h12m-5-5 5 5-5 5" />
          </svg>
        </button>
      )}
    </div>
  );
}
