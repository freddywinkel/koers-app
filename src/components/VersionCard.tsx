import { useState } from 'react';

const buildLabel = new Date(__BUILD_TIME__).toLocaleString('nl-NL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});

/** Wacht op de echte installatiestatus; een vaste slaap kan op traag internet liegen. */
function waitUntilInstalled(worker: ServiceWorker): Promise<boolean> {
  if (worker.state === 'installed' || worker.state === 'activated') return Promise.resolve(true);
  if (worker.state === 'redundant') return Promise.resolve(false);
  return new Promise((resolve) => {
    const timeout = window.setTimeout(() => finish(false), 30_000);
    const finish = (ok: boolean): void => {
      window.clearTimeout(timeout);
      worker.removeEventListener('statechange', onStateChange);
      resolve(ok);
    };
    const onStateChange = (): void => {
      if (worker.state === 'installed' || worker.state === 'activated') finish(true);
      else if (worker.state === 'redundant') finish(false);
    };
    worker.addEventListener('statechange', onStateChange);
  });
}

/** Geef de registratie een kort moment om `installed` naar `waiting` door te zetten. */
async function waitForWaitingWorker(registration: ServiceWorkerRegistration): Promise<ServiceWorker | null> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (registration.waiting) return registration.waiting;
    if (registration.installing?.state === 'redundant') return null;
    await new Promise((resolve) => window.setTimeout(resolve, 50));
  }
  return registration.waiting;
}

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
      if (reg.installing && !(await waitUntilInstalled(reg.installing))) {
        setResult('fout');
        return;
      }
      const waitingWorker = await waitForWaitingWorker(reg);
      if (waitingWorker) {
        navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload(), {
          once: true
        });
        waitingWorker.postMessage({ type: 'SKIP_WAITING' });
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
      <p className="sub mt-1.5">Deze versie is van {buildLabel}.</p>
      <button
        type="button"
        className="btn-secondary mt-3.5 w-full"
        onClick={() => void checkForUpdates()}
        disabled={checking}
      >
        {checking ? 'Even controleren…' : 'Controleer op updates'}
      </button>
      <div aria-live="polite" aria-atomic="true">
        {result === 'geen' && <p className="sub mt-2">Je hebt de nieuwste versie.</p>}
        {result === 'fout' && <p className="sub mt-2">Controleren lukte niet. Probeer het later opnieuw.</p>}
      </div>
    </section>
  );
}
