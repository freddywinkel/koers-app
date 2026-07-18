import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * Koers — updatemelding (Noordzeemist bottom sheet).
 * registerType 'prompt': een nieuwe service worker wacht tot de gebruiker kiest.
 * 'Vernieuwen' activeert de nieuwe versie en herlaadt; 'Later' sluit de kaart
 * (de melding komt bij een volgend bezoek vanzelf terug).
 */
const CHECK_INTERVAL_MS = 60 * 60 * 1000; // elk uur opnieuw kijken
let updateChecksArmed = false; // module-niveau: listeners maximaal 1x opzetten

export default function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      // Een geïnstalleerde iOS-PWA blijft na "sluiten" gesuspendeerd in het
      // geheugen — heropenen is géén nieuwe pageload, dus de browser checkt
      // dan niet op updates. Daarom zelf actief controleren: direct, bij
      // terugkeer in de app (visibility/focus) én elk uur.
      if (!registration || updateChecksArmed) return;
      updateChecksArmed = true;
      const check = (): void => {
        registration.update().catch(() => undefined);
      };
      window.setInterval(check, CHECK_INTERVAL_MS);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') check();
      });
      window.addEventListener('focus', check);
      check();
    }
  });

  if (!needRefresh) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md px-[18px] pb-5"
      role="alert"
      aria-live="polite"
    >
      <div className="card shadow-lift">
        <p className="font-display text-[17px] font-semibold tracking-[-0.01em] text-ink">
          Er is een nieuwe versie van Koers.
        </p>
        <p className="sub mt-1">Je gegevens blijven gewoon op dit apparaat.</p>
        <div className="mt-3 flex flex-col gap-2">
          <button type="button" className="btn-primary" onClick={() => updateServiceWorker(true)}>
            Vernieuwen
          </button>
          <button type="button" className="btn-secondary w-full" onClick={() => setNeedRefresh(false)}>
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
