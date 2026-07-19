import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { clearAllData, exportAllData, useDoneLessonIds, useSettings, useStreak } from '../db/hooks';
import { allLessons } from '../content/helpers';
import { useState } from 'react';
import { getPermissionState, requestNotificationPermission, type PermissionState } from '../lib/reminders';
import { PIN_HASH_KEY } from '../lib/pin';
import { PinLockScreen, PinSetup } from '../components/PinLock';
import { isIOS, isStandalone, promptInstall, useCanInstall } from '../lib/install';
import VersionCard from '../components/VersionCard';

type ThemeChoice = 'systeem' | 'licht' | 'donker';
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
    setPermission(await requestNotificationPermission());
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
    if (outcome === 'accepted') setInstallMsg('Mooi — Koers staat nu op je beginscherm.');
    else if (outcome === 'dismissed') setInstallMsg('Geen probleem — later kan altijd nog, via het menu van je browser.');
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
        <div className="mt-1.5 flex flex-wrap gap-2" role="radiogroup" aria-label="Kleurmodus">
          {THEMES.map((t) => {
            const active = theme === t.value;
            return (
              <button
                key={t.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => void set('theme', t.value)}
                className={[
                  'min-h-[44px] min-w-0 flex-1 rounded-2xl border text-sm font-extrabold',
                  active ? 'border-euca-deep bg-eucatint text-euca-deep' : 'border-line bg-dune text-ink'
                ].join(' ')}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Herinnering: tijd + tweestaps meldingsflow.
            Blok is expliciet min-w-0/max-begrensd: iOS geeft een tijdveld een
            eigen minimumbreedte waardoor het uit de kaart kon lopen. */}
        <div className="mt-4 min-w-0">
          <label className="block min-w-0">
            <span className="sub">Herinneringstijd voor je check-in</span>
            <input
              className="input-soft mt-1.5 min-w-0 max-w-full"
              type="time"
              value={get('herinnering-tijd', '19:00')}
              onChange={(e) => void set('herinnering-tijd', e.target.value)}
            />
          </label>
        </div>

        {permission === 'default' && (
          <div className="mt-3 rounded-2xl bg-dune p-4">
            <p className="text-sm font-extrabold text-ink">Wil je een zachte dagelijkse herinnering?</p>
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
                Extra privacy voor gedeelde telefoons. Een pincode houdt meekijkers tegen; het versleutelt je gegevens
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
              Zet Koers op je beginscherm. Zo blijven je gegevens goed bewaard en open je de app als een
              echte app.
            </p>

            {canInstallNow && (
              <>
                <button type="button" className="btn-primary mt-3" onClick={() => void handleInstall()}>
                  Installeer de app
                </button>
                {installMsg && <p className="sub mt-2">{installMsg}</p>}
              </>
            )}

            {ios && !canInstallNow && (
              <div className="mt-3 rounded-2xl bg-dune p-4">
                <p className="text-sm font-extrabold text-ink">Zo doe je dat op je iPhone of iPad</p>
                <ol className="mt-1.5 list-decimal pl-5 text-sm leading-[1.6] text-ink-soft">
                  <li>Tik in Safari op <b className="text-ink">Deel</b> (het vierkantje met pijl omhoog).</li>
                  <li>Scroll en tik op <b className="text-ink">Zet op beginscherm</b>.</li>
                  <li>Tik op <b className="text-ink">Voeg toe</b>.</li>
                </ol>
              </div>
            )}

            {!ios && !canInstallNow && (
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
          Alles wat je hier invult blijft op dit apparaat. Er is geen account en er wordt niets verstuurd.
        </p>
        <button type="button" className="btn-secondary mt-3.5 w-full" onClick={() => void handleExport()}>
          Exporteer alles als JSON
        </button>
        <button
          type="button"
          className="mt-2.5 flex min-h-[44px] w-full items-center justify-center rounded-2xl bg-apricot-soft px-4 py-2.5 text-sm font-extrabold text-ap-deep"
          onClick={() => void handleDelete()}
        >
          Verwijder alle gegevens
        </button>
        {deleted && <p className="sub mt-2">Je gegevens zijn verwijderd. Je begint schoon — helemaal oké.</p>}
      </section>

      {/* Demo/test van de app-gate vanuit de pincode-instelling */}
      {testingGate && hasPin && (
        <PinLockScreen demo expectedHash={pinHash} onUnlocked={() => setTestingGate(false)} onCancel={() => setTestingGate(false)} />
      )}
    </div>
  );
}
