import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const handlerSource = await readFile(new URL('../public/notification-handler.js', import.meta.url), 'utf8');

async function runNotificationClick({ requestedUrl, existingClientUrl }) {
  let clickHandler;
  let openedUrl = null;
  let navigatedUrl = null;
  let focused = false;
  let closed = false;
  let pending;

  const client = existingClientUrl
    ? {
        url: existingClientUrl,
        async navigate(url) {
          navigatedUrl = url;
          this.url = url;
        },
        async focus() {
          focused = true;
        }
      }
    : null;

  const sandbox = {
    URL,
    self: {
      registration: { scope: 'https://example.test/koers-app/' },
      clients: {
        async matchAll() {
          return client ? [client] : [];
        },
        async openWindow(url) {
          openedUrl = url;
        }
      },
      addEventListener(name, callback) {
        if (name === 'notificationclick') clickHandler = callback;
      }
    }
  };

  vm.runInNewContext(handlerSource, sandbox, { filename: 'notification-handler.js' });
  assert.equal(typeof clickHandler, 'function');

  clickHandler({
    notification: {
      data: { url: requestedUrl },
      close() {
        closed = true;
      }
    },
    waitUntil(promise) {
      pending = promise;
    }
  });
  await pending;

  return { closed, openedUrl, navigatedUrl, focused };
}

test('een geldige notificatie opent de check-in binnen dezelfde Pages-scope', async () => {
  const result = await runNotificationClick({
    requestedUrl: 'https://example.test/koers-app/#/check-in',
    existingClientUrl: null
  });

  assert.deepEqual(result, {
    closed: true,
    openedUrl: 'https://example.test/koers-app/#/check-in',
    navigatedUrl: null,
    focused: false
  });
});

test('een externe of gelijkende URL kan nooit buiten de Koers-scope openen', async () => {
  for (const requestedUrl of [
    'https://attacker.test/koers-app/#/check-in',
    'https://example.test/koers-app-evil/#/check-in'
  ]) {
    const result = await runNotificationClick({ requestedUrl, existingClientUrl: null });
    assert.equal(result.openedUrl, 'https://example.test/koers-app/#/check-in');
  }
});

test('een bestaande Koers-client wordt veilig naar de check-in gestuurd en gefocust', async () => {
  const result = await runNotificationClick({
    requestedUrl: 'https://example.test/koers-app/#/check-in',
    existingClientUrl: 'https://example.test/koers-app/#/cursus'
  });

  assert.equal(result.openedUrl, null);
  assert.equal(result.navigatedUrl, 'https://example.test/koers-app/#/check-in');
  assert.equal(result.focused, true);
});
