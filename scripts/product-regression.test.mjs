import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';

const projectRoot = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, projectRoot), 'utf8');

test('de eerste weergave volgt het systeemthema met precies een browserkleur', async () => {
  const html = await read('index.html');
  assert.match(html, /let mode = 'systeem'/);
  assert.equal((html.match(/name="theme-color"/g) ?? []).length, 1);
  assert.match(html, /viewport-fit=cover/);
  assert.doesNotMatch(html, /maximum-scale|user-scalable/);
  assert.match(html, /rel="apple-touch-icon" sizes="180x180"/);
  assert.match(html, /icons\/apple-touch-icon-v2\.png/);
  assert.match(html, /rel="icon" type="image\/svg\+xml"/);
});

test('het manifest staat tabletrotatie toe en precachet assets niet dubbel', async () => {
  const config = await read('vite.config.ts');
  assert.doesNotMatch(config, /orientation\s*:/);
  assert.doesNotMatch(config, /includeAssets\s*:/);
  assert.match(config, /id:\s*'\.\/'/);
  assert.match(config, /start_url:\s*'\.\/#\/check-in'/);
  assert.match(config, /globIgnores:\s*\[/);
  assert.match(config, /importScripts:\s*\['notification-handler\.js'\]/);
});

test('herinneringen gebruiken de Pages-basis, bewaren dezelfde-dagstatus en openen de snelle check-in', async () => {
  const reminders = await read('src/lib/reminders.ts');
  const handler = await read('public/notification-handler.js');
  assert.match(reminders, /import\.meta\.env\.BASE_URL/);
  assert.match(reminders, /koers-reminder-last-fired/);
  assert.match(reminders, /#\/check-in/);
  assert.match(reminders, /icons\/notification-badge\.png/);
  assert.match(reminders, /badge:\s*badgeUrl/);
  assert.match(handler, /notificationclick/);
  assert.match(handler, /#\/check-in/);
  assert.match(handler, /clients\.openWindow/);
});

test('de PWA-check-in bewaart losse momenten, leegt de invoer en vermijdt een tweede iPhone-installatie', async () => {
  const app = await read('src/App.tsx');
  const quickCheckin = await read('src/screens/QuickCheckin.tsx');
  const quickCheckinForm = await read('src/components/QuickCheckinForm.tsx');
  const dailyPrompt = await read('src/components/DailyQuickCheckinPrompt.tsx');
  const shell = await read('src/components/AppShell.tsx');
  const updatePrompt = await read('src/components/UpdatePrompt.tsx');
  const hooks = await read('src/db/hooks.ts');
  const today = await read('src/screens/Vandaag.tsx');
  const checkinFormatting = await read('src/lib/checkins.ts');
  const profile = await read('src/screens/Profiel.tsx');
  const tabBar = await read('src/components/TabBar.tsx');
  const reminders = await read('src/lib/reminders.ts');
  const handler = await read('public/notification-handler.js');
  const checkinUi = `${quickCheckinForm}\n${today}`;
  assert.match(app, /path="\/check-in"/);
  assert.match(app, /<RequireOnboarding>/);
  assert.match(quickCheckin, /manualOpen/);
  assert.match(quickCheckin, /<Navigate to="\/" replace/);
  assert.match(quickCheckinForm, /saved = await saveCheckin\(\{ pan, note \}\)/);
  assert.match(quickCheckinForm, /onSaved\?\.\(saved\)/);
  assert.match(hooks, /export async function getRecentCheckins/);
  assert.match(hooks, /db\.checkins\.add/);
  assert.doesNotMatch(hooks, /db\.checkins\.update\(latest\.id/);
  assert.doesNotMatch(hooks, /seenDays/);
  assert.match(today, /formatCheckinMoment/);
  assert.doesNotMatch(today, /startOfDay\(row\.ts\)\s*<\s*startOfDay\(Date\.now\(\)\)/);
  assert.doesNotMatch(today, /value=\{checkin\?\.pan \?\? null\}/);
  assert.match(checkinUi, /Opgeslagen om/);
  assert.match(checkinUi, /Je kunt vandaag nog een check-in doen\./);
  assert.match(checkinUi, /setPan\(null\)/);
  assert.match(checkinUi, /setNote\(''\)/);
  assert.match(checkinFormatting, /hour:\s*'2-digit'/);
  assert.match(checkinFormatting, /minute:\s*'2-digit'/);
  assert.match(checkinFormatting, /Vandaag/);
  assert.match(checkinFormatting, /Today/);
  assert.match(dailyPrompt, /claimDailyCheckinPrompt\(\)/);
  assert.match(dailyPrompt, /role="dialog"/);
  assert.match(dailyPrompt, /aria-modal="true"/);
  assert.match(dailyPrompt, /visibilitychange/);
  assert.match(dailyPrompt, /window\.addEventListener\('focus'/);
  assert.match(dailyPrompt, /window\.removeEventListener\('focus'/);
  assert.match(dailyPrompt, /pathname\.startsWith\('\/steun\/'\)/);
  assert.match(dailyPrompt, /if \(blockedRoute\) setOpen\(false\)/);
  assert.match(dailyPrompt, /document\.querySelector<HTMLElement>\('main h1'\)/);
  assert.match(dailyPrompt, /restoreFocusFrameRef\.current = window\.requestAnimationFrame/);
  assert.match(app, /<UpdatePrompt suppressed=\{dailyCheckinOpen\} \/>/);
  assert.match(shell, /<DailyQuickCheckinPrompt onOpenChange=\{onDailyCheckinOpenChange\} \/>/);
  assert.match(shell, /inert=\{dailyCheckinOpen \? true : undefined\}/);
  assert.match(dailyPrompt, /onOpenChange\?\.\(open\)/);
  assert.match(updatePrompt, /if \(!needRefresh \|\| suppressed\) return null/);
  assert.match(quickCheckin, /doneLessonIds\.has\('w01-l03'\)/);
  assert.match(profile, /to="\/check-in\?manual=1"/);
  assert.match(profile, /installeer geen tweede kopie/);
  assert.match(reminders, /#\/check-in\?manual=1/);
  assert.match(handler, /#\/check-in\?manual=1/);
  assert.match(tabBar, /prefixes: \['\/', '\/check-in'\]/);
});

test('toetsenbordfocus en bewegingsvoorkeur hebben een globaal vangnet', async () => {
  const css = await read('src/index.css');
  const shell = await read('src/components/AppShell.tsx');
  const updatePrompt = await read('src/components/UpdatePrompt.tsx');
  assert.match(css, /:focus-visible/);
  assert.match(css, /main h1\[tabindex='-1'\]:focus\s*\{\s*outline:\s*none;/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(shell, /<Suspense/);
  assert.match(shell, /querySelector<HTMLHeadingElement>\('h1'\)/);
  assert.match(shell, /heading === lastHeadingRef\.current/);
  assert.match(shell, /document\.title/);
  assert.match(updatePrompt, /role="alertdialog"/);
  assert.match(updatePrompt, /registration\.waiting\) setNeedRefresh\(true\)/);
});

test('back-ups worden lokaal gevalideerd en bieden samenvoegen of vervangen', async () => {
  const hooks = await read('src/db/hooks.ts');
  const profile = await read('src/screens/Profiel.tsx');
  assert.match(hooks, /parsed\.app !== 'koers'/);
  assert.match(hooks, /parsed\.version !== BACKUP_VERSION/);
  assert.match(hooks, /unknownKey/);
  assert.match(hooks, /db\.transaction/);
  assert.match(profile, /handleImport\('merge'\)/);
  assert.match(profile, /handleImport\('replace'\)/);
});

test('de expliciete productcorrecties blijven zichtbaar', async () => {
  const today = await read('src/screens/Vandaag.tsx');
  const support = await read('src/screens/Crisis.tsx');
  const week2 = await read('src/content/weeks/week02.ts');
  assert.match(today, /Rond Week 1, Les 3 af om het pannetjesmodel te ontgrendelen\./);
  assert.match(today, /disabled=!panCheckinUnlocked|disabled=\{!panCheckinUnlocked\}|PanSelector value=\{null\} disabled/);
  assert.match(support, />Steunmiddelen</);
  assert.doesNotMatch(support, />Je gereedschappen</);
  assert.ok(
    support.indexOf('<SafetyContacts />') > support.indexOf('{crisisRaw.steunendeAfsluiting}'),
    'Directe hulp hoort helemaal onderaan de Steun-pagina te staan'
  );
  assert.doesNotMatch(week2, /\bdwalt\b|\bdwalde\b/i);
  assert.match(week2, /\bdwaalt\b/);
  assert.match(week2, /\bdwaalde\b/);
});

test('5-4-3-2-1 gaat met een bevestiging per zintuig direct verder', async () => {
  const support = await read('src/screens/Crisis.tsx');
  assert.match(support, /doneLabel: 'Ik heb 5 dingen gezien'/);
  assert.match(support, /doneLabel: 'Ik heb 1 ding geproefd'/);
  assert.match(support, /\{step\.doneLabel\}/);
  assert.match(support, /className="btn-primary mt-4" onClick=\{goNext\}/);
  assert.doesNotMatch(support, /setRemaining|Ik heb er nog een benoemd/);
});

test('Engelse pannamen blijven op gelijke vaste rijen uitgelijnd', async () => {
  const selector = await read('src/components/PanSelector.tsx');
  assert.match(selector, /flex min-h-\[96px\].*flex-col items-center justify-start/);
  assert.match(selector, /flex min-h-\[26px\] items-start justify-center text-center/);
});

test('deep-link terugknoppen blijven binnen de app', async () => {
  const helper = await read('src/lib/navigation.ts');
  const audioList = await read('src/screens/AudioList.tsx');
  const audioPlayer = await read('src/screens/AudioPlayer.tsx');
  const voices = await read('src/screens/HumanVoices.tsx');
  assert.match(helper, /historyIndex > 0/);
  assert.match(helper, /navigate\(fallback, \{ replace: true \}\)/);
  for (const source of [audioList, audioPlayer, voices]) assert.match(source, /navigateBackOr/);
});

test('een nieuwe pincode vergrendelt de huidige sessie niet tussentijds', async () => {
  const pinLock = await read('src/components/PinLock.tsx');
  const sessionIndex = pinLock.indexOf('markSessionUnlocked();', pinLock.indexOf('const pinHash = await hashPin(pin)'));
  const writeIndex = pinLock.indexOf('await set(PIN_HASH_KEY, pinHash);', sessionIndex);
  assert.ok(sessionIndex >= 0 && writeIndex > sessionIndex);
});

test('de volledige Engelse taalstand blijft offline en het profiel is duidelijk zichtbaar', async () => {
  const i18n = await read('src/i18n.ts');
  const translations = await read('src/i18n.generated.ts');
  const profile = await read('src/screens/Profiel.tsx');
  const today = await read('src/screens/Vandaag.tsx');
  const hooks = await read('src/db/hooks.ts');
  assert.match(i18n, /installLanguageRuntime/);
  assert.match(i18n, /'Bel nu 112': 'Call 112 now'/);
  assert.match(translations, /"Welkom bij Koers": "Welcome to Koers"/);
  assert.match(translations, /"Taal": "Language"/);
  assert.match(profile, /value: 'nl', label: 'Nederlands'/);
  assert.match(profile, /value: 'en', label: 'English'/);
  assert.match(today, /min-h-12/);
  assert.match(today, />Profiel</);
  assert.match(hooks, /key === 'language'/);
  assert.match(hooks, /'theme', 'design', 'language'/);
});

test('Engelse geleide audio gebruikt eigen opnames en dezelfde offline cache', async () => {
  const player = await read('src/lib/audioPlayer.ts');
  const generator = await read('scripts/generate-guided-audio.ts');
  const metadata = JSON.parse(await read('public/audio/en/generation.json'));
  assert.match(player, /audio\/en\/\$\{session\.id\}\.mp3/);
  assert.match(player, /getLanguage\(\) === 'en'/);
  assert.match(generator, /natural British English/);
  assert.match(generator, /AUDIO_ENGLISH_OVERRIDES/);
  assert.equal(metadata.language, 'en');
  assert.equal(metadata.voice, 'marin');
  for (const id of [
    'adem-anker',
    'bodyscan',
    'bladeren-op-de-stroom',
    'toestaan-van-emoties',
    'veilige-plek',
    'compassievolle-pauze'
  ]) {
    const file = await stat(new URL(`public/audio/en/${id}.mp3`, projectRoot));
    assert.ok(file.size > 1_000_000, `${id}.mp3 is onverwacht klein`);
  }
});

test('Engelse echte stemmen gebruiken de sessies van Victoria Mlynko', async () => {
  const voices = await read('src/content/humanVoices.ts');
  const screen = await read('src/screens/HumanVoices.tsx');
  assert.match(voices, /englishHumanVoiceSessions/);
  assert.match(voices, /Victoria Mlynko/);
  assert.match(voices, /3XYCcjeJdrSdfFNf1UD9CU/);
  assert.match(voices, /73UBuaeqs2d0NOV2woYTcF/);
  assert.match(voices, /5KbmyZAgrKegLsFqr025JH/);
  assert.match(voices, /1kFsyh4n9Po3kIbIwH093O/);
  assert.match(screen, /getLanguage\(\) === 'en'/);
  assert.match(screen, /Meditations for Mental Health/);
});
