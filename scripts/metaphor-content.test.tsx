import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import LessonTheorySection from '../src/components/LessonTheorySection';
import MetaphorArt from '../src/components/MetaphorArt';
import { crisisContacts, getCrisisActionHref } from '../src/content/crisis';
import { curriculum } from '../src/content/curriculum';
import { thinkingPatternsTheorySection } from '../src/content/thinkingErrors';
import { METAPHOR_ART_IDS, type MetaphorArtId } from '../src/content/types';
import { translate } from '../src/i18n';

const projectRoot = new URL('../', import.meta.url);

const EXPECTED_ART_BY_LESSON = {
  'w01-l02': 'stove-pans',
  'w02-l01': 'autopilot-cockpit',
  'w02-l02': 'mind-reporter',
  'w02-l03': 'breath-wave',
  'w03-l01': 'quicksand-float',
  'w03-l02': 'drop-the-rope',
  'w04-l01': 'bus-passengers',
  'w04-l04': 'leaves-on-stream',
  'w05-l01': 'chessboard-self',
  'w05-l02': 'sky-and-weather',
  'w06-l01': 'attention-lamp',
  'w07-l01': 'values-compass',
  'w07-l02': 'north-star',
  'w08-l01': 'long-walk',
  'w08-l02': 'marsh-crossing',
  'w09-l01': 'clear-sea',
  'w09-l02': 'row-to-shore',
  'w09-l03': 'mist-path',
  'w10-l01': 'eight-streams-river',
  'w10-l02': 'tide-line',
  'w10-l03': 'ebb-and-flow',
  'w11-l01': 'milk-warning',
  'w11-l02': 'self-manual',
  'w12-l02': 'ready-coat',
  'w12-l04': 'skilled-traveler'
} satisfies Record<string, MetaphorArtId>;

function allLessons() {
  return curriculum.flatMap((week) => week.lessons);
}

function lossyWebpDimensions(asset: Buffer) {
  assert.equal(asset.subarray(12, 16).toString('ascii'), 'VP8 ');
  assert.equal(asset.subarray(23, 26).toString('hex'), '9d012a');
  return {
    width: asset.readUInt16LE(26) & 0x3fff,
    height: asset.readUInt16LE(28) & 0x3fff
  };
}

test('alle 25 beeldkaarten hebben de afgesproken tekstgetrouwe illustratie', () => {
  const actual = Object.fromEntries(
    allLessons()
      .filter((lesson) => lesson.metaphorCard)
      .map((lesson) => [lesson.id, lesson.metaphorCard!.art])
  );

  assert.deepEqual(actual, EXPECTED_ART_BY_LESSON);
  assert.equal(new Set(Object.values(actual)).size, 25, 'verschillende metaforen mogen niet stil hetzelfde beeld delen');
  assert.deepEqual(new Set(Object.values(actual)), new Set(METAPHOR_ART_IDS));
});

test('iedere illustratie rendert als een eigen, decoratief WebP-beeld', async () => {
  const rendered = METAPHOR_ART_IDS.map((art) =>
    renderToStaticMarkup(createElement(MetaphorArt, { art }))
  );

  assert.equal(new Set(rendered).size, METAPHOR_ART_IDS.length);
  await Promise.all(
    rendered.map(async (image, index) => {
      const art = METAPHOR_ART_IDS[index];
      assert.match(image, /^<img /);
      assert.match(image, /alt=""/);
      assert.match(image, /aria-hidden="true"/);
      assert.match(image, /loading="lazy"/);
      assert.match(image, /decoding="async"/);
      assert.match(image, new RegExp(`src="(?:\\./)?metaphors/${art}\\.webp"`));
      assert.match(image, new RegExp(`data-metaphor-art="${art}"`));

      const asset = await readFile(new URL(`public/metaphors/${art}.webp`, projectRoot));
      assert.ok(asset.length > 10_000, `${art}.webp is onverwacht klein`);
      assert.ok(asset.length < 160_000, `${art}.webp is te zwaar voor de offline PWA`);
      assert.equal(asset.subarray(0, 4).toString('ascii'), 'RIFF');
      assert.equal(asset.subarray(8, 12).toString('ascii'), 'WEBP');
      assert.deepEqual(lossyWebpDimensions(asset), { width: 1062, height: 444 });
    })
  );
});

test('de theorielijst rendert als een toegankelijke, compacte begrippenlijst', () => {
  const html = renderToStaticMarkup(
    createElement(LessonTheorySection, {
      section: thinkingPatternsTheorySection,
      headingId: 'denkpatronen-heading'
    })
  );

  assert.match(html, /<section[^>]+aria-labelledby="denkpatronen-heading"/);
  assert.match(html, /<h2 id="denkpatronen-heading"/);
  assert.equal((html.match(/<details/g) ?? []).length, 12);
  assert.equal((html.match(/<summary/g) ?? []).length, 12);
  assert.doesNotMatch(html, /<details[^>]* open=/, 'de compacte lijst start ingeklapt');
  assert.doesNotMatch(html, /role="button"|aria-expanded=/);
  for (const item of thinkingPatternsTheorySection.items) {
    assert.ok(html.includes(`>${item.title}<`), `${item.title} ontbreekt in de begrippenlijst`);
  }
});

test('de tijdsinschatting van w06-l03 dekt alle getimede oefenstappen', () => {
  const lesson = allLessons().find((candidate) => candidate.id === 'w06-l03');
  assert.ok(lesson?.exercise);
  const seconds = lesson.exercise.steps.reduce((total, step) => total + (step.seconds ?? 0), 0);
  assert.ok((lesson.minutes ?? 0) * 60 >= seconds);
  assert.equal(lesson.minutes, 10);
});

test('Thuisarts-bestemming volgt de app-taal', () => {
  const huisarts = crisisContacts.find((contact) => contact.id === 'huisarts');
  assert.ok(huisarts);
  const action = huisarts.actions[0];
  assert.equal(getCrisisActionHref(action, 'nl'), 'https://www.thuisarts.nl/spoed-wie-bel-je');
  assert.equal(
    getCrisisActionHref(action, 'en'),
    'https://www.thuisarts.nl/dutch-healthcare/in-case-of-emergency'
  );
});

test('de voorbereidingstekst gebruikt een natuurlijke, genderneutrale Engelse vertaling', () => {
  const originalStorage = globalThis.localStorage;
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: { getItem: () => 'en' }
  });

  try {
    assert.equal(
      translate(
        'Voorbereiden is geen negativiteit. Het is juist vriendelijk voor de jij van later. Die hoeft dan alleen het plan te volgen.'
      ),
      'Preparing is not negative. It is a kindness to your future self, who can simply follow the plan.'
    );
  } finally {
    if (originalStorage) {
      Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: originalStorage });
    } else {
      Reflect.deleteProperty(globalThis, 'localStorage');
    }
  }
});
