import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * Koers — updatemelding (Noordzeemist bottom sheet).
 * registerType 'prompt': een nieuwe service worker wacht tot de gebruiker kiest.
 * 'Vernieuwen' activeert de nieuwe versie en herlaadt; 'Later' sluit de kaart
 * (de melding komt bij een volgend bezoek vanzelf terug).
 */
export default function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW();

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
