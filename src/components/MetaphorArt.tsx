import type { MetaphorCard } from '../content/types';

/**
 * Ingetogen illustratie voor beeldkaarten, in palettinten
 * (duinmist-lagen, abrikoos-zon, zachte stoomlijntjes).
 * Varianten: 'mist' (duinen), 'golf' (waterlijn), 'stroom' (bladeren).
 */
export default function MetaphorArt({ art }: { art?: MetaphorCard['art'] }) {
  const variant = art ?? 'mist';
  return (
    <svg viewBox="0 0 354 148" preserveAspectRatio="xMidYMid slice" className="block h-full w-full" aria-hidden="true">
      <rect width="354" height="148" className="fill-dune" />
      <circle cx="293" cy="38" r="16" fill="#D9A88B" opacity=".9" />
      <path d="M0 104 Q58 76 118 100 T 250 96 T 354 102 V148 H0 Z" fill="#DCE5DD" />
      <path d="M0 116 Q70 96 140 112 T 280 108 T 354 114 V148 H0 Z" fill="#D2DED4" />
      <rect x="0" y="124" width="354" height="24" fill="#C4D2C6" />
      {variant === 'golf' && (
        <>
          <path d="M0 132 H354" stroke="#FCFCFA" strokeWidth="2.5" strokeDasharray="14 12" opacity=".8" />
          <path d="M40 96 q10 -6 20 0 t20 0" stroke="#8FB4A3" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity=".7" />
          <path d="M250 86 q10 -6 20 0 t20 0" stroke="#8FB4A3" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity=".7" />
        </>
      )}
      {variant === 'stroom' && (
        <>
          <ellipse cx="120" cy="100" rx="10" ry="4" fill="#5E8577" opacity=".55" />
          <ellipse cx="185" cy="110" rx="10" ry="4" fill="#5E8577" opacity=".4" />
          <ellipse cx="250" cy="98" rx="10" ry="4" fill="#D9A88B" opacity=".6" />
        </>
      )}
      {variant === 'mist' && (
        <path d="M143 52c0-4 3-5 3-9M161 50c0-4 3-5 3-9M179 52c0-4 3-5 3-9" stroke="#8FB4A3" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity=".7" />
      )}
    </svg>
  );
}
