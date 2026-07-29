import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router';
import PanSelector from '../components/PanSelector';
import type { PanValue } from '../content/types';
import { saveCheckin, useDoneLessonIds, useTodayCheckin } from '../db/hooks';
import { getLocale } from '../i18n';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

function timeLabel(date: Date): string {
  return new Intl.DateTimeFormat(getLocale(), {
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Eén doelbewust klein scherm voor een check-in vanaf de geïnstalleerde PWA.
 * Dezelfde saveCheckin-helper en IndexedDB-tabel als Vandaag worden gebruikt,
 * zodat er geen tweede gegevensstroom of schijn-synchronisatie ontstaat.
 */
export default function QuickCheckin() {
  const checkin = useTodayCheckin();
  const doneLessonIds = useDoneLessonIds();
  const [pan, setPan] = useState<PanValue | null>(null);
  const [note, setNote] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    if (hydrated || checkin === undefined) return;
    setPan(checkin?.pan ?? null);
    setNote(checkin?.note ?? '');
    setHydrated(true);
  }, [checkin, hydrated]);

  if (doneLessonIds === undefined || checkin === undefined || !hydrated) {
    return (
      <div className="screen-stack">
        <section className="card" role="status" aria-live="polite">
          <p className="sub">Snelle check-in wordt klaargelegd…</p>
        </section>
      </div>
    );
  }

  // Houd dezelfde ontgrendeling aan als de check-in op Vandaag.
  if (!doneLessonIds.has('w01-l03')) return <Navigate to="/" replace />;

  async function handleSave() {
    if (!pan || status === 'saving') return;
    setStatus('saving');
    try {
      await saveCheckin({ pan, note });
      setSavedAt(new Date());
      setStatus('saved');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="screen-stack">
      <header className="px-1 pt-2">
        <p className="eyebrow">Vandaag</p>
        <div className="mt-1.5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-[29px] font-semibold leading-[1.16] tracking-[-0.01em]">Snelle check-in</h1>
            <p className="sub mt-1.5">Kies je pan en schrijf eventueel één zin. Dit wordt direct bij Vandaag opgeslagen.</p>
          </div>
          <Link
            to="/"
            className="inline-flex min-h-12 flex-none items-center rounded-2xl border border-line bg-raised px-3.5 text-sm font-extrabold text-ink shadow-soft"
          >
            Sluiten
          </Link>
        </div>
      </header>

      <section className="card" aria-label="Snelle check-in">
        <h2 className="card-title">Welke pan ben je nu?</h2>
        <p className="sub mt-1">Tik op de pan die bij dit moment past.</p>
        <PanSelector
          value={pan}
          disabled={status === 'saving'}
          onChange={(nextPan) => {
            setPan(nextPan);
            if (status !== 'idle') setStatus('idle');
          }}
        />

        <label className="mt-4 block">
          <span className="sub">Wil je er iets bij opschrijven? (niet verplicht)</span>
          <textarea
            className="input-soft mt-1.5 min-h-[88px] resize-y"
            rows={3}
            maxLength={500}
            value={note}
            disabled={status === 'saving'}
            placeholder="Eén zin is genoeg."
            onChange={(event) => {
              setNote(event.target.value);
              if (status !== 'idle') setStatus('idle');
            }}
          />
        </label>

        <button
          type="button"
          className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-45"
          disabled={!pan || status === 'saving'}
          aria-busy={status === 'saving'}
          onClick={() => void handleSave()}
        >
          {status === 'saving' ? 'Bezig met opslaan…' : 'Opslaan in Koers'}
        </button>

        {status === 'saved' && savedAt && (
          <div className="mt-3 rounded-2xl border border-euca/25 bg-eucatint px-4 py-3" role="status" aria-live="polite">
            <p className="text-sm font-extrabold text-euca-deep">Opgeslagen in Koers</p>
            <p className="sub mt-1">
              Je pan en notitie staan nu ook bij Vandaag · {timeLabel(savedAt)}.
            </p>
          </div>
        )}

        {status === 'error' && (
          <p className="mt-3 rounded-2xl bg-apricot-soft px-4 py-3 text-sm font-semibold text-ap-deep" role="alert">
            Opslaan lukte niet. Je invoer blijft staan; probeer het nog een keer.
          </p>
        )}

        {checkin && status === 'idle' && hydrated && (
          <p className="sub mt-3">Je check-in van vandaag staat al klaar. Opslaan werkt diezelfde check-in bij.</p>
        )}
      </section>
    </div>
  );
}
