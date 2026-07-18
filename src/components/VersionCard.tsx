import { useState } from 'react';

const buildLabel = new Date(__BUILD_TIME__).toLocaleString('nl-NL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});

/**
 * Versiekaart op Profiel: toont het build-tijdstip en biedt een handmatige
 * update-check. Vindt de check een wachtende nieuwe service worker, dan
 * activeren we die direct en herladen (zelfde effect als 'Vernieuwen'
 * in de automatische updatemelding).
 */
export default function VersionCard() {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<'geen' | 'fout' | null>(null);

  const checkForUpdates = async (): Promise<void> => {
    if (checking) return;
    setChecking(true);
    setResult(null);
    try {
      const reg = await navigator.serviceWorker?.getRegistration();
      if (!reg) {
        setResult('fout');
        return;
      }
      await reg.update();
      // Een nieuwe service worker heeft even tijd nodig om te installeren.
      await new Promise((resolve) => window.setTimeout(resolve, 3000));
      if (reg.waiting) {
        navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload(), {
          once: true
        });
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        return; // herladen volgt via controllerchange
      }
      setResult('geen');
    } catch {
      setResult('fout');
    } finally {
      setChecking(false);
    }
  };

  return (
    <section className="card" aria-label="Versie en updates">
      <h2 className="card-title">Versie &amp; updates</h2>
      <p className="sub mt-1.5">Deze versie is gebouwd op {buildLabel}.</p>
      <button
        type="button"
        className="btn-secondary mt-3.5 w-full"
        onClick={() => void checkForUpdates()}
        disabled={checking}
      >
        {checking ? 'Even controleren…' : 'Controleer op updates'}
      </button>
      {result === 'geen' && <p className="sub mt-2">Je hebt de nieuwste versie.</p>}
      {result === 'fout' && <p className="sub mt-2">Controleren lukte niet. Probeer het later opnieuw.</p>}
    </section>
  );
}
