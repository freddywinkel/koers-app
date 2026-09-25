import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

// Run the production scheduler with browser APIs and a deterministic clock.
const source = await readFile(new URL('../src/lib/reminders.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source.replaceAll('import.meta.env.BASE_URL', "'/koers-app/'"), {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS }
}).outputText;
const settle = () => new Promise((resolve) => setImmediate(resolve));
const DAY_KEY = 'koers-reminder-last-fired';

function createBrowser({ hour = 20, sharedStorage = new Map(), locks } = {}) {
  const timers = new Map();
  const windowEvents = new EventTarget();
  const documentEvents = new EventTarget();
  let timerId = 0;
  let deliveries = 0;
  let fails = false;
  let resolveRegistration = () => Promise.resolve(registration);
  const registration = {
    async showNotification(_title, options) {
      if (fails) throw new Error('Notification unavailable');
      assert.equal(options.data.url, 'https://example.test/koers-app/#/check-in?manual=1');
      deliveries += 1;
    }
  };
  class FakeDate extends Date {
    constructor(...args) { super(...(args.length ? args : [2026, 8, 25, hour, 0, 0])); }
  }
  class FakeNotification {
    static permission = 'granted';
    constructor() { throw new Error('Mobile browser requires service-worker notifications'); }
  }
  const window = Object.assign(windowEvents, {
    Notification: FakeNotification,
    location: { origin: 'https://example.test' },
    setTimeout(callback, delay) {
      const id = ++timerId;
      timers.set(id, { callback, delay });
      return id;
    },
    clearTimeout(id) { timers.delete(id); }
  });
  const sandbox = {
    exports: {}, URL, Date: FakeDate, window,
    Notification: FakeNotification,
    document: Object.assign(documentEvents, { visibilityState: 'visible' }),
    navigator: { serviceWorker: { getRegistration: () => resolveRegistration() }, locks },
    localStorage: {
      getItem: (key) => sharedStorage.get(key) ?? null,
      setItem: (key, value) => sharedStorage.set(key, value)
    },
    require(name) {
      assert.equal(name, '../i18n');
      return { translate: (value) => value };
    }
  };
  vm.runInNewContext(compiled, sandbox, { filename: 'reminders.ts' });
  return {
    start: sandbox.exports.startReminderScheduler,
    focus: () => windowEvents.dispatchEvent(new Event('focus')),
    visible: () => documentEvents.dispatchEvent(new Event('visibilitychange')),
    timers, sharedStorage,
    get deliveries() { return deliveries; },
    set failing(value) { fails = value; },
    set permission(value) { FakeNotification.permission = value; },
    delayRegistration(promise) { resolveRegistration = () => promise.then(() => registration); }
  };
}

test('cleanup tijdens een trage instellingenread maakt geen achterblijvende timer', async () => {
  const browser = createBrowser();
  let resolveTime;
  const stop = browser.start(() => new Promise((resolve) => { resolveTime = resolve; }));
  stop();
  resolveTime('19:00');
  await settle();
  assert.equal(browser.timers.size, 0);
});

test('gelijktijdige focus en zichtbaarheid tonen slechts één herinnering', async () => {
  const browser = createBrowser();
  const stop = browser.start(() => '19:00');
  await settle();
  browser.focus();
  browser.visible();
  browser.focus();
  await settle();
  assert.equal(browser.deliveries, 1);
  assert.equal(browser.sharedStorage.get(DAY_KEY), '2026-09-25');
  assert.equal(browser.timers.size, 1);
  stop();
});

test('een mislukte melding mag bij de volgende terugkeer opnieuw geprobeerd worden', async () => {
  const browser = createBrowser();
  browser.failing = true;
  const stop = browser.start(() => '19:00');
  await settle();
  browser.focus();
  await settle();
  assert.equal(browser.sharedStorage.has(DAY_KEY), false);
  browser.failing = false;
  browser.focus();
  await settle();
  assert.equal(browser.deliveries, 1);
  assert.equal(browser.sharedStorage.get(DAY_KEY), '2026-09-25');
  stop();
});

test('een bestaande timer respecteert inmiddels ingetrokken toestemming', async () => {
  const browser = createBrowser({ hour: 18 });
  const stop = browser.start(() => '19:00');
  await settle();
  const timer = [...browser.timers.values()][0];
  assert.ok(timer);
  browser.permission = 'denied';
  timer.callback();
  await settle();
  assert.equal(browser.deliveries, 0);
  assert.equal(browser.sharedStorage.has(DAY_KEY), false);
  stop();
});

test('een melding uit een andere tab wordt gelezen vóór opnieuw melden', async () => {
  const browser = createBrowser();
  const stop = browser.start(() => '19:00');
  await settle();
  browser.sharedStorage.set(DAY_KEY, '2026-09-25');
  browser.focus();
  await settle();
  assert.equal(browser.deliveries, 0);
  stop();
});

test('cleanup tijdens ophalen van de service worker voorkomt een late melding', async () => {
  const browser = createBrowser();
  let resolveWorker;
  browser.delayRegistration(new Promise((resolve) => { resolveWorker = resolve; }));
  const stop = browser.start(() => '19:00');
  await settle();
  browser.focus();
  await settle();
  stop();
  resolveWorker();
  await settle();
  assert.equal(browser.deliveries, 0);
  assert.equal(browser.timers.size, 0);
  assert.equal(browser.sharedStorage.has(DAY_KEY), false);
});

test('Web Locks voorkomt dubbele meldingen bij twee gelijktijdig actieve tabs', async () => {
  let queue = Promise.resolve();
  const locks = { request(_name, callback) {
    queue = queue.then(callback);
    return queue;
  } };
  const sharedStorage = new Map();
  const first = createBrowser({ sharedStorage, locks });
  const second = createBrowser({ sharedStorage, locks });
  const stopFirst = first.start(() => '19:00');
  const stopSecond = second.start(() => '19:00');
  await settle();
  first.focus();
  second.focus();
  await settle();
  assert.equal(first.deliveries + second.deliveries, 1);
  stopFirst();
  stopSecond();
});
