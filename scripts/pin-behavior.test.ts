import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import {
  clearSessionUnlock, hashPin, isSessionUnlocked, markSessionUnlocked,
  PIN_SESSION_KEY, savePin, verifyPin
} from '../src/lib/pin';

const session = new Map<string, string>();
beforeEach(() => {
  Object.defineProperty(globalThis, 'sessionStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => session.get(key) ?? null,
      setItem: (key: string, value: string) => session.set(key, value),
      removeItem: (key: string) => session.delete(key)
    }
  });
  clearSessionUnlock();
});
afterEach(() => clearSessionUnlock());

test('een oude of andere pincode-sessie ontgrendelt een nieuwe pincode niet', async () => {
  const original = await hashPin('1234');
  const changed = await hashPin('4321');
  session.set(PIN_SESSION_KEY, '1');
  assert.equal(isSessionUnlocked(original), false);
  markSessionUnlocked(original);
  assert.equal(isSessionUnlocked(original), true);
  assert.equal(isSessionUnlocked(changed), false);
  assert.equal(await verifyPin('1234', original), true);
  assert.equal(await verifyPin('4321', original), false);
});

test('pincode instellen ontgrendelt voor publicatie en slaat alleen de hash op', async () => {
  let saved = '';
  await savePin('5678', async (hash) => {
    assert.equal(isSessionUnlocked(hash), true);
    saved = hash;
  });
  assert.equal(saved, await hashPin('5678'));
  assert.notEqual(session.get(PIN_SESSION_KEY), '5678');
});

test('een mislukte pincode-write laat geen ontgrendelde sessie achter en kan opnieuw', async () => {
  const hash = await hashPin('1234');
  await assert.rejects(savePin('1234', async () => { throw new Error('disk full'); }), /disk full/);
  assert.equal(isSessionUnlocked(hash), false);
  assert.equal(session.has(PIN_SESSION_KEY), false);
  await savePin('1234', async () => undefined);
  assert.equal(isSessionUnlocked(hash), true);
});

test('een ongeldige pincode schrijft niets', async () => {
  let writes = 0;
  await assert.rejects(savePin('12', async () => { writes += 1; }));
  assert.equal(writes, 0);
  assert.equal(isSessionUnlocked(''), false);
});

test('geblokkeerde sessieopslag ondersteunt ontgrendelen en weer wissen in geheugen', async () => {
  Object.defineProperty(globalThis, 'sessionStorage', {
    configurable: true,
    get: () => { throw new Error('storage blocked'); }
  });
  const hash = await hashPin('1234');
  await savePin('1234', async () => undefined);
  assert.equal(isSessionUnlocked(hash), true);
  clearSessionUnlock();
  assert.equal(isSessionUnlocked(hash), false);
});
