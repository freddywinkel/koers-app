import { useState } from 'react';
import { Link } from 'react-router-dom';
import { skills } from '../content/skills';
import { audioSessions } from '../content/audio';
import { flashcards } from '../content/flashcards';
import { allLessons, getWeek } from '../content/helpers';
import type { PanValue } from '../content/types';
import FlashcardView from '../components/FlashcardView';
import { PAN_LABELS } from '../components/PanIcon';
import { formatDueHint, useDueCount, useNextDue } from '../lib/srs';

/** Alle flashcard-ids uit de contentlaag (stabiele moduleconstante voor de SRS-hooks). */
const ALL_FLASHCARD_IDS = flashcards.map((f) => f.id);

const PAN_OPTIONS: PanValue[] = [1, 2, 3, 4, 5];

/** Oefenen-toolbox: geleide audio, vaardigheden (met pan-filter), oefeningen uit de cursus en flashcards. */
export default function Oefenen() {
  const oefeningen = allLessons().filter((l) => l.kind === 'oefening');
  const dueCount = useDueCount(ALL_FLASHCARD_IDS);
  const nextDue = useNextDue(ALL_FLASHCARD_IDS);

  /* Pan-filter: null = alles tonen. Een vaardigheid past als de gekozen pan
   * binnen diens panMin..panMax valt. */
  const [panFilter, setPanFilter] = useState<PanValue | null>(null);
  const visibleSkills =
    panFilter === null ? skills : skills.filter((s) => s.panMin <= panFilter && panFilter <= s.panMax);

  return (
    <div className="screen-stack">
      <header className="px-1 pt-2">
        <p className="eyebrow">Oefenen</p>
        <h1 className="mt-1.5 font-display text-[29px] font-semibold leading-[1.16] tracking-[-0.01em]">Je gereedschapskist</h1>
        <p className="sub mt-1.5">Alles om te oefenen, wanneer je maar wilt. Ook los van de cursus.</p>
      </header>

      {/* Geleide oefeningen (audio) */}
      <section className="flex flex-col gap-3">
        <p className="eyebrow px-0.5">Geleide oefeningen</p>
        <Link to="/oefenen/audio" className="card flex items-center gap-3.5">
          <span className="grid h-11 w-11 flex-none place-items-center rounded-[14px] bg-eucatint text-euca-deep" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6.5 8.5H3.5v7h3L11 19V5Z" />
              <path d="M15 9.5a4 4 0 0 1 0 5" />
              <path d="M17.5 7a7.5 7.5 0 0 1 0 10" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold text-ink">Geleide audio-oefeningen</span>
            <span className="sub mt-0.5 block">
              {audioSessions.length} sessies om te beluisteren — adem, bodyscan, gedachten, emoties en meer.
            </span>
          </span>
          <svg className="flex-none text-ink-soft" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6.5 3.5 11 9l-4.5 5.5" />
          </svg>
        </Link>
      </section>

      {/* Vaardigheden met pan-filter */}
      <section className="flex flex-col gap-3">
        <p className="eyebrow px-0.5">Vaardigheden ({skills.length})</p>
        <div className="card !p-4">
          <p className="text-sm font-extrabold text-ink">Welke pan ben je?</p>
          <p className="sub mt-0.5">Kies je pan, dan tonen we alleen wat nú past.</p>
          <div className="mt-2.5 flex flex-wrap gap-2" role="group" aria-label="Filter vaardigheden op pan">
            <button
              type="button"
              aria-pressed={panFilter === null}
              onClick={() => setPanFilter(null)}
              className={[
                'min-h-[44px] rounded-2xl border px-3.5 text-[13px] font-extrabold',
                panFilter === null ? 'border-euca-deep bg-eucatint text-euca-deep' : 'border-line bg-dune text-ink'
              ].join(' ')}
            >
              Alles
            </button>
            {PAN_OPTIONS.map((pan) => {
              const active = panFilter === pan;
              return (
                <button
                  key={pan}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setPanFilter(active ? null : pan)}
                  className={[
                    'min-h-[44px] rounded-2xl border px-3.5 text-[13px] font-extrabold',
                    active ? 'border-euca-deep bg-eucatint text-euca-deep' : 'border-line bg-dune text-ink'
                  ].join(' ')}
                >
                  {pan} · {PAN_LABELS[pan]}
                </button>
              );
            })}
          </div>
        </div>

        {visibleSkills.length === 0 ? (
          <p className="card sub">Geen vaardigheid gevonden bij deze pan — kies een andere pan of &lsquo;Alles&rsquo;.</p>
        ) : (
          visibleSkills.map((skill) => (
            <details key={skill.id} className="card group">
              <summary className="flex cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
                <span className="min-w-0 flex-1">
                  <span className="card-title block">{skill.name}</span>
                  <span className="sub mt-1 block">{skill.summary}</span>
                </span>
                <span className="chip chip-warm flex-none">
                  Pan {skill.panMin}–{skill.panMax}
                </span>
              </summary>
              <ol className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
                {skill.steps.map((step, i) => (
                  <li key={i} className="flex gap-2.5 text-[14.5px] leading-[1.55] text-ink">
                    <span className="grid h-6 w-6 flex-none place-items-center rounded-lg bg-eucatint text-xs font-extrabold text-euca-deep">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </details>
          ))
        )}
      </section>

      {/* Oefeningen uit de cursus */}
      <section className="flex flex-col gap-3">
        <p className="eyebrow px-0.5">Oefeningen</p>
        <div className="card flex flex-col divide-y divide-line !p-0">
          {oefeningen.map((les) => (
            <Link key={les.id} to={`/les/${les.id}`} className="flex items-center gap-3 px-[18px] py-3.5">
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold text-ink">{les.title}</span>
                <span className="sub mt-0.5 block">
                  Week {getWeek(les.weekId)?.number}
                  {les.minutes ? ` · ± ${les.minutes} min` : ''}
                </span>
              </span>
              <svg className="flex-none text-ink-soft" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6.5 3.5 11 9l-4.5 5.5" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      {/* Flashcards */}
      <section className="flex flex-col gap-3">
        <p className="eyebrow px-0.5">Flashcards ({flashcards.length})</p>
        <div className="card flex items-center gap-3.5">
          <span className="grid h-11 w-11 flex-none place-items-center rounded-[14px] bg-eucatint font-display text-lg font-semibold text-euca-deep" aria-hidden="true">
            {dueCount ?? '·'}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold text-ink">
              {dueCount === undefined
                ? 'Herhaling wordt geladen…'
                : dueCount > 0
                  ? `${dueCount} ${dueCount === 1 ? 'kaart' : 'kaarten'} aan de beurt`
                  : 'Alles herhaald'}
            </span>
            <span className="sub mt-0.5 block">
              {dueCount === undefined
                ? 'Even geduld.'
                : dueCount > 0
                  ? 'Kort herhalen houdt het vers.'
                  : nextDue
                    ? `De volgende kaart komt ${formatDueHint(nextDue)} terug.`
                    : 'Nieuwe lessen brengen nieuwe kaarten.'}
            </span>
          </span>
          <Link
            to="/oefenen/flashcards"
            className={dueCount && dueCount > 0 ? 'btn-primary !min-h-[44px] !w-auto flex-none !px-4' : 'btn-secondary flex-none'}
          >
            Start herhaling
          </Link>
        </div>
        {flashcards.length === 0 ? (
          <p className="card sub">Nog geen kaarten — ze verschijnen zodra je lessen voltooit.</p>
        ) : (
          flashcards.map((c) => <FlashcardView key={c.id} card={c} />)
        )}
      </section>
    </div>
  );
}
