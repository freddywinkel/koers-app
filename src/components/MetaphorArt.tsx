import type { MetaphorCard } from '../content/types';

/** Ingetogen beeldkaart die automatisch met het gekozen ontwerp meekleurt. */
export default function MetaphorArt({ art }: { art?: MetaphorCard['art'] }) {
  const variant = art ?? 'mist';
  return (
    <svg viewBox="0 0 354 148" preserveAspectRatio="xMidYMid slice" className="block h-full w-full" aria-hidden="true">
      <rect width="354" height="148" className="fill-dune" />
      <circle cx="293" cy="38" r="16" opacity=".9" style={{ fill: 'var(--art-sun)' }} />
      <path d="M0 104 Q58 76 118 100 T 250 96 T 354 102 V148 H0 Z" style={{ fill: 'var(--art-back)' }} />
      <path d="M0 116 Q70 96 140 112 T 280 108 T 354 114 V148 H0 Z" style={{ fill: 'var(--art-mid)' }} />
      <rect x="0" y="124" width="354" height="24" style={{ fill: 'var(--art-front)' }} />
      {variant === 'golf' && (
        <>
          <path d="M0 132 H354" strokeWidth="2.5" strokeDasharray="14 12" opacity=".8" style={{ stroke: 'var(--art-line)' }} />
          <path d="M40 96 q10 -6 20 0 t20 0" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity=".7" style={{ stroke: 'var(--art-accent)' }} />
          <path d="M250 86 q10 -6 20 0 t20 0" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity=".7" style={{ stroke: 'var(--art-accent)' }} />
        </>
      )}
      {variant === 'stroom' && (
        <>
          <ellipse cx="120" cy="100" rx="10" ry="4" opacity=".55" style={{ fill: 'var(--art-accent)' }} />
          <ellipse cx="185" cy="110" rx="10" ry="4" opacity=".4" style={{ fill: 'var(--art-accent)' }} />
          <ellipse cx="250" cy="98" rx="10" ry="4" opacity=".6" style={{ fill: 'var(--art-warm)' }} />
        </>
      )}
      {variant === 'mist' && (
        <path
          d="M143 52c0-4 3-5 3-9M161 50c0-4 3-5 3-9M179 52c0-4 3-5 3-9"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
          opacity=".7"
          style={{ stroke: 'var(--art-accent)' }}
        />
      )}
    </svg>
  );
}
