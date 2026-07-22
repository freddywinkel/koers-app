import PanIcon, { PAN_LABELS } from './PanIcon';
import type { PanValue } from '../content/types';

const PANS: PanValue[] = [1, 2, 3, 4, 5];

interface Props {
  value: PanValue | null;
  onChange: (pan: PanValue) => void;
  disabled?: boolean;
}

/**
 * De pannetjesmodel-selector: 5 gelijke tegels, geselecteerd = wit vlak,
 * rand eucalyptus-diep, lichte lift (spec §3 "Pan-selector").
 */
export default function PanSelector({ value, onChange, disabled = false }: Props) {
  return (
    <div
      className={['mt-3.5 grid grid-cols-5 gap-1.5', disabled ? 'grayscale' : ''].join(' ')}
      role="radiogroup"
      aria-label="Kies je pan"
      aria-disabled={disabled}
    >
      {PANS.map((pan) => {
        const selected = value === pan;
        return (
          <button
            key={pan}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(pan)}
            className={[
              'flex min-h-[88px] flex-col items-center justify-center gap-1 rounded-2xl border-[1.5px] px-0 pb-2 pt-2.5 transition-all disabled:cursor-not-allowed disabled:opacity-45',
              selected
                ? '-translate-y-0.5 border-euca-deep bg-raised shadow-lift'
                : 'border-transparent bg-pantile hover:-translate-y-px'
            ].join(' ')}
          >
            <PanIcon pan={pan} />
            <span className="text-[9.5px] font-extrabold tracking-[0.06em] text-ink-soft">PAN {pan}</span>
            <span
              className={[
                'text-center text-[10px] font-extrabold leading-[1.1]',
                selected ? 'text-euca-deep' : 'text-ink'
              ].join(' ')}
            >
              {PAN_LABELS[pan]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
