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
    <fieldset className="mt-3.5 min-w-0" disabled={disabled}>
      <legend className="sr-only">Kies je pan</legend>
      <div className={['grid grid-cols-5 gap-1.5', disabled ? 'grayscale' : ''].join(' ')}>
        {PANS.map((pan) => {
          const selected = value === pan;
          return (
            <label
              key={pan}
              className={[
                'choice-option flex min-h-[88px] cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-[1.5px] px-0 pb-2 pt-2.5 transition-all has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-45',
                selected
                  ? '-translate-y-0.5 border-euca-deep bg-raised shadow-lift'
                  : 'border-transparent bg-pantile hover:-translate-y-px'
              ].join(' ')}
            >
              <input
                className="sr-only"
                type="radio"
                name="dagelijkse-pan"
                value={pan}
                checked={selected}
                onChange={() => onChange(pan)}
              />
              <PanIcon pan={pan} />
              <span className="text-[11px] font-extrabold tracking-[0.04em] text-ink-soft">PAN {pan}</span>
              <span
                className={[
                  'text-center text-[11px] font-extrabold leading-[1.15]',
                  selected ? 'text-euca-deep' : 'text-ink'
                ].join(' ')}
              >
                {PAN_LABELS[pan]}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
