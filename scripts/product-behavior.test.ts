import 'fake-indexeddb/auto';
import assert from 'node:assert/strict';
import test, { after, beforeEach } from 'node:test';
import { curriculum } from '../src/content/curriculum';
import { allLessons } from '../src/content/helpers';
import { db } from '../src/db/db';
import { exportAllData, importAllData, saveCheckin } from '../src/db/hooks';
import { addLocalDays, differenceInCalendarDays, startOfLocalDay } from '../src/lib/calendar';
import { getEligibleFlashcards } from '../src/lib/flashcardEligibility';
import { isLessonUnlocked, isWeekUnlocked } from '../src/lib/unlock';

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

beforeEach(async () => {
  await Promise.all(db.tables.map((table) => table.clear()));
  localStorage.clear();
});

after(async () => {
  db.close();
  await db.delete();
});

test('week- en lesroutes kunnen de opgebouwde voortgang niet overslaan', () => {
  const week1 = curriculum[0];
  const week2 = curriculum[1];
  const week3 = curriculum[2];
  const done = new Set(week2.lessons.slice(0, Math.ceil(week2.lessons.length * 0.6)).map((lesson) => lesson.id));

  assert.equal(isWeekUnlocked(week3, done), false, 'week 1 ontbreekt nog');
  week1.lessons.slice(0, Math.ceil(week1.lessons.length * 0.6)).forEach((lesson) => done.add(lesson.id));
  assert.equal(isWeekUnlocked(week2, done), true);
  assert.equal(isWeekUnlocked(week3, done), true);

  const secondLesson = week1.lessons.slice().sort((a, b) => a.order - b.order)[1];
  assert.equal(isLessonUnlocked(secondLesson, new Set()), false);
  assert.equal(isLessonUnlocked(secondLesson, new Set(), true), true, 'de expliciete alles-open instelling blijft werken');
});

test('alle oefeningen zijn vindbaar en flashcards volgen alleen afgeronde lessen', () => {
  const lessons = allLessons();
  assert.equal(lessons.filter((lesson) => lesson.exercise).length, 48);

  const completedLesson = lessons.find((lesson) => lesson.flashcardIds.length > 0);
  assert.ok(completedLesson);
  const eligible = getEligibleFlashcards(new Set([completedLesson.id]));
  assert.ok(eligible.length > 0);
  assert.ok(eligible.every((card) => card.lessonId === completedLesson.id));
});

test('kalenderrekenen telt lokale dagen zonder vaste 24-uursaanname', () => {
  const start = startOfLocalDay(new Date(2026, 2, 28, 15, 30).getTime());
  const twoDaysLater = addLocalDays(start, 2);
  assert.equal(differenceInCalendarDays(twoDaysLater, start), 2);
  assert.equal(new Date(twoDaysLater).getHours(), 0);
});

test('een snelle check-in werkt dezelfde check-in van vandaag bij', async () => {
  await saveCheckin({ pan: 2, emotion: 'onrustig', note: 'Eerste notitie' });
  await saveCheckin({ pan: 4, note: '' });

  const rows = await db.checkins.toArray();
  assert.equal(rows.length, 1);
  assert.equal(rows[0].pan, 4);
  assert.equal(rows[0].emotion, 'onrustig', 'een niet-bewerkbaar bestaand veld blijft behouden');
  assert.equal(rows[0].note, '', 'een leeggemaakte notitie wordt ook echt gewist');
});

test('exports lekken de apparaatpincode niet en import houdt de huidige pincode vast', async () => {
  const ownPinHash = 'a'.repeat(64);
  await db.settings.bulkPut([
    { key: 'pin-hash', value: ownPinHash },
    { key: 'theme', value: 'licht' },
    { key: 'naam', value: 'Voor import' }
  ]);

  const exported = JSON.parse(await exportAllData()) as { settings: Array<{ key: string; value: string }> };
  assert.equal(exported.settings.some((setting) => setting.key === 'pin-hash'), false);

  const backup = JSON.stringify({
    app: 'koers',
    version: 1,
    exportedAt: new Date().toISOString(),
    settings: [
      { key: 'pin-hash', value: 'b'.repeat(64) },
      { key: 'theme', value: 'donker' }
    ],
    lessonProgress: [{ lessonId: 'w01-l01', status: 'done', completedAt: Date.now() }]
  });
  await importAllData(backup, 'replace');

  assert.equal((await db.settings.get('pin-hash'))?.value, ownPinHash);
  assert.equal((await db.settings.get('theme'))?.value, 'donker');
  assert.equal(await db.settings.get('naam'), undefined);
  assert.equal((await db.lessonProgress.get('w01-l01'))?.status, 'done');
});

test('samenvoegen bewaart auto-ID-records en werkt inhoudelijk gesleutelde tabellen bij', async () => {
  const ownPinHash = 'a'.repeat(64);
  await db.checkins.put({ id: 1, ts: 1_000, pan: 1, emotion: 'bestaande check-in' });
  await db.practiceLogs.put({ id: 1, ts: 1_100, skillId: 'bestaande-vaardigheid' });
  await db.measureResults.put({
    id: 1,
    instrument: 'bestaande-meting',
    ts: 1_200,
    score: 2,
    answers: [1, 1]
  });
  await db.signaleringsplannen.put({
    id: 1,
    createdAt: 1_300,
    updatedAt: 1_300,
    fields: { signaal: 'bestaand plan' }
  });
  await db.gSchemas.put({
    id: 1,
    createdAt: 1_400,
    updatedAt: 1_400,
    fields: { situatie: 'bestaand schema' },
    percentages: { spanning: 40 }
  });
  await db.lessonProgress.put({ lessonId: 'w01-l01', status: 'open' });
  await db.flashcardStates.put({ flashcardId: 'f01', due: 1_500, interval: 1, ease: 2.5, reps: 0 });
  await db.ehpSections.put({ key: 'signalen', content: 'bestaande signalen' });
  await db.settings.bulkPut([
    { key: 'pin-hash', value: ownPinHash },
    { key: 'theme', value: 'licht' },
    { key: 'naam', value: 'blijft lokaal bestaan' }
  ]);

  const backup = JSON.stringify({
    app: 'koers',
    version: 1,
    exportedAt: new Date().toISOString(),
    checkins: [{ id: 1, ts: 2_000, pan: 5, emotion: 'geïmporteerde check-in' }],
    practiceLogs: [{ id: 1, ts: 2_100, skillId: 'geïmporteerde-vaardigheid' }],
    measureResults: [{ id: 1, instrument: 'geïmporteerde-meting', ts: 2_200, score: 4, answers: [2, 2] }],
    signaleringsplannen: [
      { id: 1, createdAt: 2_300, updatedAt: 2_300, fields: { signaal: 'geïmporteerd plan' } }
    ],
    gSchemas: [
      {
        id: 1,
        createdAt: 2_400,
        updatedAt: 2_400,
        fields: { situatie: 'geïmporteerd schema' },
        percentages: { spanning: 80 }
      }
    ],
    lessonProgress: [{ lessonId: 'w01-l01', status: 'done', completedAt: 2_500 }],
    flashcardStates: [{ flashcardId: 'f01', due: 2_600, interval: 3, ease: 2.6, reps: 2 }],
    ehpSections: [{ key: 'signalen', content: 'geïmporteerde signalen' }],
    settings: [
      { key: 'pin-hash', value: 'b'.repeat(64) },
      { key: 'theme', value: 'donker' }
    ]
  });

  const summary = await importAllData(backup, 'merge');

  const checkins = await db.checkins.orderBy('id').toArray();
  assert.equal(checkins.length, 2);
  assert.equal(checkins[0].id, 1);
  assert.equal(checkins[0].emotion, 'bestaande check-in');
  assert.equal(checkins[1].emotion, 'geïmporteerde check-in');
  assert.notEqual(checkins[1].id, 1);

  const practiceLogs = await db.practiceLogs.orderBy('id').toArray();
  assert.equal(practiceLogs.length, 2);
  assert.equal(practiceLogs[0].skillId, 'bestaande-vaardigheid');
  assert.equal(practiceLogs[1].skillId, 'geïmporteerde-vaardigheid');
  assert.notEqual(practiceLogs[1].id, 1);

  const measureResults = await db.measureResults.orderBy('id').toArray();
  assert.equal(measureResults.length, 2);
  assert.equal(measureResults[0].instrument, 'bestaande-meting');
  assert.equal(measureResults[1].instrument, 'geïmporteerde-meting');
  assert.notEqual(measureResults[1].id, 1);

  const signaleringsplannen = await db.signaleringsplannen.orderBy('id').toArray();
  assert.equal(signaleringsplannen.length, 2);
  assert.equal(signaleringsplannen[0].fields.signaal, 'bestaand plan');
  assert.equal(signaleringsplannen[1].fields.signaal, 'geïmporteerd plan');
  assert.notEqual(signaleringsplannen[1].id, 1);

  const gSchemas = await db.gSchemas.orderBy('id').toArray();
  assert.equal(gSchemas.length, 2);
  assert.equal(gSchemas[0].fields.situatie, 'bestaand schema');
  assert.equal(gSchemas[1].fields.situatie, 'geïmporteerd schema');
  assert.notEqual(gSchemas[1].id, 1);

  assert.equal((await db.lessonProgress.get('w01-l01'))?.status, 'done');
  assert.equal((await db.flashcardStates.get('f01'))?.reps, 2);
  assert.equal((await db.ehpSections.get('signalen'))?.content, 'geïmporteerde signalen');
  assert.equal((await db.settings.get('theme'))?.value, 'donker');
  assert.equal((await db.settings.get('naam'))?.value, 'blijft lokaal bestaan');
  assert.equal((await db.settings.get('pin-hash'))?.value, ownPinHash);
  assert.equal(localStorage.getItem('koers-theme'), 'donker');
  assert.equal(summary.tableCounts.settings, 1, 'apparaatinstellingen tellen niet als geïmporteerde rij');
});

test('vervangen wist alle draagbare data, herstelt back-up-ID’s en bewaart apparaatinstellingen', async () => {
  const ownPinHash = 'c'.repeat(64);
  await db.checkins.put({ id: 1, ts: 1_000, pan: 2, emotion: 'moet verdwijnen' });
  await db.practiceLogs.put({ id: 1, ts: 1_100, skillId: 'moet-verdwijnen' });
  await db.settings.bulkPut([
    { key: 'pin-hash', value: ownPinHash },
    { key: 'theme', value: 'licht' },
    { key: 'naam', value: 'moet verdwijnen' }
  ]);

  const backup = JSON.stringify({
    app: 'koers',
    version: 1,
    exportedAt: new Date().toISOString(),
    checkins: [{ id: 77, ts: 2_000, pan: 4, emotion: 'hersteld' }],
    settings: [
      { key: 'pin-hash', value: 'd'.repeat(64) },
      { key: 'theme', value: 'donker' }
    ]
  });

  await importAllData(backup, 'replace');

  assert.equal(await db.checkins.count(), 1);
  assert.equal((await db.checkins.get(77))?.emotion, 'hersteld');
  assert.equal(await db.practiceLogs.count(), 0, 'ook een niet-aanwezige back-uptabel wordt bij vervangen gewist');
  assert.equal((await db.settings.get('pin-hash'))?.value, ownPinHash);
  assert.equal((await db.settings.get('theme'))?.value, 'donker');
  assert.equal(await db.settings.get('naam'), undefined);
  assert.equal(localStorage.getItem('koers-theme'), 'donker');
});

test('een back-up met dubbele primaire sleutels wordt atomair geweigerd', async () => {
  await db.lessonProgress.put({ lessonId: 'bestaand', status: 'open' });
  const duplicateKeyBackup = JSON.stringify({
    app: 'koers',
    version: 1,
    exportedAt: new Date().toISOString(),
    lessonProgress: [
      { lessonId: 'w01-l01', status: 'open' },
      { lessonId: 'w01-l01', status: 'done', completedAt: 2_000 }
    ]
  });

  await assert.rejects(
    importAllData(duplicateKeyBackup, 'merge'),
    /Tabel 'lessonProgress' bevat een dubbele sleutel 'w01-l01' op positie 2/
  );
  assert.deepEqual(await db.lessonProgress.toArray(), [{ lessonId: 'bestaand', status: 'open' }]);

  const duplicateAutoIdBackup = JSON.stringify({
    app: 'koers',
    version: 1,
    exportedAt: new Date().toISOString(),
    checkins: [
      { id: 4, ts: 3_000, pan: 2, emotion: 'eerste' },
      { id: 4, ts: 4_000, pan: 3, emotion: 'tweede' }
    ]
  });
  await assert.rejects(
    importAllData(duplicateAutoIdBackup, 'replace'),
    /Tabel 'checkins' bevat een dubbele sleutel '4' op positie 2/
  );
  assert.equal(await db.lessonProgress.count(), 1, 'validatiefouten wijzigen geen enkele tabel');
});

test('een onredelijk groot importbestand wordt vóór verwerken atomair geweigerd', async () => {
  await db.checkins.put({ id: 11, ts: 5_000, pan: 3, emotion: 'blijft behouden' });
  localStorage.setItem('koers-theme', 'licht');

  await assert.rejects(
    importAllData(' '.repeat(10_000_001), 'replace'),
    /Dit exportbestand is te groot om veilig te importeren/
  );

  assert.deepEqual(await db.checkins.toArray(), [
    { id: 11, ts: 5_000, pan: 3, emotion: 'blijft behouden' }
  ]);
  assert.equal(localStorage.getItem('koers-theme'), 'licht');
});
