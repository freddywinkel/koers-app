import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import MetaphorArt from '../src/components/MetaphorArt';
import { crisisContacts, getCrisisActionHref } from '../src/content/crisis';
import { curriculum } from '../src/content/curriculum';
import { METAPHOR_ART_IDS, type MetaphorArtId } from '../src/content/types';
import { translate } from '../src/i18n';

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

test('iedere illustratie rendert als een eigen, taalvrij en decoratief SVG-beeld', () => {
  const rendered = METAPHOR_ART_IDS.map((art) =>
    renderToStaticMarkup(createElement(MetaphorArt, { art }))
  );

  assert.equal(new Set(rendered).size, METAPHOR_ART_IDS.length);
  rendered.forEach((svg, index) => {
    assert.match(svg, /^<svg /);
    assert.match(svg, /aria-hidden="true"/);
    assert.match(svg, new RegExp(`data-metaphor-art="${METAPHOR_ART_IDS[index]}"`));
    assert.doesNotMatch(svg, /<text(?:\s|>)/);
  });
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
