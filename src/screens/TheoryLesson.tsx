import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { getWeek } from '../content/helpers';
import {
  getConceptsForTheoryLesson,
  getFollowingTheoryLesson,
  getTheoryLesson,
  getTheorySource,
  isTheoryLessonAccessible,
  localize
} from '../content/theory';
import { markLessonDone, useDoneLessonIds } from '../db/hooks';
import { getLanguage } from '../i18n';
import { useAllWeeksOpen, useIsWeekUnlocked } from '../lib/courseHooks';
import NotFound from './NotFound';

export default function TheoryLesson() {
  const { theoryId } = useParams<{ theoryId: string }>();
  const lesson = theoryId ? getTheoryLesson(theoryId) : undefined;
  const week = lesson ? getWeek(lesson.weekId) : undefined;
  const doneIds = useDoneLessonIds();
  const allWeeksOpen = useAllWeeksOpen();
  const unlocked = useIsWeekUnlocked(week ?? { id: '', number: 0, title: '', lessons: [] });
  const language = getLanguage();
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'error'>('idle');

  if (!lesson || !week) return <NotFound />;
  if (doneIds === undefined) {
    return <p className="card sub" role="status">{language === 'en' ? 'Loading your progress…' : 'Je voortgang wordt geladen…'}</p>;
  }

  const copy = language === 'en'
    ? {
        back: 'Back to this week', theory: 'Theory', personal: 'Personal study', read: 'Read',
        concepts: 'Terms in this lesson', conceptsIntro: 'Open a term for the full explanation and an everyday example.',
        also: 'Also called', deeper: 'A little deeper', example: 'Example', notMeaning: 'This does not mean',
        important: 'Important', sources: 'Sources used', sourceNote: 'The wording in Koers is original. These links let you check the public source material.',
        mark: 'Mark as read', saving: 'Saving…', saveError: 'Saving failed. Nothing else was changed; please try again.', marked: 'Read — saved locally.', next: 'Next theory lesson',
        weekRoute: 'Back to the week route', scope: 'For personal self-study. This is psychoeducation, not a diagnosis, treatment or crisis service.',
        locked: 'This week is still locked', lockedBody: 'Complete enough of the earlier course weeks first. The theory never changes your core progress.',
        course: 'Back to the course', reflection: 'Pause and reflect', takeaway: 'Remember this'
      }
    : {
        back: 'Terug naar deze week', theory: 'Theorie', personal: 'Persoonlijke zelfstudie', read: 'Gelezen',
        concepts: 'Begrippen uit deze les', conceptsIntro: 'Open een begrip voor de volledige uitleg en een alledaags voorbeeld.',
        also: 'Ook genoemd', deeper: 'Iets dieper', example: 'Voorbeeld', notMeaning: 'Dit betekent niet',
        important: 'Belangrijk', sources: 'Gebruikte bronnen', sourceNote: 'De teksten in Koers zijn origineel geschreven. Via deze links kun je het publieke bronmateriaal controleren.',
        mark: 'Markeer als gelezen', saving: 'Opslaan…', saveError: 'Opslaan lukte niet. Er is verder niets veranderd; probeer het opnieuw.', marked: 'Gelezen — lokaal opgeslagen.', next: 'Volgende theorieles',
        weekRoute: 'Terug naar de weekroute', scope: 'Voor persoonlijke zelfstudie. Dit is psycho-educatie, geen diagnose, behandeling of crisisdienst.',
        locked: 'Deze week is nog vergrendeld', lockedBody: 'Rond eerst genoeg van de eerdere cursusweken af. Theorie verandert je kernvoortgang nooit.',
        course: 'Terug naar de cursus', reflection: 'Sta even stil', takeaway: 'Onthoud dit'
      };

  if (!isTheoryLessonAccessible(lesson.id, doneIds, allWeeksOpen || unlocked)) {
    return (
      <div className="screen-stack" data-no-translate>
        <Link to="/cursus" className="btn-secondary w-fit">{copy.course}</Link>
        <section className="card">
          <span className="chip chip-warm">{copy.theory}</span>
          <h1 className="card-title mt-3">{copy.locked}</h1>
          <p className="sub mt-1.5">{copy.lockedBody}</p>
        </section>
      </div>
    );
  }

  const concepts = getConceptsForTheoryLesson(lesson);
  const sources = lesson.sourceIds.map(getTheorySource).filter((source) => source !== undefined);
  const following = getFollowingTheoryLesson(lesson.id);
  const isDone = doneIds.has(lesson.id);
  const markAsRead = async () => {
    if (isDone || saveState === 'saving') return;
    setSaveState('saving');
    try {
      await markLessonDone(lesson.id);
      setSaveState('idle');
    } catch {
      setSaveState('error');
    }
  };

  return (
    <article className="screen-stack theory-lesson" data-no-translate>
      <div className="flex items-center gap-3 px-0.5 pt-1">
        <Link
          to={`/cursus/week/${lesson.weekId}`}
          aria-label={copy.back}
          className="grid h-10 w-10 flex-none place-items-center rounded-[14px] border border-line bg-sand text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 3.5 5.5 9 11 14.5" />
          </svg>
        </Link>
        <span className="eyebrow min-w-0 truncate !text-ink-soft">
          {language === 'en' ? `Week ${week.number} · Theory ${lesson.order}` : `Week ${week.number} · Theorie ${lesson.order}`}
        </span>
      </div>

      <header className="card border-ap-border theory-lesson-hero">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip chip-warm">{copy.theory}</span>
          <span className="chip">± {lesson.minutes} min</span>
          <span className="chip">{copy.personal}</span>
          {isDone && <span className="chip !bg-eucatint !text-euca-deep">✓ {copy.read}</span>}
        </div>
        <h1 className="mt-3 font-display text-[30px] font-semibold leading-[1.15] tracking-[-0.015em]">
          {localize(lesson.title, language)}
        </h1>
        <p className="mt-2 text-[15px] leading-[1.6] text-ink-soft">{localize(lesson.summary, language)}</p>
        <p className="mt-3 rounded-2xl bg-dune px-3.5 py-3 text-[13px] leading-[1.5] text-ink-soft">{copy.scope}</p>
      </header>

      {lesson.intro.map((paragraph, index) => (
        <p key={index} className="px-0.5 text-[15px] leading-[1.65] text-ink">
          {localize(paragraph, language)}
        </p>
      ))}

      {lesson.blocks.map((block) => (
        <section key={block.id} className="card theory-block">
          <h2 className="card-title">{localize(block.heading, language)}</h2>
          <div className="mt-2.5 flex flex-col gap-2.5">
            {block.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-[15px] leading-[1.65] text-ink">{localize(paragraph, language)}</p>
            ))}
          </div>
          {(block.bullets ?? []).length > 0 && (
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] leading-[1.6] text-ink-soft">
              {block.bullets?.map((bullet, index) => <li key={index}>{localize(bullet, language)}</li>)}
            </ul>
          )}
        </section>
      ))}

      <section className="card !bg-eucatint">
        <p className="eyebrow">{copy.takeaway}</p>
        <p className="mt-1.5 text-[15px] font-bold leading-[1.6] text-ink">{localize(lesson.takeaway, language)}</p>
      </section>

      <section className="card border-ap-border">
        <p className="eyebrow !text-ap-deep">{copy.reflection}</p>
        <p className="mt-1.5 text-[15px] leading-[1.6] text-ink">{localize(lesson.reflectionPrompt, language)}</p>
      </section>

      <section aria-labelledby="lesson-concepts-heading">
        <h2 id="lesson-concepts-heading" className="card-title px-0.5">{copy.concepts}</h2>
        <p className="sub mt-1 px-0.5">{copy.conceptsIntro}</p>
        <div className="mt-3 flex flex-col gap-2.5">
          {concepts.map((concept) => (
            <details key={concept.id} className="card theory-concept-card !p-0">
              <summary className="cursor-pointer list-none px-[18px] py-4">
                <span className="flex items-center justify-between gap-3">
                  <span>
                    <span className="block text-[15px] font-extrabold text-ink">{localize(concept.formalName, language)}</span>
                    <span className="mt-1 block text-[13px] leading-[1.5] text-ink-soft">{localize(concept.plainExplanation, language)}</span>
                  </span>
                  <span className="theory-disclosure-icon text-xl text-euca-deep" aria-hidden="true">⌄</span>
                </span>
              </summary>
              <div className="border-t border-line px-[18px] pb-[18px] pt-4">
                {concept.aliases.length > 0 && (
                  <p className="text-sm leading-[1.55] text-ink-soft">
                    <strong className="text-ink">{copy.also}:</strong>{' '}
                    {concept.aliases.map((alias) => localize(alias, language)).join(', ')}
                  </p>
                )}
                <h3 className="mt-3 text-sm font-extrabold text-ink">{copy.deeper}</h3>
                <p className="mt-1 text-sm leading-[1.6] text-ink-soft">{localize(concept.deeperExplanation, language)}</p>
                <h3 className="mt-3 text-sm font-extrabold text-ink">{copy.example}</h3>
                <p className="mt-1 text-sm leading-[1.6] text-ink-soft">{localize(concept.example, language)}</p>
                <h3 className="mt-3 text-sm font-extrabold text-ink">{copy.notMeaning}</h3>
                <p className="mt-1 text-sm leading-[1.6] text-ink-soft">{localize(concept.misconception, language)}</p>
                {concept.safetyNote && (
                  <div className="mt-3 rounded-2xl bg-apricot-soft px-3.5 py-3">
                    <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-ap-deep">{copy.important}</p>
                    <p className="mt-1 text-sm leading-[1.55] text-ink">{localize(concept.safetyNote, language)}</p>
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>

      <details className="card">
        <summary className="cursor-pointer text-[15px] font-extrabold text-ink">{copy.sources}</summary>
        <p className="sub mt-2">{copy.sourceNote}</p>
        <ul className="mt-3 space-y-2">
          {sources.map((source) => (
            <li key={source.id}>
              <a href={source.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-euca-deep underline decoration-euca/40 underline-offset-2">
                {localize(source.title, language)} — {source.organization}
              </a>
            </li>
          ))}
        </ul>
      </details>

      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          className={isDone ? 'btn-secondary min-h-[54px]' : 'btn-primary min-h-[54px]'}
          onClick={() => void markAsRead()}
          aria-disabled={isDone || saveState === 'saving'}
          aria-busy={saveState === 'saving'}
        >
          {isDone ? `✓ ${copy.marked}` : saveState === 'saving' ? copy.saving : copy.mark}
        </button>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {isDone ? copy.marked : saveState === 'saving' ? copy.saving : ''}
        </p>
        {saveState === 'error' && <p className="text-sm font-bold text-ap-deep" role="alert">{copy.saveError}</p>}
        {isDone && (following ? (
          <Link to={`/theorie/${following.id}`} className="btn-primary">{copy.next}: {localize(following.title, language)}</Link>
        ) : (
          <Link to={`/cursus/week/${lesson.weekId}`} className="btn-primary">{copy.weekRoute}</Link>
        ))}
      </div>
    </article>
  );
}
