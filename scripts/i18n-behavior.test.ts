import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { getLanguage, getLocale, storeLanguage, translate } from '../src/i18n';

afterEach(() => {
  storeLanguage('nl');
  Reflect.deleteProperty(globalThis, 'localStorage');
});

test('the saved language works in memory when localStorage is blocked', () => {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get: () => { throw new Error('storage blocked'); }
  });
  storeLanguage('en');
  assert.equal(getLanguage(), 'en');
  assert.equal(getLocale(), 'en-GB');
  assert.equal(translate('Opslaan lukte niet. Probeer het opnieuw.'), 'Saving failed. Please try again.');
  storeLanguage('nl');
  assert.equal(getLanguage(), 'nl');
  assert.equal(getLocale(), 'nl-NL');
});

test('split progress wording and safety-plan pan names match English check-ins', () => {
  storeLanguage('en');
  assert.equal(translate('van'), 'of');
  assert.equal(translate('Pan 1: Rustig'), 'Pan 1: Calm');
  assert.equal(translate('Pan 2: Rimpelt'), 'Pan 2: Rippling');
  assert.equal(translate('Open deze vaardigheid'), 'Open this skill');
});

test('canonical language wins over an old cache when storage writes fail', () => {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: () => 'nl',
      setItem: () => { throw new Error('quota exceeded'); }
    }
  });
  storeLanguage('en');
  assert.equal(getLanguage(), 'en');
  assert.equal(getLocale(), 'en-GB');
});
