import 'fake-indexeddb/auto';
import assert from 'node:assert/strict';
import test, { after, beforeEach } from 'node:test';
import { curriculum } from '../src/content/curriculum';
import { allLessons } from '../src/content/helpers';
import { db } from '../src/db/db';
import { exportAllData, importAllData } from '../src/db/hooks';
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
