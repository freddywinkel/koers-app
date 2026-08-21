import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { curriculum } from '../content/curriculum';
import {
  getTheoryLessonsForWeek,
  isTheoryLessonAccessible,
  localize,
  psychologyConcepts,
  theoryProgress,
  theorySources
} from '../content/theory';
import type { LocalizedText, TheoryFramework } from '../content/theory/types';
import { useDoneLessonIds } from '../db/hooks';
import { getLanguage } from '../i18n';
import { useAllWeeksOpen } from '../lib/courseHooks';
import { isWeekUnlocked } from '../lib/unlock';

type Filter = 'alle' | 'ACT' | 'VERS' | 'verdieping';

const THEORY_WEEK_TITLES: Record<string, LocalizedText> = {
  w01: { nl: 'Start & inzicht', en: 'Start & insight' },
  w02: { nl: 'Hier en nu & observeren', en: 'Present moment & observing' },
  w03: { nl: 'Acceptatie', en: 'Acceptance' },
  w04: { nl: 'Defusie & gedachten', en: 'Defusion & thoughts' },
  w05: { nl: 'Het waarnemende zelf', en: 'The observing self' },
  w06: { nl: 'Aandacht & herhaling', en: 'Attention & review' },
  w07: { nl: 'Waarden', en: 'Values' },
  w08: { nl: 'Toegewijd handelen', en: 'Committed action' },
  w09: { nl: 'Problemen aanpakken', en: 'Problem solving' },
  w10: { nl: 'Leven in balans', en: 'Balanced living' },
  w11: { nl: 'Crisis & veiligheid', en: 'Crisis & safety' },
  w12: { nl: 'Vooruit & volhouden', en: 'Moving forward & maintaining' }
};

export default function TheoryIndex() {
  const language = getLanguage();
  const doneIds = useDoneLessonIds();
  const allWeeksOpen = useAllWeeksOpen();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('alle');
  const safeDoneIds = doneIds ?? new Set<string>();
  const progress = theoryProgress(safeDoneIds);

  const copy = language === 'en'
    ? {
        eyebrow: 'Theory library', title: 'Theory & terms', intro: 'Twenty-four short lessons explain the ACT and VERS ideas behind the exercises. They are woven into the weekly route but never block your practice or change your core progress.',
        personal: 'Written for personal self-study. Koers provides psychoeducation, not diagnosis, treatment or crisis care.',
        progress: `${progress.done} of ${progress.total} theory lessons read`, route: 'Theory route by week',
        routeIntro: 'Read them in order or open the subject you need today.', core: 'core lessons unchanged',
        theory: 'Theory', read: 'read', locked: 'week locked', terms: 'Terms A–Z',
        termsIntro: 'Every named psychological term has one shared explanation, an example and a clear “this does not mean”.',
        search: 'Search terms', placeholder: 'For example: acceptance, schema or validation', all: 'All', deep: 'In-depth',
        results: 'terms found', noResults: 'No term matches this search.', also: 'Also called', deeper: 'A little deeper',
        example: 'Example', notMeaning: 'This does not mean', important: 'Important', openLesson: 'Open the main lesson',
        sources: 'Public source register', sourcesIntro: 'All lesson text is original. These sources define the models and allow fact checking.',
        back: 'Back to course'
      }
    : {
        eyebrow: 'Theoriebibliotheek', title: 'Theorie & begrippen', intro: 'Vierentwintig korte lessen leggen de ACT- en VERS-ideeën achter de oefeningen uit. Ze staan tussen de weeklessen, maar blokkeren het oefenen nooit en veranderen je kernvoortgang niet.',
        personal: 'Geschreven voor persoonlijke zelfstudie. Koers geeft psycho-educatie, geen diagnose, behandeling of crisishulp.',
        progress: `${progress.done} van ${progress.total} theorielessen gelezen`, route: 'Theorieroute per week',
        routeIntro: 'Lees ze op volgorde of open het onderwerp dat je vandaag nodig hebt.', core: 'kernlessen blijven ongewijzigd',
        theory: 'Theorie', read: 'gelezen', locked: 'week vergrendeld', terms: 'Begrippen A–Z',
        termsIntro: 'Elk genoemd psychologisch begrip heeft één gedeelde uitleg, een voorbeeld en een helder “dit betekent niet”.',
        search: 'Zoek een begrip', placeholder: 'Bijvoorbeeld: acceptatie, schema of valideren', all: 'Alles', deep: 'Verdieping',
        results: 'begrippen gevonden', noResults: 'Geen begrip past bij deze zoekopdracht.', also: 'Ook genoemd', deeper: 'Iets dieper',
        example: 'Voorbeeld', notMeaning: 'Dit betekent niet', important: 'Belangrijk', openLesson: 'Open de hoofdles',
        sources: 'Publiek bronregister', sourcesIntro: 'Alle lestekst is origineel geschreven. Deze bronnen definiëren de modellen en maken controle mogelijk.',
        back: 'Terug naar cursus'
      };

  const results = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase(language === 'en' ? 'en-GB' : 'nl-NL');
    return psychologyConcepts
      .filter((concept) => {
        if (filter === 'verdieping' && concept.tier !== 'verdieping') return false;
        if (filter === 'ACT' && !concept.frameworks.some((framework) => framework === 'ACT' || framework === 'gedeeld')) return false;
        if (filter === 'VERS' && !concept.frameworks.some((framework) => framework === 'VERS' || framework === 'gedeeld')) return false;
        if (!needle) return true;
        const searchable = [
          localize(concept.formalName, language),
          ...concept.aliases.map((alias) => localize(alias, language)),
          localize(concept.plainExplanation, language),
          localize(concept.example, language)
        ].join(' ').toLocaleLowerCase(language === 'en' ? 'en-GB' : 'nl-NL');
        return searchable.includes(needle);
      })
      .sort((a, b) => localize(a.formalName, language).localeCompare(localize(b.formalName, language), language));
  }, [filter, language, query]);

  const filterButtons: Array<{ id: Filter; label: string }> = [
    { id: 'alle', label: copy.all },
    { id: 'ACT', label: 'ACT' },
    { id: 'VERS', label: 'VERS' },
    { id: 'verdieping', label: copy.deep }
  ];
  const frameworkLabel = (framework: TheoryFramework): string => {
    if (framework === 'ACT' || framework === 'VERS') return framework;
    if (framework === 'gedeeld') return language === 'en' ? 'Shared' : 'Gedeeld';
    return language === 'en' ? 'General' : 'Algemeen';
  };
  const tierLabel = (tier: 'kern' | 'ondersteunend' | 'verdieping'): string => {
    const labels = language === 'en'
      ? { kern: 'Core', ondersteunend: 'Supporting', verdieping: 'In-depth' }
      : { kern: 'Kern', ondersteunend: 'Ondersteunend', verdieping: 'Verdieping' };
    return labels[tier];
  };

  return (
    <div className="screen-stack theory-index" data-no-translate>
      <div className="flex items-center gap-3 px-0.5 pt-1">
        <Link to="/cursus" aria-label={copy.back} className="grid h-10 w-10 flex-none place-items-center rounded-[14px] border border-line bg-sand text-ink">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 3.5 5.5 9 11 14.5" /></svg>
        </Link>
        <span className="eyebrow min-w-0 truncate !text-ink-soft">{copy.eyebrow}</span>
      </div>

      <header className="card theory-index-hero border-ap-border">
        <div className="flex flex-wrap gap-2">
          <span className="chip chip-warm">ACT + VERS</span>
          <span className="chip">{copy.progress}</span>
        </div>
        <h1 className="mt-3 font-display text-[30px] font-semibold leading-[1.15] tracking-[-0.015em]">{copy.title}</h1>
        <p className="mt-2 text-[15px] leading-[1.6] text-ink-soft">{copy.intro}</p>
        <p className="mt-3 rounded-2xl bg-dune px-3.5 py-3 text-[13px] leading-[1.5] text-ink-soft">{copy.personal}</p>
        <div className="route-progress mt-4">
          <div className="route-progress-label"><span>{copy.progress}</span><span>{progress.total ? Math.round((progress.done / progress.total) * 100) : 0}%</span></div>
          <span className="route-progress-track" role="progressbar" aria-label={copy.progress} aria-valuemin={0} aria-valuemax={progress.total} aria-valuenow={progress.done}>
            <span style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }} />
          </span>
        </div>
      </header>

      <section aria-labelledby="theory-route-heading">
        <h2 id="theory-route-heading" className="card-title px-0.5">{copy.route}</h2>
        <p className="sub mt-1 px-0.5">{copy.routeIntro}</p>
        <div className="mt-3 flex flex-col gap-2.5">
          {curriculum.map((week) => {
            const lessons = getTheoryLessonsForWeek(week.id);
            const unlocked = allWeeksOpen || isWeekUnlocked(week, safeDoneIds);
            const readCount = lessons.filter((lesson) => safeDoneIds.has(lesson.id)).length;
            return (
              <details key={week.id} className="card !p-0">
                <summary className="cursor-pointer list-none px-[18px] py-4">
                  <span className="flex items-center gap-3">
                    <span className="grid h-10 w-10 flex-none place-items-center rounded-[14px] bg-eucatint font-display text-lg font-semibold text-euca-deep">{week.number}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-extrabold text-ink">
                        {localize(THEORY_WEEK_TITLES[week.id] ?? { nl: week.title, en: week.title }, language)}
                      </span>
                      <span className="sub mt-0.5 block">{readCount} / {lessons.length} {copy.read} · {copy.core}</span>
                    </span>
                    {!unlocked && <span className="chip text-[11px]">{copy.locked}</span>}
                  </span>
                </summary>
                <div className="border-t border-line px-[18px] pb-[18px] pt-3">
                  <ol className="space-y-2">
                    {lessons.map((lesson) => {
                      const read = safeDoneIds.has(lesson.id);
                      const accessible = isTheoryLessonAccessible(lesson.id, safeDoneIds, unlocked);
                      const inner = (
                        <>
                          <span className={['grid h-9 w-9 flex-none place-items-center rounded-xl text-sm font-extrabold', read ? 'bg-eucatint text-euca-deep' : 'bg-apricot-soft text-ap-deep'].join(' ')}>{read ? '✓' : lesson.order}</span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-extrabold text-ink">{localize(lesson.title, language)}</span>
                            <span className="sub mt-0.5 block">{copy.theory} {lesson.order} · ± {lesson.minutes} min{read ? ` · ${copy.read}` : ''}</span>
                          </span>
                        </>
                      );
                      return (
                        <li key={lesson.id}>
                          {accessible ? (
                            <Link to={`/theorie/${lesson.id}`} className="flex items-center gap-3 rounded-2xl bg-dune px-3 py-3 transition-transform active:scale-[0.99]">{inner}</Link>
                          ) : (
                            <div className="flex items-center gap-3 rounded-2xl bg-dune px-3 py-3 opacity-55">{inner}</div>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </details>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="theory-terms-heading">
        <h2 id="theory-terms-heading" className="card-title px-0.5">{copy.terms}</h2>
        <p className="sub mt-1 px-0.5">{copy.termsIntro}</p>
        <div className="card mt-3">
          <label htmlFor="theory-search" className="block text-sm font-extrabold text-ink">{copy.search}</label>
          <input id="theory-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.placeholder} className="input-soft mt-2" />
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={language === 'en' ? 'Filter terms' : 'Filter begrippen'}>
            {filterButtons.map((item) => (
              <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)} className={['chip transition-colors', filter === item.id ? '!bg-eucatint !text-euca-deep' : ''].join(' ')}>{item.label}</button>
            ))}
          </div>
          <p className="sub mt-3" aria-live="polite">{results.length} {copy.results}</p>
        </div>

        {results.length === 0 ? (
          <p className="card sub mt-3">{copy.noResults}</p>
        ) : (
          <div className="mt-3 flex flex-col gap-2.5">
            {results.map((concept) => {
              const lesson = concept.primaryTheoryLessonId;
              const week = curriculum.find((candidate) => candidate.id === lesson.slice(0, 3));
              const mainLessonUnlocked = week
                ? isTheoryLessonAccessible(lesson, safeDoneIds, allWeeksOpen || isWeekUnlocked(week, safeDoneIds))
                : false;
              return (
                <details key={concept.id} className="card theory-concept-card !p-0">
                  <summary className="cursor-pointer list-none px-[18px] py-4">
                    <span className="flex items-start justify-between gap-3">
                      <span>
                        <span className="block text-[15px] font-extrabold text-ink">{localize(concept.formalName, language)}</span>
                        <span className="mt-1 block text-[13px] leading-[1.5] text-ink-soft">{localize(concept.plainExplanation, language)}</span>
                        <span className="mt-2 flex flex-wrap gap-1.5">
                          {concept.frameworks.map((framework: TheoryFramework) => <span key={framework} className="chip !px-2.5 !py-1 !text-[10px]">{frameworkLabel(framework)}</span>)}
                          <span className="chip chip-warm !px-2.5 !py-1 !text-[10px]">{tierLabel(concept.tier)}</span>
                        </span>
                      </span>
                      <span className="theory-disclosure-icon text-xl text-euca-deep" aria-hidden="true">⌄</span>
                    </span>
                  </summary>
                  <div className="border-t border-line px-[18px] pb-[18px] pt-4">
                    {concept.aliases.length > 0 && <p className="text-sm leading-[1.55] text-ink-soft"><strong className="text-ink">{copy.also}:</strong> {concept.aliases.map((alias) => localize(alias, language)).join(', ')}</p>}
                    <h3 className="mt-3 text-sm font-extrabold text-ink">{copy.deeper}</h3>
                    <p className="mt-1 text-sm leading-[1.6] text-ink-soft">{localize(concept.deeperExplanation, language)}</p>
                    <h3 className="mt-3 text-sm font-extrabold text-ink">{copy.example}</h3>
                    <p className="mt-1 text-sm leading-[1.6] text-ink-soft">{localize(concept.example, language)}</p>
                    <h3 className="mt-3 text-sm font-extrabold text-ink">{copy.notMeaning}</h3>
                    <p className="mt-1 text-sm leading-[1.6] text-ink-soft">{localize(concept.misconception, language)}</p>
                    {concept.safetyNote && <div className="mt-3 rounded-2xl bg-apricot-soft px-3.5 py-3"><p className="text-xs font-extrabold uppercase tracking-[0.1em] text-ap-deep">{copy.important}</p><p className="mt-1 text-sm leading-[1.55] text-ink">{localize(concept.safetyNote, language)}</p></div>}
                    {mainLessonUnlocked && <Link to={`/theorie/${lesson}`} className="btn-secondary mt-4">{copy.openLesson}</Link>}
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </section>

      <details className="card">
        <summary className="cursor-pointer text-[15px] font-extrabold text-ink">{copy.sources}</summary>
        <p className="sub mt-2">{copy.sourcesIntro}</p>
        <ul className="mt-3 space-y-2">
          {theorySources.map((source) => (
            <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-euca-deep underline decoration-euca/40 underline-offset-2">{localize(source.title, language)} — {source.organization}</a></li>
          ))}
        </ul>
      </details>
    </div>
  );
}
