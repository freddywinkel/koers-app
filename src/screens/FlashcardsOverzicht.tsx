import { Link } from 'react-router-dom';
import { flashcards } from '../content/flashcards';
import { getLesson, getWeek } from '../content/helpers';
import type { Flashcard } from '../content/types';
import FlashcardView from '../components/FlashcardView';
import { formatDueHint, useDueCount, useNextDue } from '../lib/srs';

/** Alle flashcard-ids uit de contentlaag (stabiele moduleconstante voor de SRS-hooks). */
const ALL_FLASHCARD_IDS = flashcards.map((f) => f.id);

interface WeekGroep {
  weekNumber: number;
  cards: Flashcard[];
}

/**
 * Groepeer de flashcards per cursusweek (via card.lessonId → les → week).
 * Kaarten zonder vindbare les/week komen in een aparte 'Overig'-groep.
 * Oplopend gesorteerd op weeknummer; weken zonder kaarten vallen weg.
 */
function groepeerPerWeek(): { weken: WeekGroep[]; overig: Flashcard[] } {
  const perWeek = new Map<number, Flashcard[]>();
  const overig: Flashcard[] = [];

  for (const card of flashcards) {
    const lesson = card.lessonId ? getLesson(card.lessonId) : undefined;
    const weekNumber = lesson ? getWeek(lesson.weekId)?.number : undefined;
    if (weekNumber === undefined) {
      overig.push(card);
      continue;
    }
    const lijst = perWeek.get(weekNumber);
    if (lijst) lijst.push(card);
    else perWeek.set(weekNumber, [card]);
  }

  const weken = [...perWeek.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([weekNumber, cards]) => ({ weekNumber, cards }));
  return { weken, overig };
}

/** Overzicht van alle flashcards: SRS-herhalingstegel plus de kaartenlijst gegroepeerd per week. */
export default function FlashcardsOverzicht() {
  const dueCount = useDueCount(ALL_FLASHCARD_IDS);
  const nextDue = useNextDue(ALL_FLASHCARD_IDS);
  const { weken, overig } = groepeerPerWeek();

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
        <h1 className="mt-1.5 font-display text-[29px] font-semibold leading-[1.16] tracking-[-0.01em]">Flashcards</h1>
      </header>

      {/* Spaced-repetition-kaart (ongewijzigd overgenomen uit Oefenen) */}
      <section className="flex flex-col gap-3">
        <div className="card flex flex-col gap-3.5">
          <div className="flex items-start gap-3.5">
            <span className="grid h-11 w-11 flex-none place-items-center rounded-[14px] bg-eucatint font-display text-lg font-semibold text-euca-deep" aria-hidden="true">
              {dueCount ?? '·'}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold text-ink">
                {dueCount === undefined
                  ? 'Herhaling wordt geladen…'
                  : dueCount > 0
                    ? `${dueCount} ${dueCount === 1 ? 'kaart' : 'kaarten'} om te herhalen`
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
          </div>
          <Link
            to="/oefenen/flashcards"
            className={dueCount && dueCount > 0 ? 'btn-primary !min-h-[44px]' : 'btn-secondary w-full'}
          >
            Start herhaling
          </Link>
        </div>
      </section>

      {/* Kaartenlijst, gegroepeerd per week */}
      {flashcards.length === 0 ? (
        <p className="card sub">Nog geen kaarten — ze verschijnen zodra je lessen afrondt.</p>
      ) : (
        <>
          {weken.map((groep) => (
            <section key={groep.weekNumber} className="flex flex-col gap-3">
              <p className="eyebrow px-0.5">Week {groep.weekNumber}</p>
              {groep.cards.map((c) => (
                <FlashcardView key={c.id} card={c} />
              ))}
            </section>
          ))}
          {overig.length > 0 && (
            <section className="flex flex-col gap-3">
              <p className="eyebrow px-0.5">Overig</p>
              {overig.map((c) => (
                <FlashcardView key={c.id} card={c} />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}
