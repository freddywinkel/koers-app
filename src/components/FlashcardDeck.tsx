import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { flashcards, getFlashcards } from '../content/flashcards';
import { getLesson, lessonCrumb } from '../content/helpers';
import { formatDueHint, getDueFlashcards, getNextDue, gradeCard, GRADE_LABELS, type Grade } from '../lib/srs';
import type { Flashcard } from '../content/types';

/**
 * FlashcardDeck — route-scherm voor de herhalingssessie (/oefenen/flashcards).
 * ---------------------------------------------------------------------------
 * Haalt één keer bij het openen de kaarten op die aan de beurt zijn (snapshot,
 * zodat beoordelen de wachtrij niet live husselt). 'Opnieuw' schuift de kaart
 * achteraan de rij; de andere beoordelingen ronden de kaart voor nu af.
 * Is er niets te herhalen, dan toont het scherm een warme 'Alles herhaald'-staat
 * met een hint voor de volgende kaart.
 */

/** Alle flashcard-ids uit de contentlaag (stabiele moduleconstante). */
const ALL_IDS = flashcards.map((f) => f.id);

const GRADE_ORDER: Grade[] = [0, 1, 2, 3];

/** Rustige kleuren per beoordeling — nergens rood, ook 'Opnieuw' blijft warm. */
const GRADE_CLASSES: Record<Grade, string> = {
  0: 'border border-ap-border bg-apricot-soft text-ap-deep',
  1: 'bg-dune text-ink',
  2: 'bg-eucatint text-euca-deep',
  3: 'bg-btn text-btn-ink shadow-btn'
};

export default function FlashcardDeck() {
  // null = laden; [] = niets aan de beurt
  const [queue, setQueue] = useState<Flashcard[] | null>(null);
  const [nextDue, setNextDue] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const ids = await getDueFlashcards(ALL_IDS);
      if (!alive) return;
      if (ids.length === 0) {
        const nd = await getNextDue(ALL_IDS);
        if (!alive) return;
        setNextDue(nd);
      }
      setQueue(getFlashcards(ids));
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="screen-stack">
      <div className="flex items-center gap-3 px-0.5 pt-1">
        <Link
          to="/oefenen"
          aria-label="Terug naar oefenen"
          className="grid h-10 w-10 flex-none place-items-center rounded-[14px] border border-line bg-sand text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 3.5 5.5 9 11 14.5" />
          </svg>
        </Link>
        <span className="eyebrow !text-ink-soft">Flashcards · herhaling</span>
      </div>

      {queue === null ? (
        <p className="card sub" role="status">
          De kaarten worden klaargelegd…
        </p>
      ) : queue.length === 0 ? (
        <AllDone nextDue={nextDue} />
      ) : (
        <Deck initial={queue} />
      )}
    </div>
  );
}

/** Warme leegstaat: alles is herhaald (of er is nog geen kaart klaar). */
function AllDone({ nextDue }: { nextDue: number | null }) {
  return (
    <section className="card flex flex-col items-center gap-3 py-9 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-eucatint text-euca-deep" aria-hidden="true">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13.5l5.5 5.5L21 7.5" />
        </svg>
      </span>
      <h1 className="font-display text-[26px] font-semibold leading-[1.2] tracking-[-0.01em]">Alles herhaald</h1>
      <p className="sub max-w-[300px]">
        Lekker bezig. Er ligt nu niets klaar om te herhalen.
        {nextDue !== null
          ? ` De volgende kaart komt ${formatDueHint(nextDue)} weer terug.`
          : ' Nieuwe lessen brengen vanzelf nieuwe kaarten mee.'}
      </p>
      <Link to="/oefenen" className="btn-primary mt-2 !w-auto px-6">
        Terug naar oefenen
      </Link>
    </section>
  );
}

/** De sessie zelf: kaart omdraaien, eerlijk beoordelen, volgende. */
function Deck({ initial }: { initial: Flashcard[] }) {
  const [queue, setQueue] = useState<Flashcard[]>(initial);
  const [unresolved, setUnresolved] = useState<Set<string>>(() => new Set(initial.map((c) => c.id)));
  const [flipped, setFlipped] = useState(false);
  const [busy, setBusy] = useState(false);

  const total = initial.length;
  const doneCount = total - unresolved.size;
  const card = queue[0];

  async function onGrade(grade: Grade) {
    if (!card || busy) return;
    setBusy(true);
    try {
      await gradeCard(card.id, grade);
      setQueue((q) => {
        const rest = q.slice(1);
        return grade === 0 ? [...rest, card] : rest;
      });
      if (grade !== 0) {
        setUnresolved((s) => {
          const n = new Set(s);
          n.delete(card.id);
          return n;
        });
      }
      setFlipped(false);
    } finally {
      setBusy(false);
    }
  }

  if (!card) {
    return (
      <section className="card flex flex-col items-center gap-3 py-9 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-apricot-soft text-ap-deep" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13.5l5.5 5.5L21 7.5" />
          </svg>
        </span>
        <h1 className="font-display text-[26px] font-semibold leading-[1.2] tracking-[-0.01em]">Klaar voor nu</h1>
        <p className="sub max-w-[300px]">Alle kaarten van deze ronde zijn gezien. Kort en vaak herhalen werkt het best.</p>
        <Link to="/oefenen" className="btn-primary mt-2 !w-auto px-6">
          Terug naar oefenen
        </Link>
      </section>
    );
  }

  const lesson = card.lessonId ? getLesson(card.lessonId) : undefined;

  return (
    <div className="flex flex-col gap-3.5">
      {/* Voortgang — zachte balk, geen druk */}
      <div className="px-1" aria-live="polite">
        <p className="sub">
          Kaart {Math.min(doneCount + 1, total)} van {total}
        </p>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-dune">
          <div
            className="h-full rounded-full bg-euca transition-all duration-500"
            style={{ width: `${Math.round((doneCount / total) * 100)}%` }}
          />
        </div>
      </div>

      {/* Omkeerbare kaart */}
      <div className="[perspective:1200px]">
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-pressed={flipped}
          aria-label={flipped ? 'Antwoord, tik om de vraag te zien' : 'Vraag, tik om het antwoord te zien'}
          className={[
            'relative block h-[280px] w-full transition-transform duration-500 [transform-style:preserve-3d]',
            flipped ? '[transform:rotateY(180deg)]' : ''
          ].join(' ')}
        >
          {/* Voorkant: vraag */}
          <div className="absolute inset-0 flex flex-col rounded-card border border-line bg-sand p-6 text-left shadow-card [backface-visibility:hidden]">
            <p className="eyebrow">Vraag</p>
            <p className="mt-3 flex-1 font-display text-[21px] font-medium leading-[1.35] text-ink">{card.front}</p>
            <p className="sub mt-3">Tik om de kaart om te draaien</p>
          </div>
          {/* Achterkant: antwoord */}
          <div className="absolute inset-0 flex flex-col rounded-card border border-euca/25 bg-eucatint p-6 text-left shadow-card [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <p className="eyebrow">Antwoord</p>
            <p className="mt-3 flex-1 text-[15.5px] leading-[1.6] text-ink">{card.back}</p>
            {lesson && (
              <p className="sub mt-3">
                Uit {lessonCrumb(lesson)} · {lesson.title}
              </p>
            )}
          </div>
        </button>
      </div>

      {/* Beoordeling — pas zichtbaar als het antwoord om ligt */}
      {flipped ? (
        <div className="grid grid-cols-2 gap-2.5" aria-label="Hoe ging het?">
          {GRADE_ORDER.map((grade) => (
            <button
              key={grade}
              type="button"
              disabled={busy}
              onClick={() => void onGrade(grade)}
              className={[
                'flex min-h-[52px] items-center justify-center rounded-2xl px-3 text-[14.5px] font-extrabold transition-transform active:scale-[0.98] disabled:opacity-60',
                GRADE_CLASSES[grade]
              ].join(' ')}
            >
              {GRADE_LABELS[grade]}
            </button>
          ))}
        </div>
      ) : (
        <p className="sub px-1 text-center">Draai de kaart om en beoordeel eerlijk — dat helpt het herhalen.</p>
      )}
    </div>
  );
}
