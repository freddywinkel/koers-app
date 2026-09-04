import { useRef, useState } from 'react';
import PanSelector from './PanSelector';
import type { PanValue } from '../content/types';
import type { CheckinRow } from '../db/db';
import { saveCheckin } from '../db/hooks';
import { formatCheckinTime } from '../lib/checkins';
import { getLocale } from '../i18n';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface QuickCheckinFormProps {
  onSaved?: (checkin: CheckinRow) => void;
  titleId?: string;
}

/** Gedeeld formulier dat bij iedere opslag een nieuw check-inmoment maakt. */
export default function QuickCheckinForm({ onSaved, titleId }: QuickCheckinFormProps) {
  const [pan, setPan] = useState<PanValue | null>(null);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const savingRef = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  async function handleSave() {
    if (!pan || savingRef.current) return;
    savingRef.current = true;
    setStatus('saving');
    let saved: CheckinRow;
    try {
      saved = await saveCheckin({ pan, note });
    } catch {
      savingRef.current = false;
      setStatus('error');
      return;
    }
    savingRef.current = false;
    setPan(null);
    setNote('');
    setSavedAt(saved.ts);
    setStatus('saved');
    onSaved?.(saved);
    if (!onSaved && typeof window !== 'undefined') {
      window.requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void handleSave();
      }}
    >
      <h2 ref={headingRef} id={titleId} tabIndex={-1} className="card-title">Welke pan ben je nu?</h2>
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
        type="submit"
        className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-45"
        disabled={!pan || status === 'saving'}
        aria-busy={status === 'saving'}
      >
        {status === 'saving' ? 'Bezig met opslaan…' : 'Opslaan in Koers'}
      </button>

      {status === 'error' && (
        <p className="mt-3 rounded-2xl bg-apricot-soft px-4 py-3 text-sm font-semibold text-ap-deep" role="alert">
          Opslaan lukte niet. Je invoer blijft staan; probeer het nog een keer.
        </p>
      )}

      {status === 'saved' && savedAt !== null && (
        <p
          className="mt-3 rounded-2xl border border-euca/25 bg-eucatint px-4 py-3 text-sm font-semibold text-euca-deep"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span>Opgeslagen om</span>{' '}
          <time dateTime={new Date(savedAt).toISOString()}>{formatCheckinTime(savedAt, getLocale())}</time>.{' '}
          <span>Je kunt vandaag nog een check-in doen.</span>
        </p>
      )}
    </form>
  );
}
