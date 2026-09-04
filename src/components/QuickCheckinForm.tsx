import { useState } from 'react';
import PanSelector from './PanSelector';
import type { PanValue } from '../content/types';
import type { CheckinRow } from '../db/db';
import { saveCheckin } from '../db/hooks';

type SaveStatus = 'idle' | 'saving' | 'error';

interface QuickCheckinFormProps {
  checkin: CheckinRow | null;
  onSaved: () => void;
  titleId?: string;
}

/** Gedeeld formulier voor de dagelijkse popup en de handmatige check-in. */
export default function QuickCheckinForm({ checkin, onSaved, titleId }: QuickCheckinFormProps) {
  const [pan, setPan] = useState<PanValue | null>(checkin?.pan ?? null);
  const [note, setNote] = useState(checkin?.note ?? '');
  const [status, setStatus] = useState<SaveStatus>('idle');

  async function handleSave() {
    if (!pan || status === 'saving') return;
    setStatus('saving');
    try {
      await saveCheckin({ pan, note });
      onSaved();
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      <h2 id={titleId} className="card-title">Welke pan ben je nu?</h2>
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

      {status === 'error' && (
        <p className="mt-3 rounded-2xl bg-apricot-soft px-4 py-3 text-sm font-semibold text-ap-deep" role="alert">
          Opslaan lukte niet. Je invoer blijft staan; probeer het nog een keer.
        </p>
      )}

      {checkin && status === 'idle' && (
        <p className="sub mt-3">Je check-in van vandaag staat al klaar. Opslaan werkt diezelfde check-in bij.</p>
      )}
    </>
  );
}
