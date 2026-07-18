import { useState } from 'react';
import type { Flashcard } from '../content/types';

/** Tik-om-te-draaien flashcard (voorkant = vraag, achterkant = antwoord). */
export default function FlashcardView({ card }: { card: Flashcard }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      className="card w-full text-left transition-transform active:scale-[0.99]"
    >
      <p className="eyebrow">{flipped ? 'Antwoord' : 'Vraag'} · tik om te draaien</p>
      <p className="mt-2 text-[15px] font-semibold leading-body text-ink">{flipped ? card.back : card.front}</p>
    </button>
  );
}
