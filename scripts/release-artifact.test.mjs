import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import test from 'node:test';

const distRoot = new URL('../dist/', import.meta.url);
const readDist = (path) => readFile(new URL(path, distRoot), 'utf8');
const metaphorFiles = [
  'attention-lamp.webp',
  'autopilot-cockpit.webp',
  'breath-wave.webp',
  'bus-passengers.webp',
  'chessboard-self.webp',
  'clear-sea.webp',
  'drop-the-rope.webp',
  'ebb-and-flow.webp',
  'eight-streams-river.webp',
  'leaves-on-stream.webp',
  'long-walk.webp',
  'marsh-crossing.webp',
  'milk-warning.webp',
  'mind-reporter.webp',
  'mist-path.webp',
  'north-star.webp',
  'quicksand-float.webp',
  'ready-coat.webp',
  'row-to-shore.webp',
  'self-manual.webp',
  'skilled-traveler.webp',
  'sky-and-weather.webp',
  'stove-pans.webp',
  'tide-line.webp',
  'values-compass.webp'
];

async function assetFiles(extension) {
  const entries = await readdir(new URL('assets/', distRoot));
  return entries.filter((entry) => entry.endsWith(extension));
}

test('de gebouwde Pages-manifest houdt één Koers-installatie en opent de snelle check-in', async () => {
  const manifest = JSON.parse(await readDist('manifest.webmanifest'));

  assert.equal(manifest.id, './');
  assert.equal(manifest.start_url, './#/check-in');
  assert.equal(manifest.scope, './');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.lang, 'nl');
  assert.deepEqual(
    manifest.icons.map(({ src, sizes, purpose }) => ({ src, sizes, purpose })),
    [
      { src: 'icons/icon-192.png', sizes: '192x192', purpose: 'any' },
      { src: 'icons/icon-512.png', sizes: '512x512', purpose: 'any' },
      { src: 'icons/icon-maskable-512.png', sizes: '512x512', purpose: 'maskable' }
    ]
  );
});

test('de gebouwde app gebruikt overal het GitHub Pages-subpad', async () => {
  const html = await readDist('index.html');
  const pagesDocumentUrl = new URL('https://example.test/koers-app/index.html');
  const localUrls = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((url) => !url.startsWith('data:'));
  const resolvedUrls = localUrls.map((url) => new URL(url, pagesDocumentUrl));

  assert.ok(localUrls.length >= 3, 'index.html hoort meerdere gebouwde assets te laden');
  assert.ok(
    resolvedUrls.every(
      (url) => url.origin === pagesDocumentUrl.origin && url.pathname.startsWith('/koers-app/')
    ),
    `alle lokale assets horen na browserresolutie onder /koers-app/ te staan: ${resolvedUrls
      .map((url) => url.href)
      .join(', ')}`
  );
  assert.doesNotMatch(html, /(?:src|href)="\/src\//);
});

test('de daadwerkelijke productie-bundle bevat de snelle check-inroute en gebruikersflow', async () => {
  const scripts = await assetFiles('.js');
  assert.ok(scripts.length > 0, 'er hoort minstens één productie-JavaScriptbestand te zijn');
  const bundle = (await Promise.all(scripts.map((entry) => readDist(`assets/${entry}`)))).join('\n');

  assert.match(bundle, /\/check-in/);
  assert.match(bundle, /Snelle check-in/);
  assert.match(bundle, /Opslaan in Koers/);
  assert.match(bundle, /w01-l03/);
});

test('service worker en notificatiehandler verwijzen naar de verse app-shell en check-in', async () => {
  const [worker, handler] = await Promise.all([readDist('sw.js'), readDist('notification-handler.js')]);

  assert.match(worker, /notification-handler\.js/);
  assert.match(worker, /index\.html/);
  assert.match(worker, /manifest\.webmanifest/);
  const precachedMetaphors = [...worker.matchAll(/metaphors\/([a-z0-9-]+\.webp)/g)]
    .map((match) => match[1]);
  assert.equal(
    precachedMetaphors.length,
    metaphorFiles.length,
    'alle geheugenbeelden horen precies eenmaal in de offline precache'
  );
  assert.deepEqual(
    [...new Set(precachedMetaphors)].sort(),
    metaphorFiles,
    'de offline precache hoort exact dezelfde geheugenbeelden te bevatten als de release'
  );
  assert.match(handler, /#\/check-in/);
  assert.doesNotMatch(handler, /fallbackUrl\s*=\s*`\$\{self\.registration\.scope\}#\/`/);
});

test('alle essentiële iconen zijn niet-leeg in het release-artifact', async () => {
  for (const icon of ['icon-192.png', 'icon-512.png', 'icon-maskable-512.png']) {
    const info = await stat(new URL(`icons/${icon}`, distRoot));
    assert.ok(info.size > 1_000, `${icon} is onverwacht klein`);
  }
});

test('alle 25 geoptimaliseerde geheugenbeelden staan in het release-artifact', async () => {
  const actual = (await readdir(new URL('metaphors/', distRoot)))
    .filter((entry) => entry.endsWith('.webp'))
    .sort();
  assert.deepEqual(actual, metaphorFiles);

  let totalBytes = 0;
  for (const image of metaphorFiles) {
    const info = await stat(new URL(`metaphors/${image}`, distRoot));
    assert.ok(info.size > 10_000, `${image} is onverwacht klein`);
    assert.ok(info.size < 160_000, `${image} is te zwaar voor de offline PWA`);
    totalBytes += info.size;
  }
  assert.ok(totalBytes < 3_000_000, `de beeldset is te zwaar: ${totalBytes} bytes`);
});
