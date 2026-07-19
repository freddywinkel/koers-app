import { DESIGNS } from '../lib/design';
import { useSettings } from '../db/hooks';

/** Toegankelijke ontwerpkeuze met live kleurvoorbeelden. */
export default function DesignPicker() {
  const { get, set } = useSettings();
  const active = get('design', 'noordzeemist');

  return (
    <div className="mt-1.5 flex flex-col gap-2" role="radiogroup" aria-label="Ontwerp">
      {DESIGNS.map((design) => {
        const isActive = active === design.value;
        return (
          <button
            key={design.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => void set('design', design.value)}
            className={[
              'flex min-h-[56px] items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-left transition-transform active:scale-[0.99]',
              isActive ? 'border-euca-deep bg-eucatint' : 'border-line bg-raised'
            ].join(' ')}
          >
            <span className="flex flex-none -space-x-1.5" aria-hidden="true">
              {design.swatches.map((hex) => (
                <span key={hex} className="h-5 w-5 rounded-full border border-line" style={{ backgroundColor: hex }} />
              ))}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-extrabold text-ink">{design.label}</span>
              <span className="sub block">{design.sub}</span>
            </span>
            {isActive && (
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-none text-euca-deep"
                aria-hidden="true"
              >
                <path d="M3.5 9.5 7 13l7.5-8" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
