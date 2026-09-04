import 'fake-indexeddb/auto';
import assert from 'node:assert/strict';
import test, { after, beforeEach } from 'node:test';
import { curriculum } from '../src/content/curriculum';
import { allLessons } from '../src/content/helpers';
import { getSkill } from '../src/content/skills';
import { theoryLessons } from '../src/content/theory';
import {
  THINKING_PATTERNS,
  THINKING_PATTERNS_ENGLISH_OVERRIDES,
  thinkingPatternsTheorySection
} from '../src/content/thinkingErrors';
import { db } from '../src/db/db';
import {
  clearAllData,
  computeStreak,
  exportAllData,
  getRecentCheckins,
  importAllData,
  markLessonDone,
  saveCheckin
} from '../src/db/hooks';
import { LANGUAGE_STORAGE_KEY, translate } from '../src/i18n';
import { addLocalDays, differenceInCalendarDays, localDayKey, startOfLocalDay } from '../src/lib/calendar';
import { formatCheckinMoment } from '../src/lib/checkins';
import { claimDailyCheckinPrompt, DAILY_CHECKIN_PROMPT_KEY } from '../src/lib/dailyCheckinPrompt';
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

test('een theorieles gebruikt de bestaande lokale voortgang zonder kernlessen te veranderen', async () => {
  const theoryLesson = theoryLessons[0];
  assert.ok(theoryLesson);
  await markLessonDone(theoryLesson.id);

  assert.deepEqual(await db.lessonProgress.get(theoryLesson.id), {
    lessonId: theoryLesson.id,
    status: 'done',
    completedAt: (await db.lessonProgress.get(theoryLesson.id))?.completedAt
  });
  assert.equal(allLessons().length, 51);
  assert.equal(curriculum[0].lessons.some((lesson) => lesson.id === theoryLesson.id), false);
  assert.equal(isWeekUnlocked(curriculum[1], new Set([theoryLesson.id])), false);
});

test('week 4 les 2 legt gedachten uitdagen uit en bevat de volledige praktische theorielijst', () => {
  const lesson = allLessons().find((candidate) => candidate.id === 'w04-l02');
  assert.ok(lesson);

  const explanation = lesson.intro.join(' ');
  assert.match(explanation, /is dit een feit, mijn uitleg of een voorspelling/);
  assert.match(explanation, /feiten vóór en tegen/);
  assert.match(explanation, /eerlijke gedachte die bij alle feiten past/);
  assert.ok(lesson.relatedSkillIds.includes('gedachten-uitdagen'));
  assert.match(lesson.assignment ?? '', /Open dan onderaan "Gedachten uitdagen" en volg de vijf stappen/);
  assert.equal(lesson.minutes, 12);
  assert.equal(lesson.supportCta?.to, '/steun/g-schema');

  assert.deepEqual(lesson.theorySections, [thinkingPatternsTheorySection]);
  const theory = lesson.theorySections?.[0];
  assert.ok(theory);
  assert.match(theory.intro.join(' '), /geen vaste lijst met alle denkfouten/);
  assert.match(theory.caution ?? '', /bewijst niet dat je gedachte onwaar is/);
  assert.deepEqual(
    theory.items.map((item) => item.title),
    [
      'Zwart-witdenken',
      'Overgeneraliseren',
      'Negatief filter',
      'Het positieve wegwuiven',
      'Gedachten lezen',
      'De toekomst invullen',
      'Rampdenken',
      'Redeneren vanuit gevoel',
      'Moeten-denken',
      'Etiketten plakken',
      'Personaliseren',
      'Vergroten en verkleinen'
    ]
  );
  assert.equal(theory.items.length, 12);
  assert.equal(new Set(theory.items.map((item) => item.id)).size, theory.items.length);
  assert.ok(theory.items.every((item) => item.text.trim() && item.example?.trim()));

  assert.deepEqual(
    curriculum.find((week) => week.id === 'w04')?.lessons.map((candidate) => candidate.id),
    ['w04-l01', 'w04-l02', 'w04-l03', 'w04-l04', 'w04-l05'],
    'bestaande les-id’s en voortgang blijven ongewijzigd'
  );

  const practice = getSkill('gedachten-uitdagen');
  assert.ok(practice);
  assert.equal(practice.steps.length, 5);
  assert.match(practice.steps.join(' '), /denkpatroon herkent/);

  localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');
  const theoryStrings = [
    theory.title,
    ...theory.intro,
    theory.takeaway,
    theory.caution,
    theory.source,
    ...theory.items.flatMap((item) => [item.title, item.alsoCalled, item.text, item.example])
  ].filter((value): value is string => Boolean(value));
  for (const source of theoryStrings) {
    assert.ok(THINKING_PATTERNS_ENGLISH_OVERRIDES[source], `curated English ontbreekt voor: ${source}`);
    assert.notEqual(translate(source), source, `Engelse taalstand vertaalt niet: ${source}`);
  }
  assert.equal(THINKING_PATTERNS.length, theory.items.length);
});

test('kalenderrekenen telt lokale dagen zonder vaste 24-uursaanname', () => {
  const start = startOfLocalDay(new Date(2026, 2, 28, 15, 30).getTime());
  const twoDaysLater = addLocalDays(start, 2);
  assert.equal(differenceInCalendarDays(twoDaysLater, start), 2);
  assert.equal(new Date(twoDaysLater).getHours(), 0);
});

test('de automatische check-in verschijnt hoogstens eenmaal per lokale kalenderdag', async () => {
  const morning = new Date(2026, 8, 3, 8, 0).getTime();
  const evening = new Date(2026, 8, 3, 21, 30).getTime();
  const nextMorning = new Date(2026, 8, 4, 8, 0).getTime();

  assert.equal(await claimDailyCheckinPrompt(morning), true);
  await saveCheckin({ pan: 2, note: 'Ochtend' }, morning + 60_000);
  await saveCheckin({ pan: 4, note: 'Avond' }, evening - 60_000);
  assert.equal(await db.checkins.count(), 2, 'meerdere registraties veranderen de dagclaim niet');
  assert.equal(await claimDailyCheckinPrompt(evening), false, 'sluiten zonder opslaan toont hem niet opnieuw');
  assert.equal((await db.settings.get(DAILY_CHECKIN_PROMPT_KEY))?.value, localDayKey(morning));
  assert.equal(await claimDailyCheckinPrompt(nextMorning), true, 'een nieuwe lokale dag mag opnieuw vragen');
});

test('een bestaande check-in voorkomt de automatische popup zonder de dag apart te claimen', async () => {
  const now = new Date(2026, 8, 3, 9, 15).getTime();
  await db.checkins.add({ ts: now, pan: 2, note: 'Al gedaan' });

  assert.equal(await claimDailyCheckinPrompt(now), false);
  assert.equal(await db.settings.get(DAILY_CHECKIN_PROMPT_KEY), undefined);
});

test('gelijktijdige openingspogingen kunnen de dagelijkse popup maar eenmaal claimen', async () => {
  const now = new Date(2026, 8, 3, 9, 15).getTime();
  const results = await Promise.all([claimDailyCheckinPrompt(now), claimDailyCheckinPrompt(now)]);
  assert.deepEqual(results.sort(), [false, true]);
});

test('alle lokale gegevens wissen maakt ook de automatische dagvraag weer beschikbaar', async () => {
  await db.settings.put({ key: DAILY_CHECKIN_PROMPT_KEY, value: '2026-9-3' });
  await clearAllData();
  assert.equal(await db.settings.get(DAILY_CHECKIN_PROMPT_KEY), undefined);
});

test('twee snelle check-ins op dezelfde dag blijven twee afzonderlijke registraties', async () => {
  const morning = new Date(2026, 8, 3, 9, 7).getTime();
  const afternoon = new Date(2026, 8, 3, 15, 42).getTime();

  const first = await saveCheckin({ pan: 2, emotion: 'onrustig', note: 'Eerste notitie' }, morning);
  const second = await saveCheckin({ pan: 4, note: 'Later op de dag' }, afternoon);

  assert.ok(first.id != null);
  assert.ok(second.id != null);
  assert.notEqual(first.id, second.id);
  assert.equal(first.ts, morning);
  assert.equal(second.ts, afternoon);

  const rows = await db.checkins.orderBy('ts').toArray();
  assert.deepEqual(
    rows.map(({ ts, pan, emotion, note }) => ({ ts, pan, emotion, note })),
    [
      { ts: morning, pan: 2, emotion: 'onrustig', note: 'Eerste notitie' },
      { ts: afternoon, pan: 4, emotion: '', note: 'Later op de dag' }
    ]
  );
});

test('recente check-ins bevatten alle momenten van vandaag en staan nieuwste eerst', async () => {
  const yesterday = new Date(2026, 8, 2, 20, 15).getTime();
  const morning = new Date(2026, 8, 3, 9, 7).getTime();
  const afternoon = new Date(2026, 8, 3, 15, 42).getTime();

  await saveCheckin({ pan: 1, note: 'Gisteren' }, yesterday);
  await saveCheckin({ pan: 2, note: 'Vanochtend' }, morning);
  await saveCheckin({ pan: 4, note: 'Vanmiddag' }, afternoon);

  const recent = await getRecentCheckins(3);
  assert.deepEqual(recent.map((row) => row.ts), [afternoon, morning, yesterday]);
  assert.deepEqual(recent.map((row) => row.note), ['Vanmiddag', 'Vanochtend', 'Gisteren']);
  assert.deepEqual((await getRecentCheckins(2)).map((row) => row.ts), [afternoon, morning]);
});

test('meerdere check-ins op één dag tellen als één streakdag', () => {
  const today = startOfLocalDay(Date.now());
  const yesterday = addLocalDays(today, -1);
  const registeredDays = new Set([
    startOfLocalDay(today + 9 * 60 * 60 * 1_000),
    startOfLocalDay(today + 15 * 60 * 60 * 1_000),
    startOfLocalDay(yesterday + 20 * 60 * 60 * 1_000)
  ]);

  assert.equal(registeredDays.size, 2);
  assert.deepEqual(computeStreak(registeredDays), { count: 2, frozen: false });
});

test('check-inmomenten tonen voor vandaag en eerdere dagen een gelokaliseerde tijd', () => {
  const now = new Date(2026, 8, 3, 16, 0).getTime();
  const today = new Date(2026, 8, 3, 9, 7).getTime();
  const earlier = new Date(2026, 8, 2, 9, 7).getTime();

  assert.equal(formatCheckinMoment(today, now, 'nl-NL'), 'Vandaag · 09:07');
  assert.equal(formatCheckinMoment(today, now, 'en-GB'), 'Today · 09:07');

  const nlEarlier = formatCheckinMoment(earlier, now, 'nl-NL');
  const enEarlier = formatCheckinMoment(earlier, now, 'en-GB');
  const nlDate = new Intl.DateTimeFormat('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(earlier));
  const enDate = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(earlier));
  assert.ok(nlEarlier.toLocaleLowerCase('nl-NL').includes(nlDate.toLocaleLowerCase('nl-NL')));
  assert.ok(enEarlier.toLocaleLowerCase('en-GB').includes(enDate.toLocaleLowerCase('en-GB')));
  assert.match(nlEarlier, / · 09:07$/);
  assert.match(enEarlier, / · 09:07$/);
});

test('export en vervangen bewaren meerdere check-ins van dezelfde dag met hun eigen tijd', async () => {
  const morning = new Date(2026, 8, 3, 9, 7).getTime();
  const afternoon = new Date(2026, 8, 3, 15, 42).getTime();
  const first = await saveCheckin({ pan: 2, emotion: 'onrustig', note: 'Eerste notitie' }, morning);
  const second = await saveCheckin({ pan: 4, note: 'Later op de dag' }, afternoon);
  const exported = await exportAllData();

  await clearAllData();
  const summary = await importAllData(exported, 'replace');
  const restored = await db.checkins.orderBy('ts').toArray();

  assert.equal(summary.tableCounts.checkins, 2);
  assert.deepEqual(restored, [first, second]);
});

test('exports lekken de apparaatpincode niet en import houdt de huidige pincode vast', async () => {
  const ownPinHash = 'a'.repeat(64);
  await db.settings.bulkPut([
    { key: 'pin-hash', value: ownPinHash },
    { key: DAILY_CHECKIN_PROMPT_KEY, value: localDayKey(Date.now()) },
    { key: 'theme', value: 'licht' },
    { key: 'naam', value: 'Voor import' }
  ]);

  const exported = JSON.parse(await exportAllData()) as { settings: Array<{ key: string; value: string }> };
  assert.equal(exported.settings.some((setting) => setting.key === 'pin-hash'), false);
  assert.equal(exported.settings.some((setting) => setting.key === DAILY_CHECKIN_PROMPT_KEY), false);

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
  assert.equal((await db.settings.get(DAILY_CHECKIN_PROMPT_KEY))?.value, localDayKey(Date.now()));
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

test('een check-in met een ongeldige datum wordt voor import atomair geweigerd', async () => {
  const existing = { id: 9, ts: 5_000, pan: 2 as const, emotion: 'blijft behouden' };
  await db.checkins.put(existing);
  const invalidTimestampBackup = JSON.stringify({
    app: 'koers',
    version: 1,
    exportedAt: new Date().toISOString(),
    checkins: [{ id: 10, ts: 1e20, pan: 4, emotion: 'ongeldige datum' }]
  });

  await assert.rejects(
    importAllData(invalidTimestampBackup, 'replace'),
    /Tabel 'checkins' bevat een ongeldige rij op positie 1/
  );
  assert.deepEqual(await db.checkins.toArray(), [existing]);
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
