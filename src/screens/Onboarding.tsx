import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onboarding } from '../content/onboarding';
import { useSettings } from '../db/hooks';

/**
 * Onboarding — vijf rustige welkomstschermen (swipe, dots of tik).
 * ---------------------------------------------------------------
 * App.tsx stuurt '/' hierheen zolang settings key 'onboarding-done' ontbreekt.
 * Afronden ('Start de cursus') of 'Overslaan' zet die key op 'ja' en gaat
 * naar '/'. De flow staat bewust buiten de AppShell: geen tab bar, geen
 * afleiding.
 */
export default function Onboarding() {
  const navigate = useNavigate();
  const { set } = useSettings();
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = onboarding.length;
  const screen = onboarding[index];
  const isLast = index === total - 1;

  async function finish() {
    if (busy) return;
    setBusy(true);
    await set('onboarding-done', 'ja');
    navigate('/', { replace: true });
  }

  function goTo(next: number) {
    setIndex(Math.min(total - 1, Math.max(0, next)));
  }

  return (
    <div className="mx-auto flex h-screen min-h-screen w-full max-w-md flex-col overflow-y-auto overscroll-y-contain bg-mist px-[18px] pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] supports-[height:100dvh]:h-dvh supports-[height:100dvh]:min-h-dvh">
      {/* Overslaan (niet op het laatste scherm: daar staat de startknop) */}
      <div className="flex min-h-[44px] items-center justify-end">
        {!isLast && (
          <button
            type="button"
            className="sub min-h-[44px] px-2 font-bold underline underline-offset-2"
            onClick={() => void finish()}
          >
            Overslaan
          </button>
        )}
      </div>

      {/* Swipebare kaart */}
      <div
        className="flex flex-1 flex-col justify-center py-4 [touch-action:pan-y]"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const startX = touchStartX.current;
          touchStartX.current = null;
          if (startX === null) return;
          const dx = (e.changedTouches[0]?.clientX ?? startX) - startX;
          if (dx <= -48) goTo(index + 1); // veeg naar links = verder
          else if (dx >= 48) goTo(index - 1); // veeg naar rechts = terug
        }}
      >
        <article key={index} className="card !p-7" aria-live="polite">
          <p className="eyebrow">
            Welkom · {index + 1} van {total}
          </p>
          <h1 className="mt-3 font-display text-[27px] font-semibold leading-[1.22] tracking-[-0.01em] text-ink">
            {screen.titel}
          </h1>
          <p className="mt-4 text-[15.5px] leading-[1.7] text-ink">{screen.tekst}</p>
        </article>
      </div>

      {/* Dots (tikbaar) */}
      <div className="flex items-center justify-center gap-0.5 pb-5 pt-2" aria-label={`Scherm ${index + 1} van ${total}`}>
        {onboarding.map((s, i) => (
          <button
            key={s.titel}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ga naar scherm ${i + 1}: ${s.titel}`}
            aria-current={i === index ? 'step' : undefined}
            className="grid min-h-[44px] min-w-[36px] place-items-center"
          >
            <span
              aria-hidden="true"
              className={['h-2.5 rounded-full transition-all', i === index ? 'w-7 bg-euca-deep' : 'w-2.5 bg-ink-soft/30'].join(
                ' '
              )}
            />
          </button>
        ))}
      </div>

      {isLast ? (
        <button type="button" className="btn-primary" disabled={busy} onClick={() => void finish()}>
          Start de cursus
        </button>
      ) : (
        <button type="button" className="btn-primary" onClick={() => goTo(index + 1)}>
          Volgende
        </button>
      )}
    </div>
  );
}
