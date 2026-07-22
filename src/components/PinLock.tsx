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

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import SafetyContacts from './SafetyContacts';
import { clearAllData, useSettings } from '../db/hooks';
import {
  hashPin,
  isSessionUnlocked,
  isValidPin,
  markSessionUnlocked,
  PIN_HASH_KEY,
  PIN_SESSION_KEY,
  verifyPin
} from '../lib/pin';

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

function PinPad({
  onDigit,
  onDelete,
  disabled = false
}: {
  onDigit: (d: string) => void;
  onDelete: () => void;
  disabled?: boolean;
}) {
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
              disabled={disabled}
              className="flex min-h-[56px] items-center justify-center rounded-2xl text-sm font-extrabold text-ink-soft active:scale-[0.97] disabled:opacity-50"
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
            disabled={disabled}
            className="flex min-h-[56px] items-center justify-center rounded-2xl bg-dune text-xl font-extrabold text-ink transition-transform active:scale-[0.97] disabled:opacity-50"
          >
            {k}
          </button>
        );
      })}
    </div>
  );
}

function usePinEntry(onComplete: (pin: string) => void | Promise<void>) {
  const [pin, setPin] = useState('');
  const [busy, setBusy] = useState(false);
  const pinRef = useRef('');
  const busyRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const complete = useCallback(
    async (candidate: string) => {
      if (candidate.length !== 4 || busyRef.current) return;
      clearTimer();
      busyRef.current = true;
      setBusy(true);
      try {
        await onCompleteRef.current(candidate);
      } finally {
        busyRef.current = false;
        setBusy(false);
      }
    },
    [clearTimer]
  );

  const add = useCallback((d: string) => {
    if (!/^\d$/.test(d) || busyRef.current) return;
    setPin((prev) => {
      if (prev.length >= 4) return prev;
      const next = prev + d;
      pinRef.current = next;
      if (next.length === 4) {
        clearTimer();
        timerRef.current = window.setTimeout(() => void complete(next), 120); // laat het 4e bolletje even zien
      }
      return next;
    });
  }, [clearTimer, complete]);

  const remove = useCallback(() => {
    if (busyRef.current) return;
    clearTimer();
    setPin((prev) => {
      const next = prev.slice(0, -1);
      pinRef.current = next;
      return next;
    });
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    pinRef.current = '';
    setPin('');
  }, [clearTimer]);

  const submit = useCallback(() => {
    void complete(pinRef.current);
  }, [complete]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  return { pin, busy, add, remove, reset, submit };
}

type PinEntry = ReturnType<typeof usePinEntry>;

function handlePinKeyboard(event: KeyboardEvent<HTMLElement>, entry: PinEntry): void {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (/^\d$/.test(event.key)) {
    event.preventDefault();
    entry.add(event.key);
    return;
  }
  if (event.key === 'Backspace' || event.key === 'Delete') {
    event.preventDefault();
    entry.remove();
    return;
  }
  if (event.key === 'Enter' && entry.pin.length === 4) {
    event.preventDefault();
    entry.submit();
  }
}

function trapDialogFocus(event: KeyboardEvent<HTMLElement>, dialog: HTMLElement | null): void {
  if (event.key !== 'Tab' || !dialog) return;
  const focusable = Array.from(
    dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((element) => element.getAttribute('aria-hidden') !== 'true');
  if (focusable.length === 0) {
    event.preventDefault();
    dialog.focus();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;
  if (event.shiftKey && (active === first || active === dialog || !dialog.contains(active))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
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
  const [showRecovery, setShowRecovery] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const [recoveryError, setRecoveryError] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const recoveryRef = useRef<HTMLDivElement>(null);

  const entry = usePinEntry(async (pin) => {
    if (await verifyPin(pin, expectedHash)) {
      if (!demo) markSessionUnlocked();
      onUnlocked();
    } else {
      setWrong(true);
      entry.reset();
    }
  });

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialogRef.current?.focus();
    return () => {
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);

  useEffect(() => {
    if (showRecovery) recoveryRef.current?.focus();
  }, [showRecovery]);

  async function eraseAndRestart(): Promise<void> {
    const confirmed = window.confirm(
      'Laatste controle: alle check-ins, lesvoortgang, notities, plannen, G-schema’s en instellingen van Koers worden gewist. Dit kan niet ongedaan worden gemaakt. Wil je doorgaan?'
    );
    if (!confirmed) return;
    setRecovering(true);
    setRecoveryError(false);
    try {
      await clearAllData();
      try {
        sessionStorage.removeItem(PIN_SESSION_KEY);
      } catch {
        // De database is al gewist; een niet-beschikbare sessieopslag is niet blokkerend.
      }
      onUnlocked();
    } catch {
      setRecoveryError(true);
    } finally {
      setRecovering(false);
    }
  }

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-mist px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pin-lock-title"
      aria-describedby="pin-lock-description"
      aria-busy={entry.busy || recovering}
      onKeyDown={(event) => {
        trapDialogFocus(event, dialogRef.current);
        if (!showRecovery) handlePinKeyboard(event, entry);
      }}
    >
      <div className="mx-auto flex min-h-full w-full max-w-xl flex-col items-center justify-center py-6">
        <div className="w-full max-w-[320px]">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[22px] bg-eucatint">
              <LockIcon />
            </div>
            <h1 id="pin-lock-title" className="mt-4 font-display text-[24px] font-semibold tracking-[-0.01em] text-ink">
              Even vergrendeld
            </h1>
            <p id="pin-lock-description" className="sub mt-1">
              Voer je pincode in om je persoonlijke gegevens te openen.
            </p>
          </div>

          <div className="mt-6">
            <PinDots filled={entry.pin.length} />
          </div>

          <div className="mt-2 min-h-[28px] text-center" aria-live="polite">
            {entry.busy ? (
              <p className="text-xs font-bold text-ink-soft">Pincode controleren…</p>
            ) : wrong ? (
              <p className="inline-block rounded-full bg-apricot-soft px-3 py-1 text-xs font-extrabold text-ap-deep">
                Dat klopt niet helemaal — probeer het rustig opnieuw.
              </p>
            ) : (
              <p className="text-xs font-semibold text-ink-soft">Je kunt ook je cijfertoetsen en Backspace gebruiken.</p>
            )}
          </div>

          <div className="mt-3">
            <PinPad
              disabled={entry.busy || recovering}
              onDigit={(d) => {
                setWrong(false);
                entry.add(d);
              }}
              onDelete={() => {
                setWrong(false);
                entry.remove();
              }}
            />
          </div>

          {onCancel && (
            <button type="button" className="sub mx-auto mt-5 block min-h-[44px] font-bold underline underline-offset-2" onClick={onCancel}>
              Terug zonder te ontgrendelen
            </button>
          )}

          {!demo && (
            <button
              type="button"
              className="sub mx-auto mt-2 block min-h-[44px] font-bold underline underline-offset-2"
              aria-expanded={showRecovery}
              aria-controls="pin-recovery"
              onClick={() => {
                setRecoveryError(false);
                setShowRecovery((open) => !open);
              }}
            >
              Pincode vergeten?
            </button>
          )}
        </div>

        {!demo && showRecovery && (
          <div
            ref={recoveryRef}
            id="pin-recovery"
            tabIndex={-1}
            className="mt-4 w-full max-w-md rounded-2xl border border-ap-border bg-raised p-4 outline-none"
            role="region"
            aria-labelledby="pin-recovery-title"
          >
            <h2 id="pin-recovery-title" className="font-display text-lg font-semibold text-ink">
              Opnieuw beginnen zonder pincode
            </h2>
            <p className="sub mt-1.5">
              Koers kan je pincode niet terughalen. Je kunt wel opnieuw beginnen. Dan worden alle lokale Koers-gegevens
              gewist, waaronder je check-ins, lesvoortgang, notities, plannen en G-schema’s.
            </p>
            <p className="mt-2 text-[13px] font-extrabold text-ap-deep">Dit kan niet ongedaan worden gemaakt.</p>
            {recoveryError && (
              <p className="mt-2 rounded-xl bg-apricot-soft px-3 py-2 text-[13px] font-bold text-ap-deep" role="alert">
                Wissen lukte niet. Probeer het opnieuw of wis de sitegegevens via de instellingen van je browser.
              </p>
            )}
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                className="btn-secondary min-w-0 flex-1"
                disabled={recovering}
                onClick={() => setShowRecovery(false)}
              >
                Annuleren
              </button>
              <button
                type="button"
                className="flex min-h-[44px] min-w-0 flex-1 items-center justify-center rounded-2xl bg-apricot-soft px-4 py-2.5 text-sm font-extrabold text-ap-deep disabled:opacity-50"
                disabled={recovering}
                onClick={() => void eraseAndRestart()}
              >
                {recovering ? 'Gegevens wissen…' : 'Wis alles en begin opnieuw'}
              </button>
            </div>
          </div>
        )}

        {!demo && (
          <div className="mt-5 w-full">
            <SafetyContacts compact />
          </div>
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
  const setupRef = useRef<HTMLDivElement>(null);

  const entry = usePinEntry(async (pin) => {
    if (!isValidPin(pin)) return;
    if (step === 'kies') {
      setFirst(pin);
      setStep('herhaal');
      entry.reset();
      return;
    }
    if (pin === first) {
      const pinHash = await hashPin(pin);
      // Zet de sessievlag vóór Dexie de nieuwe instelling publiceert. Anders
      // kan PinGate precies tussen de database-write en deze vlag renderen en
      // de gebruiker direct na het instellen onbedoeld vergrendelen.
      markSessionUnlocked();
      await set(PIN_HASH_KEY, pinHash);
      onSaved();
    } else {
      setMismatch(true);
      setFirst('');
      setStep('kies');
      entry.reset();
    }
  });

  useEffect(() => {
    setupRef.current?.focus();
  }, []);

  return (
    <div
      ref={setupRef}
      tabIndex={-1}
      role="group"
      aria-labelledby="pin-setup-title"
      onKeyDown={(event) => handlePinKeyboard(event, entry)}
      className="mt-3 rounded-2xl border border-line bg-raised p-4 outline-none"
    >
      <p id="pin-setup-title" className="text-sm font-extrabold text-ink">
        {step === 'kies' ? 'Kies 4 cijfers' : 'Herhaal je pincode'}
      </p>
      <p className="sub mt-0.5">
        {step === 'kies' ? 'Kies iets dat je makkelijk onthoudt.' : 'Nog een keer, zodat je zeker weet dat hij goed zit.'}
      </p>

      <div className="mt-4">
        <PinDots filled={entry.pin.length} />
      </div>

      <div className="mt-2 min-h-[28px] text-center" aria-live="polite">
        {entry.busy ? (
          <p className="inline-block rounded-full bg-eucatint px-3 py-1 text-xs font-extrabold text-euca-deep">
            Pincode bewaren…
          </p>
        ) : mismatch ? (
          <p className="inline-block rounded-full bg-apricot-soft px-3 py-1 text-xs font-extrabold text-ap-deep">
            Die twee waren niet hetzelfde — we beginnen gewoon opnieuw.
          </p>
        ) : null}
      </div>

      <div className="mt-2">
        <PinPad
          onDigit={(d) => {
            setMismatch(false);
            entry.add(d);
          }}
          onDelete={() => {
            setMismatch(false);
            entry.remove();
          }}
          disabled={entry.busy}
        />
      </div>

      <button
        type="button"
        className="sub mx-auto mt-3 block min-h-[44px] font-bold underline underline-offset-2 disabled:opacity-50"
        onClick={onCancel}
        disabled={entry.busy}
      >
        Annuleren
      </button>
    </div>
  );
}
