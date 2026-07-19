import type { PanValue } from '../content/types';

export const PAN_FILLS: Record<PanValue, string> = {
  1: 'var(--pan1)',
  2: 'var(--pan2)',
  3: 'var(--pan3)',
  4: 'var(--pan4)',
  5: 'var(--pan5)'
};

export const PAN_LABELS: Record<PanValue, string> = {
  1: 'Rustig',
  2: 'Rimpelt',
  3: 'Borrelt',
  4: 'Pruttelt',
  5: 'Kookt over'
};

/** Stoomlijntjes per pan: 0 – 1 – 2 – 3 – 3 + bellen (uit het goedgekeurde mockup). */
function Steam({ pan }: { pan: PanValue }) {
  if (pan === 1) return null;
  const warm = pan >= 4;
  const strokeClass = warm ? 'stroke-steamwarm' : 'stroke-euca';
  const opacity = pan === 5 ? 0.8 : 0.6;
  const xs = pan === 2 ? [16] : pan === 3 ? [12, 20] : [9.8, 16, 22.2];
  return (
    <>
      {xs.map((x) => (
        <path
          key={x}
          d={`M${x} 9.6c0-1.5 1.1-1.8 1.1-3.3`}
          className={strokeClass}
          strokeWidth={1.7}
          strokeLinecap="round"
          opacity={opacity}
        />
      ))}
      {pan === 5 && (
        <>
          <circle cx="12.5" cy="3" r="1.2" className="fill-steamwarm" opacity={0.55} />
          <circle cx="19.5" cy="2.2" r="1.2" className="fill-steamwarm" opacity={0.55} />
        </>
      )}
    </>
  );
}

/** Pannetjesmodel-icoon: potje met deksel, knobbel en stoom per intensiteit. */
export default function PanIcon({ pan, className = 'h-[30px] w-[30px]' }: { pan: PanValue; className?: string }) {
  const fill = PAN_FILLS[pan];
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <Steam pan={pan} />
      <rect x="6.5" y="14" width="19" height="12.5" rx="4" style={{ fill }} stroke="rgba(47,67,64,.14)" />
      <rect x="4.8" y="11.4" width="22.4" height="3.8" rx="1.9" style={{ fill }} stroke="rgba(47,67,64,.14)" />
      <circle cx="16" cy="10.4" r="1.7" style={{ fill }} stroke="rgba(47,67,64,.14)" />
    </svg>
  );
}
