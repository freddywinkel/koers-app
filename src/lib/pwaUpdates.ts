/** Activeer een wachtende update met een eindige wachttijd en opgeruimde listeners. */
export function activateWaitingWorker(
  worker: ServiceWorker,
  serviceWorkers: ServiceWorkerContainer = navigator.serviceWorker
): Promise<void> {
  return new Promise((resolve, reject) => {
    let timeout: number | undefined;
    const finish = (error?: Error): void => {
      if (timeout !== undefined) window.clearTimeout(timeout);
      serviceWorkers.removeEventListener('controllerchange', onControllerChange);
      worker.removeEventListener('statechange', onStateChange);
      if (error) reject(error);
      else resolve();
    };
    const onControllerChange = (): void => finish();
    const onStateChange = (): void => {
      if (worker.state === 'redundant') finish(new Error('De update is niet meer beschikbaar.'));
    };
    if (worker.state === 'redundant') {
      reject(new Error('De update is niet meer beschikbaar.'));
      return;
    }
    serviceWorkers.addEventListener('controllerchange', onControllerChange);
    worker.addEventListener('statechange', onStateChange);
    timeout = window.setTimeout(() => finish(new Error('De update reageert niet.')), 30_000);
    try {
      worker.postMessage({ type: 'SKIP_WAITING' });
    } catch (error) {
      finish(error instanceof Error ? error : new Error('De update kon niet worden gestart.'));
    }
  });
}
