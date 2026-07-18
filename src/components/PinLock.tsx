/**
 * Koers — PinLock (app-gate + instelflow)
 * --------------------------------------------------
 * Exports:
 *   <PinGate>        App-gate: toont een vergrendelscherm zolang er een pincode
 *                    in settings staat én deze sessie nog niet ontgrendeld is.
 *                    INTEGRATIE (1 regel door de integrator in App.tsx):
 *                      import { PinGate } from './components/PinLock';
 *                      → wrap er <Routes> mee: <PinGate><Routes>…</Routes></PinGate>
 *                    (Profiel toont 'm nu al via "Test de vergrendeling".)
 *   <PinLockScreen>  Het kale vergrendelscherm (overlay) — ook los te testen.
 *   <PinSetup>       Instelflow: kies 4 cijfers → bevestig → hash opslaan.
 *
 * Noordzeemist: zachte vlakken, geen rood bij fout — abrikoos zacht met
 * abrikoos-diepe tekst, bevestigende microcopy zonder oordeel.
 */

import { useState, type ReactNode } from 'react';
import { useSettings } from '../db/hooks';
import { hashPin, isSessionUnlocked, isValidPin, markSessionUnlocked, PIN_HASH_KEY, verifyPin } from '../lib/pin';

/* ------------------------------- bouwstenen ------------------------------- */

function LockIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-euca-deep">
      <rect x="4.5" y="10" width="15" height="10" rx="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10V7.5a4 4 0 1 1 8 0V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="15" r="1.6" fill="currentColor" />
    </svg>
  );
}

function PinDots({ filled, total = 4 }: { filled: number; total?: number }) {
  return (
    <div className="flex justify-center gap-3" aria-label={`${filled} van ${total} cijfers ingevoerd`} role="img">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={[
            'h-3.5 w-3.5 rounded-full border-[1.5px] transition-colors',
            i < filled ? 'border-euca-deep bg-euca-deep' : 'border-ink-soft/40 bg-transparent'
          ].join(' ')}
        />
      ))}
    </div>
  );
}

function PinPad({ onDigit, onDelete }: { onDigit: (d: string) => void; onDelete: () => void }) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];
  return (
    <div className="mx-auto grid w-full max-w-[248px] grid-cols-3 gap-2.5">
      {keys.map((k, i) => {
        if (k === '') return <span key={i} aria-hidden="true" />;
        if (k === 'del') {
          return (
            <button
              key={i}
              type="button"
              aria-label="Wis laatste cijfer"
              onClick={onDelete}
              className="flex min-h-[56px] items-center justify-center rounded-2xl text-sm font-extrabold text-ink-soft active:scale-[0.97]"
            >
              wissen
            </button>
          );
        }
        return (
          <button
            key={i}
            type="button"
            onClick={() => onDigit(k)}
            className="flex min-h-[56px] items-center justify-center rounded-2xl bg-dune text-xl font-extrabold text-ink transition-transform active:scale-[0.97]"
          >
            {k}
          </button>
        );
      })}
    </div>
  );
}

function usePinEntry(onComplete: (pin: string) => void) {
  const [pin, setPin] = useState('');
  const add = (d: string) => {
    setPin((prev) => {
      if (prev.length >= 4) return prev;
      const next = prev + d;
      if (next.length === 4) window.setTimeout(() => onComplete(next), 120); // laat het 4e bolletje even zien
      return next;
    });
  };
  const remove = () => setPin((prev) => prev.slice(0, -1));
  const reset = () => setPin('');
  return { pin, add, remove, reset };
}

/* ------------------------------ vergrendeling ----------------------------- */

export interface PinLockScreenProps {
  /** De opgeslagen SHA-256 hash waarmee geverifieerd wordt. */
  expectedHash: string;
  onUnlocked: () => void;
  /** Alleen tonen in test/demo-context; de echte gate heeft bewust geen 'overslaan'. */
  onCancel?: () => void;
  /** true = testmodus (vanuit Profiel): sessie NIET als ontgrendeld markeren. */
  demo?: boolean;
}

/** Volledig scherm-overlay: 4 cijfers intoetsen tot de hash klopt. */
export function PinLockScreen({ expectedHash, onUnlocked, onCancel, demo = false }: PinLockScreenProps) {
  const [wrong, setWrong] = useState(false);
  const entry = usePinEntry(async (pin) => {
    if (await verifyPin(pin, expectedHash)) {
      if (!demo) markSessionUnlocked();
      onUnlocked();
    } else {
      setWrong(true);
      entry.reset();
    }
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-mist px-6" role="dialog" aria-modal="true" aria-label="App vergrendeld">
      <div className="w-full max-w-[320px]">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[22px] bg-eucatint">
            <LockIcon />
          </div>
          <h1 className="mt-4 font-display text-[24px] font-semibold tracking-[-0.01em] text-ink">Even vergrendeld</h1>
          <p className="sub mt-1">Voer je pincode in om verder te gaan.</p>
        </div>

        <div className="mt-6">
          <PinDots filled={entry.pin.length} />
        </div>

        <div className="mt-2 min-h-[28px] text-center" aria-live="polite">
          {wrong && (
            <p className="inline-block rounded-full bg-apricot-soft px-3 py-1 text-xs font-extrabold text-ap-deep">
              Dat klopt niet helemaal — probeer het rustig opnieuw.
            </p>
          )}
        </div>

        <div className="mt-3">
          <PinPad
            onDigit={(d) => {
              setWrong(false);
              entry.add(d);
            }}
            onDelete={entry.remove}
          />
        </div>

        {onCancel && (
          <button type="button" className="sub mx-auto mt-5 block min-h-[44px] font-bold underline underline-offset-2" onClick={onCancel}>
            Terug zonder te ontgrendelen
          </button>
        )}
      </div>
    </div>
  );
}

/** App-gate: wrap om de app (zie integratie-instructie bovenaan). */
export function PinGate({ children }: { children: ReactNode }) {
  const { ready, get } = useSettings();
  const [unlockedNow, setUnlockedNow] = useState(false);

  if (!ready) return null; // settings laden nog: toon niets (voorkomt flits van content)
  const hash = get(PIN_HASH_KEY);
  const locked = isValidHash(hash) && !isSessionUnlocked() && !unlockedNow;

  if (locked) {
    return <PinLockScreen expectedHash={hash} onUnlocked={() => setUnlockedNow(true)} />;
  }
  return <>{children}</>;
}

function isValidHash(value: string): boolean {
  return /^[a-f0-9]{64}$/.test(value);
}

/* ------------------------------- instelflow ------------------------------- */

export interface PinSetupProps {
  onSaved: () => void;
  onCancel: () => void;
}

/** Kies een pincode (4 cijfers) → herhaal ter bevestiging → sla de hash op. */
export function PinSetup({ onSaved, onCancel }: PinSetupProps) {
  const { set } = useSettings();
  const [step, setStep] = useState<'kies' | 'herhaal'>('kies');
  const [first, setFirst] = useState('');
  const [mismatch, setMismatch] = useState(false);

  const entry = usePinEntry((pin) => {
    if (!isValidPin(pin)) return;
    if (step === 'kies') {
      setFirst(pin);
      setStep('herhaal');
      entry.reset();
      return;
    }
    if (pin === first) {
      void (async () => {
        await set(PIN_HASH_KEY, await hashPin(pin));
        markSessionUnlocked(); // net ingesteld = deze sessie meteen ontgrendeld
        onSaved();
      })();
    } else {
      setMismatch(true);
      setFirst('');
      setStep('kies');
      entry.reset();
    }
  });

  return (
    <div className="mt-3 rounded-2xl border border-line bg-raised p-4">
      <p className="text-sm font-extrabold text-ink">
        {step === 'kies' ? 'Kies 4 cijfers' : 'Herhaal je pincode'}
      </p>
      <p className="sub mt-0.5">
        {step === 'kies' ? 'Kies iets dat je makkelijk onthoudt.' : 'Nog een keer, zodat je zeker weet dat hij goed zit.'}
      </p>

      <div className="mt-4">
        <PinDots filled={entry.pin.length} />
      </div>

      <div className="mt-2 min-h-[28px] text-center" aria-live="polite">
        {mismatch && (
          <p className="inline-block rounded-full bg-apricot-soft px-3 py-1 text-xs font-extrabold text-ap-deep">
            Die twee waren niet hetzelfde — we beginnen gewoon opnieuw.
          </p>
        )}
      </div>

      <div className="mt-2">
        <PinPad
          onDigit={(d) => {
            setMismatch(false);
            entry.add(d);
          }}
          onDelete={entry.remove}
        />
      </div>

      <button type="button" className="sub mx-auto mt-3 block min-h-[44px] font-bold underline underline-offset-2" onClick={onCancel}>
        Annuleren
      </button>
    </div>
  );
}
