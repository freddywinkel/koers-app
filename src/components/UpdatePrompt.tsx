import { useEffect, useRef, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { activateWaitingWorker } from '../lib/pwaUpdates';

/**
 * Koers — updatemelding (Noordzeemist bottom sheet).
 * registerType 'prompt': een nieuwe service worker wacht tot de gebruiker kiest.
 * 'Vernieuwen' activeert de nieuwe versie en herlaadt; 'Later' sluit de kaart
 * (de melding komt bij een volgend bezoek vanzelf terug).
 */
const CHECK_INTERVAL_MS = 60 * 60 * 1000; // elk uur opnieuw kijken

export default function UpdatePrompt({ suppressed = false }: { suppressed?: boolean }) {
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const primaryActionRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [updating, setUpdating] = useState(false);
  const updatingRef = useRef(false);
  const [updateFailed, setUpdateFailed] = useState(false);
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      // Een geïnstalleerde iOS-PWA blijft na "sluiten" gesuspendeerd in het
      // geheugen — heropenen is géén nieuwe pageload, dus de browser checkt
      // dan niet op updates. Daarom zelf actief controleren: direct, bij
      // terugkeer in de app (visibility/focus) én elk uur.
      if (!registration) return;
      registrationRef.current = registration;
      // Een eerder gedownloade update kan ook zonder netwerk worden toegepast.
      if (registration.waiting) setNeedRefresh(true);
      void registration.update().then(
        () => {
          // Workbox vuurt bij een nieuwe mount niet in elke browser opnieuw
          // een `waiting`-event af voor een worker die al stond te wachten.
          // Lees daarom ook de registratie zelf, zodat "Later" bij een volgend
          // bezoek weer eerlijk terugkomt.
          if (registration.waiting) setNeedRefresh(true);
        },
        () => undefined
      );
    }
  });

  useEffect(() => {
    const check = async (): Promise<void> => {
      const registration = registrationRef.current;
      if (!registration) return;
      if (registration.waiting) setNeedRefresh(true);
      try {
        await registration.update();
        // 'Later' verbergt alleen de kaart. De worker blijft wachten; toon hem
        // bij een volgende echte terugkeer in de app opnieuw.
        if (registration.waiting) setNeedRefresh(true);
      } catch {
        // Offline of tijdelijk geen verbinding: bij de volgende focus opnieuw.
      }
    };
    const onVisibility = (): void => {
      if (document.visibilityState === 'visible') void check();
    };
    const onFocus = (): void => void check();
    const interval = window.setInterval(() => void check(), CHECK_INTERVAL_MS);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', onFocus);
    void check();
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', onFocus);
    };
  }, [setNeedRefresh]);

  useEffect(() => {
    if (!needRefresh || suppressed) return;
    const activeElement = document.activeElement;
    previousFocusRef.current = activeElement instanceof HTMLElement ? activeElement : null;

    // De routekop krijgt zelf focus in de eerste animation frame. Wacht nog
    // één frame zodat de modale updatemelding daarna betrouwbaar wint.
    let focusFrame = window.requestAnimationFrame(() => {
      focusFrame = window.requestAnimationFrame(() => {
        (primaryActionRef.current ?? dialogRef.current)?.focus({ preventScroll: true });
      });
    });

    const handleKeyDown = (event: KeyboardEvent): void => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        if (!updatingRef.current) setNeedRefresh(false);
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const focused = document.activeElement;
      if (event.shiftKey && (focused === first || !dialog.contains(focused))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (focused === last || !dialog.contains(focused))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);
      const previousFocus = previousFocusRef.current;
      previousFocusRef.current = null;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [needRefresh, setNeedRefresh, suppressed]);

  const activateUpdate = async (): Promise<void> => {
    if (updatingRef.current) return;
    updatingRef.current = true;
    setUpdating(true);
    setUpdateFailed(false);
    try {
      const waitingWorker = registrationRef.current?.waiting;
      if (waitingWorker) {
        await activateWaitingWorker(waitingWorker);
        window.location.reload();
        return;
      }
      // Normale Workbox-route voor een worker die tijdens deze mount gevonden is.
      await updateServiceWorker(true);
    } catch {
      setUpdateFailed(true);
    } finally {
      updatingRef.current = false;
      setUpdating(false);
    }
  };

  if (!needRefresh || suppressed) return null;

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/10 px-[18px] pb-[calc(88px+env(safe-area-inset-bottom))] md:px-8"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="koers-update-title"
      aria-describedby="koers-update-description"
      tabIndex={-1}
    >
      <div className="card max-h-[calc(100dvh-110px)] w-full max-w-2xl overflow-y-auto shadow-lift">
        <p id="koers-update-title" className="font-display text-[17px] font-semibold tracking-[-0.01em] text-ink">
          Er is een nieuwe versie van Koers.
        </p>
        <p id="koers-update-description" className="sub mt-1">Je gegevens blijven gewoon op dit apparaat.</p>
        {updateFailed && <p className="sub mt-2" role="alert">Bijwerken lukte niet. Probeer het later opnieuw.</p>}
        <div className="mt-3 flex flex-col gap-2">
          <button
            ref={primaryActionRef}
            type="button"
            className="btn-primary"
            disabled={updating}
            onClick={() => void activateUpdate()}
          >
            Vernieuwen
          </button>
          <button type="button" className="btn-secondary w-full" disabled={updating} onClick={() => setNeedRefresh(false)}>
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
