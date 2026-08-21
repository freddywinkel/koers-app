import test from 'node:test';
import assert from 'node:assert/strict';
import { curriculum } from '../src/content/curriculum';
import { allLessons, courseProgress, weekProgress } from '../src/content/helpers';
import { skills } from '../src/content/skills';
import { THINKING_PATTERNS } from '../src/content/thinkingErrors';
import {
  getTheoryConcept,
  getTheoryLessonsForWeek,
  getConceptsForTheoryLesson,
  isTheoryLessonAccessible,
  getWeekLearningPath,
  psychologyConcepts,
  theoryLessons,
  theorySources
} from '../src/content/theory';
import type { LocalizedText } from '../src/content/theory/types';
import { isWeekComplete, isWeekUnlocked } from '../src/lib/unlock';

function assertLocalized(value: LocalizedText, label: string): void {
  assert.ok(value.nl.trim().length > 0, `${label} mist Nederlandse tekst`);
  assert.ok(value.en.trim().length > 0, `${label} mist Engelse tekst`);
}

test('de 51 bestaande kernlessen en hun IDs blijven exact intact', () => {
  const expectedCounts = [4, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4];
  const expectedIds = expectedCounts.flatMap((count, weekIndex) =>
    Array.from({ length: count }, (_, lessonIndex) =>
      `w${String(weekIndex + 1).padStart(2, '0')}-l${String(lessonIndex + 1).padStart(2, '0')}`
    )
  );
  assert.deepEqual(allLessons().map((lesson) => lesson.id), expectedIds);
  assert.equal(expectedIds.length, 51);
});

test('de theorieroute bevat exact twee volledige lessen per week', () => {
  assert.equal(theoryLessons.length, 24);
  assert.equal(new Set(theoryLessons.map((lesson) => lesson.id)).size, 24);
  const coreIds = new Set(allLessons().map((lesson) => lesson.id));
  const conceptIds = new Set(psychologyConcepts.map((concept) => concept.id));
  const sourceIds = new Set(theorySources.map((source) => source.id));
  const skillIds = new Set(skills.map((skill) => skill.id));

  for (const week of curriculum) {
    const lessons = getTheoryLessonsForWeek(week.id);
    assert.deepEqual(lessons.map((lesson) => lesson.id), [`${week.id}-t01`, `${week.id}-t02`]);
    assert.deepEqual(lessons.map((lesson) => lesson.order), [1, 2]);
    assert.deepEqual(lessons.map((lesson) => lesson.afterLessonOrder), [1, 2]);
    assert.deepEqual(getWeekLearningPath(week).slice(0, 4).map((item) => item.kind), ['core', 'theory', 'core', 'theory']);
  }

  for (const lesson of theoryLessons) {
    assert.match(lesson.id, /^w\d{2}-t0[12]$/);
    assert.ok(lesson.minutes >= 4 && lesson.minutes <= 7, `${lesson.id} heeft geen micro-lesduur`);
    assertLocalized(lesson.title, `${lesson.id}.title`);
    assertLocalized(lesson.summary, `${lesson.id}.summary`);
    assertLocalized(lesson.takeaway, `${lesson.id}.takeaway`);
    assertLocalized(lesson.reflectionPrompt, `${lesson.id}.reflectionPrompt`);
    assert.ok(lesson.intro.length >= 1, `${lesson.id} mist introductie`);
    lesson.intro.forEach((value, index) => assertLocalized(value, `${lesson.id}.intro.${index}`));
    assert.ok(lesson.blocks.length >= 2, `${lesson.id} heeft te weinig theorieblokken`);
    for (const block of lesson.blocks) {
      assertLocalized(block.heading, `${lesson.id}.${block.id}.heading`);
      assert.ok(
        block.paragraphs.length + (block.bullets?.length ?? 0) >= 1,
        `${lesson.id}.${block.id} mist uitleg`
      );
      block.paragraphs.forEach((value, index) => assertLocalized(value, `${lesson.id}.${block.id}.paragraph.${index}`));
      block.bullets?.forEach((value, index) => assertLocalized(value, `${lesson.id}.${block.id}.bullet.${index}`));
    }
    assert.ok(lesson.conceptIds.length >= 2, `${lesson.id} mist begrippen`);
    lesson.conceptIds.forEach((id) => assert.ok(conceptIds.has(id), `${lesson.id} verwijst naar onbekend begrip ${id}`));
    lesson.sourceIds.forEach((id) => assert.ok(sourceIds.has(id), `${lesson.id} verwijst naar onbekende bron ${id}`));
    lesson.relatedLessonIds.forEach((id) => assert.ok(coreIds.has(id), `${lesson.id} verwijst naar onbekende kernles ${id}`));
    lesson.relatedSkillIds.forEach((id) => assert.ok(skillIds.has(id), `${lesson.id} verwijst naar onbekende vaardigheid ${id}`));
  }
});

test('ieder psychologisch begrip is tweetalig, herleidbaar en bruikbaar uitgelegd', () => {
  assert.ok(psychologyConcepts.length >= 55, 'begrippencatalogus is niet breed genoeg');
  assert.equal(new Set(psychologyConcepts.map((concept) => concept.id)).size, psychologyConcepts.length);
  const conceptIds = new Set(psychologyConcepts.map((concept) => concept.id));
  const lessonIds = new Set(theoryLessons.map((lesson) => lesson.id));
  const sourceIds = new Set(theorySources.map((source) => source.id));
  const skillIds = new Set(skills.map((skill) => skill.id));

  for (const concept of psychologyConcepts) {
    assertLocalized(concept.formalName, `${concept.id}.formalName`);
    assertLocalized(concept.plainExplanation, `${concept.id}.plainExplanation`);
    assertLocalized(concept.deeperExplanation, `${concept.id}.deeperExplanation`);
    assertLocalized(concept.example, `${concept.id}.example`);
    assertLocalized(concept.misconception, `${concept.id}.misconception`);
    concept.aliases.forEach((alias, index) => assertLocalized(alias, `${concept.id}.alias.${index}`));
    if (concept.safetyNote) assertLocalized(concept.safetyNote, `${concept.id}.safetyNote`);
    assert.equal(concept.reviewStatus, 'source-checked');
    assert.ok(lessonIds.has(concept.primaryTheoryLessonId), `${concept.id} mist geldige hoofdles`);
    assert.ok(
      getConceptsForTheoryLesson(
        theoryLessons.find((lesson) => lesson.id === concept.primaryTheoryLessonId)!
      ).some((candidate) => candidate.id === concept.id),
      `${concept.id} staat niet in de begrippenlijst van zijn hoofdles ${concept.primaryTheoryLessonId}`
    );
    assert.ok(concept.sourceIds.length > 0, `${concept.id} mist bron`);
    concept.sourceIds.forEach((id) => assert.ok(sourceIds.has(id), `${concept.id} verwijst naar onbekende bron ${id}`));
    concept.relatedConceptIds.forEach((id) => assert.ok(conceptIds.has(id), `${concept.id} verwijst naar onbekend begrip ${id}`));
    concept.relatedSkillIds.forEach((id) => assert.ok(skillIds.has(id), `${concept.id} verwijst naar onbekende vaardigheid ${id}`));
  }
});

test('theorie verandert ontgrendeling en kernvoortgang niet', () => {
  const allCoreDone = new Set(allLessons().map((lesson) => lesson.id));
  const allCoreAndTheoryDone = new Set([...allCoreDone, ...theoryLessons.map((lesson) => lesson.id)]);
  assert.deepEqual(courseProgress(allCoreDone), courseProgress(allCoreAndTheoryDone));
  assert.deepEqual(courseProgress(allCoreAndTheoryDone), { total: 51, done: 51, percent: 100 });
  for (const week of curriculum) {
    assert.equal(isWeekUnlocked(week, allCoreDone), true);
    assert.equal(isWeekUnlocked(week, allCoreAndTheoryDone), true);
    assert.equal(isWeekComplete(week, allCoreDone), true);
    assert.deepEqual(weekProgress(week, allCoreDone), weekProgress(week, allCoreAndTheoryDone));
  }

  const theoryOnly = new Set(theoryLessons.map((lesson) => lesson.id));
  assert.equal(isWeekUnlocked(curriculum[1], theoryOnly), false, 'theorie mag week 2 niet ontgrendelen');
  assert.deepEqual(weekProgress(curriculum[0], theoryOnly), { total: 4, done: 0 });

  const completedLockedTheory = theoryLessons.find((lesson) => lesson.weekId === 'w12')!;
  assert.equal(isTheoryLessonAccessible(completedLockedTheory.id, new Set([completedLockedTheory.id]), false), true);
  assert.equal(isTheoryLessonAccessible('w12-t02', new Set(), false), false);
});

test('de denkfoutenles benoemt alle twaalf gekozen patronen', () => {
  assert.equal(THINKING_PATTERNS.length, 12);
  assert.equal(new Set(THINKING_PATTERNS.map((pattern) => pattern.id)).size, 12);
  for (const pattern of THINKING_PATTERNS) {
    assert.ok(pattern.title.nl.trim());
    assert.ok(pattern.title.en.trim());
    assert.ok(pattern.text.nl.trim());
    assert.ok(pattern.text.en.trim());
    assert.ok(pattern.example.nl.trim());
    assert.ok(pattern.example.en.trim());
  }
});

test('belangrijke ACT-VERS-onderscheidingen blijven expliciet en intern consistent', () => {
  const fiveSkills = theoryLessons
    .find((lesson) => lesson.id === 'w06-t02')
    ?.blocks.find((block) => block.id === 'vers-five')
    ?.bullets;
  assert.equal(fiveSkills?.length, 5);
  assert.match(fiveSkills?.[0].nl ?? '', /^Observeren:/);
  assert.match(fiveSkills?.[1].nl ?? '', /^Beschrijven:/);
  assert.doesNotMatch(fiveSkills?.map((bullet) => bullet.nl).join(' ') ?? '', /Vaardigheden kiezen en oefenen/);

  const panModel = getTheoryConcept('pan-model');
  assert.ok(panModel);
  assert.match(`${panModel.deeperExplanation.nl} ${panModel.misconception.nl}`, /subjectief/i);
  assert.match(`${panModel.deeperExplanation.nl} ${panModel.misconception.nl}`, /geen diagnose|niet diagnostisch/i);
  assert.match(`${panModel.deeperExplanation.nl} ${panModel.misconception.nl}`, /risico/i);

  const bridgeText = theoryLessons
    .find((lesson) => lesson.id === 'w01-t01')
    ?.blocks.flatMap((block) => block.paragraphs.map((paragraph) => paragraph.nl))
    .join(' ') ?? '';
  assert.match(bridgeText, /intensiteit eerst veilig beïnvloeden/);
  assert.match(bridgeText, /tegelijk erkennen/);
});
