import 'fake-indexeddb/auto';
import assert from 'node:assert/strict';
import test, { after, beforeEach } from 'node:test';
import Dexie from 'dexie';
import { db } from '../src/db/db';
import { clearAllData, exportAllData, importAllData, saveSetting } from '../src/db/hooks';
import { cacheGSchemaDraftForRecovery, loadGSchemaDraft } from '../src/lib/gschema';
import { clearSessionUnlock, isSessionUnlocked, markSessionUnlocked } from '../src/lib/pin';

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();
  get length(): number { return this.values.size; }
  clear(): void { this.values.clear(); }
  getItem(key: string): string | null { return this.values.get(key) ?? null; }
  key(index: number): string | null { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string): void { this.values.delete(key); }
  setItem(key: string, value: string): void { this.values.set(key, String(value)); }
}

Object.defineProperty(globalThis, 'localStorage', { value: new MemoryStorage(), configurable: true });
Object.defineProperty(globalThis, 'sessionStorage', { value: new MemoryStorage(), configurable: true });

const backup = (tables: Record<string, unknown>) => JSON.stringify({
  app: 'koers', version: 1, exportedAt: '2026-09-25T09:00:00.000Z', ...tables
});

beforeEach(async () => {
  await db.transaction('rw', db.tables, async () => {
    for (const table of db.tables) await table.clear();
  });
  localStorage.clear();
  clearSessionUnlock();
});

after(async () => {
  db.close();
  await db.delete();
});

test('failed clear-all rolls back every table and keeps the recovery cache', async () => {
  const checkin = { id: 1, ts: 1_000, pan: 2 as const, emotion: 'keep' };
  await db.checkins.put(checkin);
  await db.settings.put({ key: 'naam', value: 'keep' });
  cacheGSchemaDraftForRecovery({ gebeurtenis: 'keep draft' }, {});
  markSessionUnlocked('a'.repeat(64));
  const failingTable = db.tables.find((table) => table.name === 'gSchemas')!;
  const clear = failingTable.clear;
  failingTable.clear = () => Promise.reject(new Error('simulated disk failure'));
  try {
    await assert.rejects(clearAllData(), /simulated disk failure/);
  } finally {
    failingTable.clear = clear;
  }
  assert.deepEqual(await db.checkins.toArray(), [checkin]);
  assert.equal((await db.settings.get('naam'))?.value, 'keep');
  assert.equal((await loadGSchemaDraft())?.fields.gebeurtenis, 'keep draft');
  assert.equal(isSessionUnlocked('a'.repeat(64)), true);
});

test('successful clear-all also removes the in-memory PIN session', async () => {
  markSessionUnlocked('a'.repeat(64));
  await clearAllData();
  assert.equal(isSessionUnlocked('a'.repeat(64)), false);
});

test('failed settings writes cannot change the next startup appearance or language', async () => {
  await saveSetting('language', 'nl');
  const put = db.settings.put;
  db.settings.put = () => Promise.reject(new Error('simulated quota failure'));
  try {
    await assert.rejects(saveSetting('language', 'en'), /simulated quota failure/);
  } finally {
    db.settings.put = put;
  }
  assert.equal(localStorage.getItem('koers-language'), 'nl');
  assert.equal((await db.settings.get('language'))?.value, 'nl');
  await saveSetting('language', 'en');
  assert.equal(localStorage.getItem('koers-language'), 'en');
});

test('the original version-1 database upgrades without losing EHP text or other records', async () => {
  db.close();
  await db.delete();
  const old = new Dexie('vaardig-en-vrij');
  old.version(1).stores({
    checkins: '++id, ts, pan', lessonProgress: 'lessonId, status',
    flashcardStates: 'flashcardId, due', practiceLogs: '++id, ts, skillId',
    ehpSections: 'key', settings: 'key', measureResults: '++id, instrument, ts'
  });
  await old.table('ehpSections').bulkPut([
    { key: 'pan3-helpt', content: 'Keep exactly this text\n  and spacing' },
    { key: 'pan1-herken', content: ' ' }
  ]);
  await old.table('settings').put({ key: 'naam', value: 'kept' });
  old.close();
  await db.open();
  assert.equal(db.verno, 2);
  const plans = await db.signaleringsplannen.toArray();
  assert.equal(plans.length, 1);
  assert.deepEqual(plans[0].fields, { 'pan3-helpt': 'Keep exactly this text\n  and spacing' });
  assert.equal((await db.settings.get('naam'))?.value, 'kept');
  assert.equal(await db.ehpSections.count(), 2, 'source records are preserved');
  db.close();
  await db.open();
  assert.equal(await db.signaleringsplannen.count(), 1, 'reopening does not rerun the migration');
});

test('export captures one consistent snapshot when another tab writes during export', async () => {
  await db.checkins.put({ id: 1, ts: 1_000, pan: 2, emotion: 'before' });
  await db.lessonProgress.put({ lessonId: 'lesson', status: 'open' });
  const exportedTable = db.tables.find((table) => table.name === 'checkins')!;
  const toArray = exportedTable.toArray;
  let concurrentWrite: Promise<unknown> | undefined;
  exportedTable.toArray = async function () {
    const rows = await toArray.call(this);
    concurrentWrite = Dexie.ignoreTransaction(() => db.transaction('rw', db.tables, async () => {
      await db.checkins.put({ id: 1, ts: 2_000, pan: 3, emotion: 'after' });
      await db.lessonProgress.put({ lessonId: 'lesson', status: 'done', completedAt: 2_000 });
    }));
    return rows;
  };
  let exported;
  try {
    exported = JSON.parse(await exportAllData());
  } finally {
    exportedTable.toArray = toArray;
    await concurrentWrite;
  }
  assert.equal(exported.checkins[0].emotion, 'before');
  assert.equal(exported.lessonProgress[0].status, 'open');
  assert.equal((await db.lessonProgress.get('lesson'))?.status, 'done');
});

test('legacy EHP backups restore a visible warning plan on an already upgraded database', async () => {
  const exportedAt = Date.parse('2026-09-25T09:00:00.000Z');
  const summary = await importAllData(backup({
    ehpSections: [
      { key: 'pan3-helpt', content: 'Call my support person' },
      { key: 'pan1-herken', content: '  ' }
    ]
  }), 'replace');
  const plans = await db.signaleringsplannen.toArray();
  assert.equal(plans.length, 1);
  assert.deepEqual(plans[0].fields, { 'pan3-helpt': 'Call my support person' });
  assert.equal(plans[0].createdAt, exportedAt);
  assert.equal(summary.tableCounts.signaleringsplannen, 1);
});

test('modern backups do not turn stale legacy EHP sections into extra plans', async () => {
  await importAllData(backup({
    ehpSections: [{ key: 'pan3-helpt', content: 'old text' }],
    signaleringsplannen: [{ id: 8, createdAt: 1_000, updatedAt: 2_000, fields: { 'pan3-helpt': 'current text' } }]
  }), 'replace');
  assert.equal(await db.signaleringsplannen.count(), 1);
  assert.equal((await db.signaleringsplannen.get(8))?.fields['pan3-helpt'], 'current text');
});

test('replace import removes the previous recovery-only draft', async () => {
  cacheGSchemaDraftForRecovery({ gebeurtenis: 'discard this' }, {});
  await importAllData(backup({ checkins: [] }), 'replace');
  assert.equal(await loadGSchemaDraft(), null);
});

test('imported draft wins over a more recent recovery cache when merging', async () => {
  cacheGSchemaDraftForRecovery({ gebeurtenis: 'previous draft' }, {});
  const restoredDraft = { fields: { gebeurtenis: 'imported draft' }, percentages: {}, updatedAt: 1_000 };
  await importAllData(backup({ settings: [{ key: 'concept-gschema', value: JSON.stringify(restoredDraft) }] }), 'merge');
  assert.deepEqual(await loadGSchemaDraft(), restoredDraft);
});

test('export includes the newest recovery draft even before its IndexedDB debounce completes', async () => {
  await db.settings.put({ key: 'concept-gschema', value: JSON.stringify({
    fields: { gebeurtenis: 'older text' }, percentages: {}, updatedAt: 1_000
  }) });
  cacheGSchemaDraftForRecovery({ gebeurtenis: 'latest text' }, { gevoel: 40 });
  const exported = JSON.parse(await exportAllData());
  const setting = exported.settings.find((row: { key: string }) => row.key === 'concept-gschema');
  assert.equal(JSON.parse(setting.value).fields.gebeurtenis, 'latest text');
  await clearAllData();
  await importAllData(JSON.stringify(exported), 'replace');
  assert.equal((await loadGSchemaDraft())?.fields.gebeurtenis, 'latest text');
});

test('write failure during replace rolls back cleared rows and leaves recovery cache untouched', async () => {
  const checkin = { id: 1, ts: 1_000, pan: 2 as const, emotion: 'keep' };
  await db.checkins.put(checkin);
  await db.settings.put({ key: 'pin-hash', value: 'a'.repeat(64) });
  cacheGSchemaDraftForRecovery({ gebeurtenis: 'keep draft' }, {});
  const bulkPut = db.gSchemas.bulkPut;
  db.gSchemas.bulkPut = () => Promise.reject(new Error('simulated quota failure'));
  try {
    await assert.rejects(importAllData(backup({
      gSchemas: [{ createdAt: 2_000, updatedAt: 2_000, fields: {}, percentages: {} }]
    }), 'replace'), /simulated quota failure/);
  } finally {
    db.gSchemas.bulkPut = bulkPut;
  }
  assert.deepEqual(await db.checkins.toArray(), [checkin]);
  assert.equal((await db.settings.get('pin-hash'))?.value, 'a'.repeat(64));
  assert.equal((await loadGSchemaDraft())?.fields.gebeurtenis, 'keep draft');
});

test('all imported record dates and auto IDs must be representable', async () => {
  const invalidTables = [
    { lessonProgress: [{ lessonId: 'lesson', status: 'done', completedAt: 1e20 }] },
    { flashcardStates: [{ flashcardId: 'card', due: 1e20, interval: 1, ease: 2.5, reps: 1 }] },
    { practiceLogs: [{ ts: 1e20, skillId: 'skill' }] },
    { measureResults: [{ ts: 1e20, instrument: 'm', score: 1, answers: [1] }] },
    { signaleringsplannen: [{ createdAt: 1e20, updatedAt: 1_000, fields: {} }] },
    { gSchemas: [{ createdAt: 1_000, updatedAt: 1e20, fields: {}, percentages: {} }] },
    { checkins: [{ id: Number.MAX_SAFE_INTEGER + 1, ts: 1_000, pan: 2, emotion: '' }] }
  ];
  await db.settings.put({ key: 'naam', value: 'keep' });
  for (const tables of invalidTables) {
    await assert.rejects(importAllData(backup(tables), 'replace'), /ongeldige rij/, Object.keys(tables)[0]);
    assert.equal((await db.settings.get('naam'))?.value, 'keep');
  }
});

test('invalid export dates cannot create an invalid legacy plan', async () => {
  await db.settings.put({ key: 'naam', value: 'keep' });
  for (const exportedAt of ['invalid', '+999999-01-01T00:00:00Z', '1960-01-01T00:00:00Z']) {
    await assert.rejects(importAllData(backup({
      exportedAt, ehpSections: [{ key: 'pan3-helpt', content: 'legacy' }]
    }), 'replace'), /exportdatum/);
  }
  assert.equal((await db.settings.get('naam'))?.value, 'keep');
});

test('import reports the committed language even when the startup cache is blocked', async () => {
  const storage = globalThis.localStorage;
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem() { throw new Error('Blocked'); },
      setItem() { throw new Error('Blocked'); },
      removeItem() { throw new Error('Blocked'); }
    }
  });
  try {
    const english = await importAllData(backup({ settings: [{ key: 'language', value: 'en' }] }), 'replace');
    assert.equal(english.language, 'en');
    assert.equal((await db.settings.get('language'))?.value, 'en');
    const merged = await importAllData(backup({ checkins: [] }), 'merge');
    assert.equal(merged.language, 'en', 'merge retains the current language when the backup omits it');
    const replaced = await importAllData(backup({ checkins: [] }), 'replace');
    assert.equal(replaced.language, 'nl', 'replacement without a preference restores the default');
    assert.equal(await db.settings.get('language'), undefined);
  } finally {
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage });
  }
});
