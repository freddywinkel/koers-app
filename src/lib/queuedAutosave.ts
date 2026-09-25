export type AutosaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

/** Serialize writes and retain the latest unsaved value after a failed write. */
export function createQueuedAutosave<T>(
  save: (value: T) => Promise<void>,
  onStatus: (status: AutosaveStatus) => void = () => undefined
) {
  let latest: T;
  let revision = 0;
  let savedRevision = 0;
  let inFlight: Promise<void> | null = null;

  const flush = (): Promise<void> => {
    if (inFlight) return inFlight;
    if (revision === savedRevision) return Promise.resolve();
    onStatus('saving');
    inFlight = (async () => {
      while (revision !== savedRevision) {
        const savingRevision = revision;
        const value = latest;
        await save(value);
        savedRevision = savingRevision;
      }
      onStatus('saved');
    })().catch((error: unknown) => {
      onStatus('error');
      throw error;
    }).finally(() => {
      inFlight = null;
    });
    return inFlight;
  };

  return {
    change(value: T) {
      latest = value;
      revision += 1;
      onStatus('pending');
    },
    flush,
    hasPending: () => revision !== savedRevision
  };
}
