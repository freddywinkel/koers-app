import assert from 'node:assert/strict';
import test from 'node:test';
import { activateWaitingWorker } from '../src/lib/pwaUpdates';

function setup({ throws = false } = {}) {
  const timers = new Map<number, () => void>();
  let nextTimer = 0;
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      setTimeout(callback: () => void) { const id = ++nextTimer; timers.set(id, callback); return id; },
      clearTimeout(id: number) { timers.delete(id); }
    }
  });
  const messages: unknown[] = [];
  const worker = Object.assign(new EventTarget(), {
    state: 'installed' as ServiceWorkerState,
    postMessage(message: unknown) {
      if (throws) throw new Error('Worker unavailable');
      messages.push(message);
    }
  });
  const container = new EventTarget();
  return {
    activate: () => activateWaitingWorker(worker as unknown as ServiceWorker, container as ServiceWorkerContainer),
    worker, container, timers, messages
  };
}

test('een update slaagt pas zodra de nieuwe worker de pagina overneemt', async () => {
  const mock = setup();
  let completed = false;
  const pending = mock.activate().then(() => { completed = true; });
  assert.deepEqual(mock.messages, [{ type: 'SKIP_WAITING' }]);
  await Promise.resolve();
  assert.equal(completed, false);
  mock.container.dispatchEvent(new Event('controllerchange'));
  await pending;
  assert.equal(completed, true);
  assert.equal(mock.timers.size, 0);
});

test('een niet-reagerende update eindigt met een fout in plaats van onbeperkt wachten', async () => {
  const mock = setup();
  const pending = mock.activate();
  const rejected = assert.rejects(pending, /reageert niet/);
  [...mock.timers.values()][0]();
  await rejected;
  assert.equal(mock.timers.size, 0);
});

test('een verdwenen worker ruimt de updatepoging op', async () => {
  const mock = setup();
  const pending = mock.activate();
  const rejected = assert.rejects(pending, /niet meer beschikbaar/);
  mock.worker.state = 'redundant';
  mock.worker.dispatchEvent(new Event('statechange'));
  await rejected;
  assert.equal(mock.timers.size, 0);
});

test('een fout tijdens het activeren blijft afvangbaar en laat geen timer achter', async () => {
  const mock = setup({ throws: true });
  await assert.rejects(mock.activate(), /Worker unavailable/);
  assert.equal(mock.timers.size, 0);
});
