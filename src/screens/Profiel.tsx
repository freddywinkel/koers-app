import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import {
  clearAllData,
  exportAllData,
  importAllData,
  useDoneLessonIds,
  useSettings,
  useStreak,
  type ImportMode
} from '../db/hooks';
import { allLessons } from '../content/helpers';
import { useEffect, useState, type ChangeEvent } from 'react';
import {
  getPermissionState,
  REMINDER_SETTINGS_EVENT,
  requestNotificationPermission,
  type PermissionState
} from '../lib/reminders';
import { PIN_HASH_KEY } from '../lib/pin';
import { PinLockScreen, PinSetup } from '../components/PinLock';
import { isIOS, isStandalone, promptInstall, useCanInstall } from '../lib/install';
import VersionCard from '../components/VersionCard';
import DesignPicker from '../components/DesignPicker';

type ThemeChoice = 'systeem' | 'licht' | 'donker';
type StorageStatus = 'checking' | 'persistent' | 'best-effort' | 'unsupported';
type ImportFeedback = { kind: 'success' | 'error'; text: string };
const THEMES: { value: ThemeChoice; label: string }[] = [
  { value: 'systeem', label: 'Systeem' },
  { value: 'licht', label: 'Licht' },
  { value: 'donker', label: 'Donker' }
];

const HASH_RE = /^[a-f0-9]{64}$/;

/** Profiel: voortgang, instellingen, installatie-info en databeheer. */
export default function Profiel() {
  const { get, set } = useSettings();
  const done = useDoneLessonIds();
  const streak = useStreak();
  const checkinCount = useLiveQuery(() => db.checkins.count(), []);
  const [deleted, setDeleted] = useState(false);

  const theme = (get('theme', 'systeem') || 'systeem') as ThemeChoice;
  const totalLessons = allLessons().length;

  /* ---------------------------- Herinneringen ---------------------------- */
  const [permission, setPermission] = useState<PermissionState>(() => getPermissionState());

  // De dagelijkse planner (startReminderScheduler) draait app-breed vanuit App.tsx;
  // dit scherm regelt alleen de tijd-instelling en de meldingspermissie.

  async function handleEnableNotifications() {
    // Stap 2 van de tweestaps-flow: de uitlegkaart (stap 1) is al zichtbaar.
    const nextPermission = await requestNotificationPermission();
    setPermission(nextPermission);
    if (nextPermission === 'granted') window.dispatchEvent(new Event(REMINDER_SETTINGS_EVENT));
  }

  /* -------------------------------- Pincode ------------------------------ */
  const pinHash = get(PIN_HASH_KEY);
  const hasPin = HASH_RE.test(pinHash);
  const [pinSetupOpen, setPinSetupOpen] = useState(false);
  const [testingGate, setTestingGate] = useState(false);

  async function handleRemovePin() {
    const ok = window.confirm('Pincode verwijderen? De app is daarna niet meer vergrendeld.');
    if (!ok) return;
    await set(PIN_HASH_KEY, '');
  }

  /* ------------------------------- Installeren ---------------------------- */
  const canInstallNow = useCanInstall();
  const [installMsg, setInstallMsg] = useState('');
  const installed = isStandalone();
  const ios = isIOS();

  async function handleInstall() {
    const outcome = await promptInstall();
    if (outcome === 'accepted') setInstallMsg('De installatie is gestart. Open Koers straks vanaf je beginscherm.');
    else if (outcome === 'dismissed') setInstallMsg('Geen probleem — later kan altijd nog, via het menu van je browser.');
    else setInstallMsg('De installatieprompt is niet meer beschikbaar. Gebruik het menu van je browser om Koers te installeren.');
  }

  /* --------------------------- Lokale opslag ----------------------------- */
  const [storageStatus, setStorageStatus] = useState<StorageStatus>('checking');
  const [storageMsg, setStorageMsg] = useState('');
  const [exportMsg, setExportMsg] = useState('');
  const [pendingImport, setPendingImport] = useState<{ name: string; json: string } | null>(null);
  const [importFeedback, setImportFeedback] = useState<ImportFeedback | null>(null);
  const [importBusy, setImportBusy] = useState(false);

  useEffect(() => {
    let active = true;
    if (!navigator.storage?.persisted) {
      setStorageStatus('unsupported');
      return;
    }
    void navigator.storage.persisted().then((persistent) => {
      if (active) setStorageStatus(persistent ? 'persistent' : 'best-effort');
    }).catch(() => {
      if (active) setStorageStatus('unsupported');
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleProtectStorage() {
    if (!navigator.storage?.persist) return;
    try {
      const persistent = await navigator.storage.persist();
      setStorageStatus(persistent ? 'persistent' : 'best-effort');
      setStorageMsg(
        persistent
          ? 'Je browser geeft Koers nu extra bescherming tegen automatisch opschonen.'
          : 'Je browser kon geen extra bescherming geven. Bewaar daarom af en toe een export buiten de app.'
      );
    } catch {
      setStorageMsg('Extra opslagbescherming aanvragen lukte niet. Een export buiten de app blijft de veiligste reservekopie.');
    }
  }

  async function handleExport() {
    const json = await exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `koers-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportMsg('De export is gedownload. Bewaar het bestand op een plek die alleen jij kunt openen.');
  }

  async function handleImportFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    setPendingImport(null);
    setImportFeedback(null);
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setImportFeedback({ kind: 'error', text: 'Dit bestand is groter dan 10 MB en kan niet veilig worden ingelezen.' });
      return;
    }
    try {
      setPendingImport({ name: file.name, json: await file.text() });
    } catch {
      setImportFeedback({ kind: 'error', text: 'Het gekozen bestand kon niet worden gelezen.' });
    }
  }

  async function handleImport(mode: ImportMode) {
    if (!pendingImport || importBusy) return;
    const confirmed = window.confirm(
      mode === 'replace'
        ? 'Huidige gegevens vervangen? Alle lokale Koers-gegevens worden eerst gewist en daarna uit dit bestand teruggezet. Gegevens die niet in de export staan gaan definitief verloren. Doorgaan?'
        : 'Gegevens samenvoegen? De huidige gegevens blijven staan, maar records met dezelfde interne sleutel kunnen door de export worden overschreven. Maak zo nodig eerst een nieuwe export. Doorgaan?'
    );
    if (!confirmed) return;

    setImportBusy(true);
    setImportFeedback(null);
    try {
      const summary = await importAllData(pendingImport.json, mode);
      const action = mode === 'replace' ? 'teruggezet' : 'samengevoegd';
      setImportFeedback({
        kind: 'success',
        text: `${summary.totalRows} ${summary.totalRows === 1 ? 'rij is' : 'rijen zijn'} veilig ${action}.`
      });
      setPendingImport(null);
      setDeleted(false);
    } catch (error) {
      setImportFeedback({
        kind: 'error',
        text: error instanceof Error ? error.message : 'Terugzetten lukte niet. Je huidige gegevens zijn niet aangepast.'
      });
    } finally {
      setImportBusy(false);
    }
  }

  async function handleDelete() {
    const ok = window.confirm(
      'Weet je het zeker? Al je gegevens (check-ins, voortgang, notities) worden van dit apparaat verwijderd. Dit kun je niet ongedaan maken.'
    );
    if (!ok) return;
    await clearAllData();
    setDeleted(true);
  }

  return (
    <div className="screen-stack">
      <header className="px-1 pt-2">
        <p className="eyebrow">Profiel</p>
        <h1 className="mt-1.5 font-display text-[29px] font-semibold leading-[1.16] tracking-[-0.01em]">Over jou &amp; de app</h1>
      </header>

      {/* Voortgang */}
      <section className="card" aria-label="Voortgang">
        <h2 className="card-title">Je voortgang</h2>
        <div className="mt-3 grid grid-cols-3 gap-2.5 text-center">
          <div className="rounded-2xl bg-dune px-2 py-3">
            <p className="font-display text-[22px] font-semibold text-ink">
              {done?.size ?? 0}<span className="text-sm text-ink-soft">/{totalLessons}</span>
            </p>
            <p className="text-[11.5px] font-bold text-ink-soft">lessen</p>
          </div>
          <div className="rounded-2xl bg-dune px-2 py-3">
            <p className="font-display text-[22px] font-semibold text-ink">{checkinCount ?? 0}</p>
            <p className="text-[11.5px] font-bold text-ink-soft">check-ins</p>
          </div>
          <div className="rounded-2xl bg-dune px-2 py-3">
            <p className="font-display text-[22px] font-semibold text-ink">{streak.count}</p>
            <p className="text-[11.5px] font-bold text-ink-soft">dagen op rij</p>
          </div>
        </div>
        <label className="mt-4 block">
          <span className="sub">Hoe mogen we je noemen? (alleen op dit apparaat)</span>
          <input
            className="input-soft mt-1.5"
            type="text"
            maxLength={30}
            placeholder="Je naam of roepnaam"
            defaultValue={get('naam')}
            onBlur={(e) => void set('naam', e.target.value.trim())}
          />
        </label>
      </section>

      {/* Instellingen */}
      <section className="card" aria-label="Instellingen">
        <h2 className="card-title">Instellingen</h2>

        <p className="sub mt-3">Uiterlijk</p>
        <fieldset className="mt-1.5 flex min-w-0 flex-wrap gap-2">
          <legend className="sr-only">Kleurmodus</legend>
          {THEMES.map((t) => {
            const active = theme === t.value;
            return (
              <label
                key={t.value}
                className={[
                  'choice-option flex min-h-[44px] min-w-0 flex-1 cursor-pointer items-center justify-center rounded-2xl border text-sm font-extrabold',
                  active ? 'border-euca-deep bg-eucatint text-euca-deep' : 'border-line bg-dune text-ink'
                ].join(' ')}
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="kleurmodus"
                  value={t.value}
                  checked={active}
                  onChange={() => void set('theme', t.value)}
                />
                {t.label}
              </label>
            );
          })}
        </fieldset>

        <p className="sub mt-4">Ontwerp</p>
        <DesignPicker />

        {/* Herinnering: tijd + tweestaps meldingsflow.
            Blok is expliciet min-w-0/max-begrensd: iOS geeft een tijdveld een
            eigen minimumbreedte waardoor het uit de kaart kon lopen. */}
        <div className="mt-4 min-w-0">
          <label className="flex min-w-0 items-center justify-between gap-3">
            <span className="sub min-w-0 flex-1">Herinneringstijd voor je check-in</span>
              <input
                className="input-soft min-w-0 w-[132px] max-w-full flex-none"
                type="time"
                value={get('herinnering-tijd', '19:00')}
                onChange={(e) => {
                  void set('herinnering-tijd', e.target.value).then(() => {
                    window.dispatchEvent(new Event(REMINDER_SETTINGS_EVENT));
                  });
                }}
              />
          </label>
        </div>

        {permission === 'default' && (
          <div className="mt-3 rounded-2xl bg-dune p-4">
            <p className="text-sm font-extrabold text-ink">Wil je een vriendelijke dagelijkse herinnering?</p>
            <p className="sub mt-1">
              We sturen alleen een neutrale melding: &ldquo;Tijd voor je dagelijkse check-in&rdquo;. Niks over hoe jij je
              voelt — er verschijnt nooit iets gevoeligs op je scherm.
            </p>
            <button type="button" className="btn-primary mt-3" onClick={() => void handleEnableNotifications()}>
              Meldingen aanzetten
            </button>
          </div>
        )}
        {permission === 'granted' && (
          <div className="mt-3">
            <span className="chip border border-euca-deep/30 bg-eucatint text-euca-deep">Meldingen staan aan</span>
            <p className="sub mt-2">
              Je krijgt een herinnering rond {get('herinnering-tijd', '19:00')} zolang de app open is. Meldingen als de
              app helemaal dicht is komen in een latere versie — daarvoor is een server nodig.
            </p>
          </div>
        )}
        {permission === 'denied' && (
          <div className="mt-3 rounded-2xl bg-apricot-soft p-4">
            <p className="text-sm font-extrabold text-ap-deep">Meldingen staan uit in je browser</p>
            <p className="mt-1 text-[13.5px] leading-body text-ap-deep">
              Wil je ze toch aan? Dat kan via de site-instellingen van je browser (meestal het slotje naast het
              webadres). Je herinneringstijd bewaren we alvast.
            </p>
          </div>
        )}
        {permission === 'unsupported' && (
          <p className="sub mt-2">Deze browser ondersteunt geen meldingen — je herinneringstijd bewaren we alvast.</p>
        )}

        {/* Pincode */}
        <div className="mt-4 rounded-2xl bg-dune px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-ink">App-vergrendeling (pincode)</p>
              <p className="sub">
                Extra privacy voor gedeelde telefoons. Een pincode houdt mensen die meekijken tegen, maar versleutelt je gegevens
                niet volledig.
              </p>
            </div>
            {hasPin && <span className="chip border border-euca-deep/30 bg-eucatint flex-none text-euca-deep">Actief</span>}
          </div>

          {!hasPin && !pinSetupOpen && (
            <button type="button" className="btn-secondary mt-3 w-full" onClick={() => setPinSetupOpen(true)}>
              Pincode instellen
            </button>
          )}

          {pinSetupOpen && !hasPin && (
            <PinSetup onSaved={() => setPinSetupOpen(false)} onCancel={() => setPinSetupOpen(false)} />
          )}

          {hasPin && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className="btn-secondary min-w-0 flex-1" onClick={() => setTestingGate(true)}>
                Test de vergrendeling
              </button>
              <button
                type="button"
                className="flex min-h-[44px] min-w-0 flex-1 items-center justify-center rounded-2xl bg-apricot-soft px-4 py-2.5 text-sm font-extrabold text-ap-deep transition-transform active:scale-[0.99]"
                onClick={() => void handleRemovePin()}
              >
                Verwijderen
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Installeer de app */}
      <section className="card" aria-label="Installeer de app">
        <h2 className="card-title">Installeer de app</h2>
        {installed ? (
          <div className="mt-3">
            <span className="chip border border-euca-deep/30 bg-eucatint text-euca-deep">Geïnstalleerd</span>
            <p className="sub mt-2">Je gebruikt Koers nu als app vanaf je beginscherm. Fijn!</p>
          </div>
        ) : (
          <>
            <p className="sub mt-1.5">
              Zet Koers op je beginscherm om de app snel en schermvullend te openen. Je gegevens blijven lokaal in
              deze browser; installatie is geen automatische back-up.
            </p>

            {canInstallNow && (
              <>
                <button type="button" className="btn-primary mt-3" onClick={() => void handleInstall()}>
                  Installeer de app
                </button>
              </>
            )}
            {installMsg && <p className="sub mt-2" role="status">{installMsg}</p>}

            {ios && !canInstallNow && !installMsg && (
              <div className="mt-3 rounded-2xl bg-dune p-4">
                <p className="text-sm font-extrabold text-ink">Zo doe je dat op je iPhone of iPad</p>
                <ol className="mt-1.5 list-decimal pl-5 text-sm leading-[1.6] text-ink-soft">
                  <li>Tik in Safari op <b className="text-ink">Deel</b> (het vierkantje met pijl omhoog).</li>
                  <li>Scroll en tik op <b className="text-ink">Zet op beginscherm</b>.</li>
                  <li>Tik op <b className="text-ink">Voeg toe</b>.</li>
                </ol>
              </div>
            )}

            {!ios && !canInstallNow && !installMsg && (
              <>
                <div className="mt-3 rounded-2xl bg-dune p-4">
                  <p className="text-sm font-extrabold text-ink">iPhone / iPad (Safari)</p>
                  <ol className="mt-1.5 list-decimal pl-5 text-sm leading-[1.6] text-ink-soft">
                    <li>Tik op <b className="text-ink">Deel</b> (het vierkantje met pijl omhoog).</li>
                    <li>Scroll en tik op <b className="text-ink">Zet op beginscherm</b>.</li>
                    <li>Tik op <b className="text-ink">Voeg toe</b>.</li>
                  </ol>
                </div>
                <div className="mt-2.5 rounded-2xl bg-dune p-4">
                  <p className="text-sm font-extrabold text-ink">Android (Chrome)</p>
                  <ol className="mt-1.5 list-decimal pl-5 text-sm leading-[1.6] text-ink-soft">
                    <li>Tik rechtsboven op het <b className="text-ink">menu</b> (drie puntjes).</li>
                    <li>Tik op <b className="text-ink">App installeren</b> of <b className="text-ink">Toevoegen aan startscherm</b>.</li>
                  </ol>
                </div>
              </>
            )}
          </>
        )}
      </section>

      {/* Versie & update-check */}
      <VersionCard />

      {/* Data */}
      <section className="card" aria-label="Jouw gegevens">
        <h2 className="card-title">Jouw gegevens</h2>
        <p className="sub mt-1.5">
          Alles wat je hier invult blijft in deze browser. Er is geen account, cloudsynchronisatie of automatische
          reservekopie. Download af en toe een export en bewaar die privé. Zo&apos;n Koers-export kun je hier later
          terugzetten of samenvoegen. Je app-pincode blijft alleen op dit apparaat en staat nooit in de export.
        </p>
        {storageStatus === 'persistent' && (
          <p className="mt-3 rounded-2xl bg-eucatint px-4 py-3 text-[13.5px] font-semibold text-euca-deep">
            Lokale opslag heeft extra bescherming tegen automatisch opschonen door je browser.
          </p>
        )}
        {storageStatus === 'best-effort' && (
          <div className="mt-3 rounded-2xl bg-dune p-4">
            <p className="sub">
              Je browser bewaart de gegevens op basis van beschikbare ruimte. Een export buiten de app blijft de veiligste reservekopie.
            </p>
            <button type="button" className="btn-secondary mt-3 w-full" onClick={() => void handleProtectStorage()}>
              Vraag extra opslagbescherming
            </button>
          </div>
        )}
        {storageStatus === 'unsupported' && (
          <p className="sub mt-3">Deze browser kan geen extra opslagbescherming bevestigen. Maak daarom geregeld een export.</p>
        )}
        {storageMsg && <p className="sub mt-2" role="status">{storageMsg}</p>}
        <button type="button" className="btn-secondary mt-3.5 w-full" onClick={() => void handleExport()}>
          Exporteer alles als JSON-bestand
        </button>
        {exportMsg && <p className="sub mt-2" role="status">{exportMsg}</p>}
        <label className="choice-option btn-secondary mt-2.5 w-full cursor-pointer">
          Kies een Koers-export om terug te zetten
          <input
            className="sr-only"
            type="file"
            accept="application/json,.json"
            onChange={(event) => void handleImportFile(event)}
            disabled={importBusy}
          />
        </label>
        {pendingImport && (
          <div className="mt-3 rounded-2xl bg-dune p-4">
            <p className="text-sm font-extrabold text-ink">Gekozen bestand</p>
            <p className="sub mt-1 break-all">{pendingImport.name}</p>
            <p className="sub mt-2">
              Samenvoegen houdt je huidige gegevens; vervangen wist ze eerst. Koers accepteert alleen gevalideerde
              exports met bekende gegevenstabellen. Je huidige app-pincode blijft bij beide keuzes behouden.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                className="btn-secondary w-full"
                disabled={importBusy}
                onClick={() => void handleImport('merge')}
              >
                {importBusy ? 'Bezig…' : 'Samenvoegen'}
              </button>
              <button
                type="button"
                className="flex min-h-[44px] w-full items-center justify-center rounded-2xl bg-apricot-soft px-4 py-2.5 text-sm font-extrabold text-ap-deep disabled:opacity-60"
                disabled={importBusy}
                onClick={() => void handleImport('replace')}
              >
                {importBusy ? 'Bezig…' : 'Alles vervangen'}
              </button>
            </div>
          </div>
        )}
        {importFeedback && (
          <p
            className={importFeedback.kind === 'error' ? 'mt-2 text-[13.5px] font-semibold text-ap-deep' : 'sub mt-2'}
            role={importFeedback.kind === 'error' ? 'alert' : 'status'}
          >
            {importFeedback.text}
          </p>
        )}
        <button
          type="button"
          className="mt-2.5 flex min-h-[44px] w-full items-center justify-center rounded-2xl bg-apricot-soft px-4 py-2.5 text-sm font-extrabold text-ap-deep"
          onClick={() => void handleDelete()}
        >
          Verwijder alle gegevens
        </button>
        {deleted && <p className="sub mt-2" role="status">Je gegevens zijn verwijderd. Je begint met een schone lei — helemaal oké.</p>}
      </section>

      {/* Demo/test van de app-gate vanuit de pincode-instelling */}
      {testingGate && hasPin && (
        <PinLockScreen demo expectedHash={pinHash} onUnlocked={() => setTestingGate(false)} onCancel={() => setTestingGate(false)} />
      )}
    </div>
  );
}
