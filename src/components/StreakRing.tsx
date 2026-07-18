interface Props {
  /** Aantal dagen op rij. */
  count: number;
  /** Doel voor een volle ring (standaard 7). */
  target?: number;
}

const R = 26;
const CIRC = 2 * Math.PI * R; // ≈ 163.4

/**
 * Vergevende streak-ring (64px, stroke 6, ronde eindes).
 * Boog in eucalyptus op een duinmist-track; getal in Fraunces.
 */
export default function StreakRing({ count, target = 7 }: Props) {
  const frac = Math.min(count / target, 1);
  return (
    <div className="relative h-16 w-16 flex-none" aria-hidden="true">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="-rotate-90">
        <circle cx="32" cy="32" r={R} className="stroke-dune" strokeWidth="6" />
        {frac > 0 && (
          <circle
            cx="32"
            cy="32"
            r={R}
            className="stroke-euca"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(frac * CIRC).toFixed(1)} ${CIRC.toFixed(1)}`}
          />
        )}
      </svg>
      <b className="absolute inset-0 grid place-items-center font-display text-[21px] font-semibold text-ink">
        {count > 0 ? count : ''}
      </b>
    </div>
  );
}
