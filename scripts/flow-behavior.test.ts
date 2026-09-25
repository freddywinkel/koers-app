import 'fake-indexeddb/auto';
import assert from 'node:assert/strict';
import test, { after, beforeEach } from 'node:test';
import { db } from '../src/db/db';
import { createQueuedAutosave, type AutosaveStatus } from '../src/lib/queuedAutosave';
import { ensureHuidigSignaleringsplan, saveSignaleringsplanVeld, startNieuwSignaleringsplan } from '../src/lib/signaleringsplan';
import { GSCHEMA_DRAFT_RECOVERY_KEY, loadGSchemaDraft, mergeLoadedGSchemaDraft } from '../src/lib/gschema';

const recoveryStorage = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: (key: string) => recoveryStorage.get(key) ?? null,
    setItem: (key: string, value: string) => recoveryStorage.set(key, value),
    removeItem: (key: string) => recoveryStorage.delete(key)
  }
});

beforeEach(async () => {
  await db.signaleringsplannen.clear();
  await db.settings.clear();
  recoveryStorage.clear();
});

after(async () => {
  db.close();
  await db.delete();
});

test('autosave retains failed input and allows retry without typing it again', async () => {
  let attempts = 0;
  const saved: string[] = [];
  const states: AutosaveStatus[] = [];
  const autosave = createQueuedAutosave(async (value: string) => {
    attempts += 1;
    if (attempts === 1) throw new Error('Storage unavailable');
    saved.push(value);
  }, (status) => states.push(status));

  autosave.change('Mijn eigen woorden');
  await assert.rejects(autosave.flush(), /Storage unavailable/);
  assert.equal(autosave.hasPending(), true);
  assert.equal(states.at(-1), 'error');
  await autosave.flush();
  assert.deepEqual(saved, ['Mijn eigen woorden']);
  assert.equal(autosave.hasPending(), false);
  assert.equal(states.at(-1), 'saved');
});

test('autosave serializes slow writes and persists edits made while saving', async () => {
  let releaseFirst!: () => void;
  const firstWrite = new Promise<void>((resolve) => { releaseFirst = resolve; });
  const saved: string[] = [];
  const autosave = createQueuedAutosave(async (value: string) => {
    if (saved.length === 0) await firstWrite;
    saved.push(value);
  });

  autosave.change('Eerste versie');
  const flush = autosave.flush();
  autosave.change('Definitieve versie');
  const duplicateFlush = autosave.flush();
  assert.equal(duplicateFlush, flush, 'blur and new-plan actions share the pending write');
  releaseFirst();
  await flush;
  assert.deepEqual(saved, ['Eerste versie', 'Definitieve versie']);
  assert.equal(autosave.hasPending(), false);
});

test('concurrent plan initialization creates exactly one current plan', async () => {
  const ids = await Promise.all([ensureHuidigSignaleringsplan(), ensureHuidigSignaleringsplan()]);
  assert.equal(ids[0], ids[1]);
  assert.equal(await db.signaleringsplannen.count(), 1);
});

test('an old editor final write remains bound to its own plan after a new plan opens', async () => {
  const original = await ensureHuidigSignaleringsplan();
  const oldEditor = createQueuedAutosave((value: string) => saveSignaleringsplanVeld(original, 'pan1-signalen', value));
  oldEditor.change('Oud plan blijft volledig');
  const next = await startNieuwSignaleringsplan();
  await oldEditor.flush();
  assert.equal((await db.signaleringsplannen.get(original))?.fields['pan1-signalen'], 'Oud plan blijft volledig');
  assert.deepEqual((await db.signaleringsplannen.get(next))?.fields, {});
});

test('saving into a removed plan reports failure instead of claiming success', async () => {
  await assert.rejects(saveSignaleringsplanVeld(999, 'pan1-signalen', 'Niet opgeslagen'), /niet meer beschikbaar/);
});

test('a recovery draft remains readable when IndexedDB temporarily fails', async () => {
  const draft = { fields: { gedachten: 'Niet kwijt' }, percentages: { gedachten: 70 }, updatedAt: 1000 };
  recoveryStorage.set(GSCHEMA_DRAFT_RECOVERY_KEY, JSON.stringify(draft));
  const originalGet = db.settings.get;
  db.settings.get = (() => Promise.reject(new Error('IndexedDB unavailable'))) as typeof db.settings.get;
  try {
    assert.deepEqual(await loadGSchemaDraft(), draft);
    recoveryStorage.clear();
    await assert.rejects(loadGSchemaDraft(), /IndexedDB unavailable/);
  } finally {
    db.settings.get = originalGet;
  }
});

test('draft restoration preserves untouched saved answers and early edits, including cleared values', () => {
  const stored = {
    fields: { gebeurtenis: 'Bestaande situatie', gedachten: 'Oud antwoord', gevoel: 'Bang' },
    percentages: { gedachten: 70, gevoel: 80 },
    updatedAt: 1000
  };
  const restored = mergeLoadedGSchemaDraft(stored, { gedachten: 'Tijdens laden getypt', gevoel: '' }, { gedachten: 0 });
  assert.deepEqual(restored, {
    fields: { gebeurtenis: 'Bestaande situatie', gedachten: 'Tijdens laden getypt', gevoel: '' },
    percentages: { gedachten: 0, gevoel: 80 }
  });
  assert.equal(stored.fields.gedachten, 'Oud antwoord', 'restoring never mutates the loaded record');
});
