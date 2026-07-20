import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  GSCHEMA_DEEL1,
  GSCHEMA_DEEL2,
  formatGSchemaDate,
  saveGSchema,
  useGSchemas,
  type GSchemaVeldDef
} from '../lib/gschema';
import type { GSchemaRow } from '../db/db';

/**
 * G-schema (gedachtenschema, CGT-werkblad)
 * ---------------------------------------
 * Deel 1 onderzoekt de situatie (Gebeurtenis, Gedachten, Gevoel, Gedrag,
 * Gevolgen), Deel 2 daagt de gedachte uit (Uitdagen, Nieuwe gedachten,
 * Nieuw gedrag). Bij Gedachten en Gevoel hoort een percentage-slider 0–100.
 * Elke invulling wordt opgeslagen als record; eerdere G-schema's blijven
 * hieronder terug te lezen.
 */

const PERCENTAGE_DEFAULT = 50;

export default function GSchema() {
  const schemas = useGSchemas();

  const [fields, setFields] = useState<Record<string, string>>({});
  const [percentages, setPercentages] = useState<Record<string, number>>({});
  const [showSaved, setShowSaved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [saving, setSaving] = useState(false);

  // Zachte bevestiging 2,4 s na opslaan.
  useEffect(() => {
    if (!showSaved) return;
    const t = setTimeout(() => setShowSaved(false), 2400);
    return () => clearTimeout(t);
  }, [showSaved]);

  // Vriendelijke hint verdwijnt zodra de gebruiker weer gaat typen.
  useEffect(() => {
    if (!showHint) return;
    const t = setTimeout(() => setShowHint(false), 3200);
    return () => clearTimeout(t);
  }, [showHint]);

  const setField = useCallback((key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setShowHint(false);
  }, []);

  const setPercentage = useCallback((key: string, value: number) => {
    setPercentages((prev) => ({ ...prev, [key]: value }));
  }, []);

  async function handleSave() {
    if (saving) return;
    // Volledig leeg formulier: niet opslaan, maar een vriendelijke hint tonen.
    const hasText = Object.values(fields).some((v) => v.trim() !== '');
    if (!hasText) {
      setShowHint(true);
      return;
    }
    setSaving(true);
    try {
      await saveGSchema(fields, percentages);
      setFields({});
      setPercentages({});
      setShowSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="screen-stack">
      {/* Kop */}
      <header className="min-w-0 px-1 pt-2">
        <p className="eyebrow">Steun</p>
        <h1 className="mt-1.5 font-display text-[29px] font-semibold leading-[1.16] tracking-[-0.01em]">
          G-Schema
        </h1>
        <p className="sub mt-2">
          Een G-schema helpt je een moeilijke gedachte rustig onder de loep te nemen, stap voor stap. Je oude
          schema's blijven bewaard, zodat je altijd kunt terugkijken.
        </p>
        <Link to="/steun" className="mt-3 inline-flex min-h-[44px] items-center text-[13.5px] font-semibold text-euca-deep">
          ← Terug naar Steun
        </Link>
      </header>

      {/* Deel 1 */}
      <section className="card" aria-label="Deel 1 · Wat er gebeurde">
        <h2 className="card-title">Deel 1 · Wat er gebeurde</h2>
        <p className="sub mt-1">Onderzoek eerst rustig wat er speelde — er is geen goed of fout.</p>
        <div className="mt-3.5 flex flex-col gap-4">
          {GSCHEMA_DEEL1.map((veld) => (
            <GSchemaField
              key={veld.key}
              veld={veld}
              value={fields[veld.key] ?? ''}
              percentage={percentages[veld.key] ?? PERCENTAGE_DEFAULT}
              onChange={setField}
              onPercentage={setPercentage}
            />
          ))}
        </div>
      </section>

      {/* Deel 2 */}
      <section className="card" aria-label="Deel 2 · De gedachte uitdagen">
        <h2 className="card-title">Deel 2 · De gedachte uitdagen</h2>
        <p className="sub mt-1">Kijk nu met een zachte blik: klopt die gedachte wel helemaal?</p>
        <div className="mt-3.5 flex flex-col gap-4">
          {GSCHEMA_DEEL2.map((veld) => (
            <GSchemaField
              key={veld.key}
              veld={veld}
              value={fields[veld.key] ?? ''}
              percentage={percentages[veld.key] ?? PERCENTAGE_DEFAULT}
              onChange={setField}
              onPercentage={setPercentage}
            />
          ))}
        </div>
      </section>

      {/* Opslaan */}
      <div className="px-1">
        <button type="button" className="btn-primary w-full" onClick={handleSave} disabled={saving}>
          {saving ? 'Even geduld …' : 'G-schema opslaan'}
        </button>
        <p className="mt-2 text-[12.5px] font-semibold text-ink-soft" aria-live="polite">
          {showSaved
            ? "✓ Opgeslagen — je vindt hem hieronder bij je eerdere G-schema's."
            : showHint
              ? 'Schrijf eerst iets in één van de velden — al een paar woorden is genoeg.'
              : 'Je hoeft niet alles in te vullen; jij bepaalt wat genoeg is.'}
        </p>
      </div>

      {/* Eerdere G-schema's */}
      <section aria-label="Eerdere G-schema's" className="flex flex-col gap-2.5">
        <h2 className="px-1 font-display text-[18px] font-semibold tracking-[-0.01em] text-ink">
          Eerdere G-schema's
        </h2>
        {schemas === undefined ? (
          <p className="sub px-1">Even laden …</p>
        ) : schemas.length === 0 ? (
          <div className="card">
            <p className="sub">Nog geen G-schema's — je eerste vind je hier straks terug.</p>
          </div>
        ) : (
          schemas.map((row) => <GSchemaRecord key={row.id ?? row.createdAt} row={row} />)
        )}
      </section>
    </div>
  );
}

/* ------------------------------- Veld-editor ------------------------------ */

interface GSchemaFieldProps {
  veld: GSchemaVeldDef;
  value: string;
  percentage: number;
  onChange: (key: string, value: string) => void;
  onPercentage: (key: string, value: number) => void;
}

function GSchemaField({ veld, value, percentage, onChange, onPercentage }: GSchemaFieldProps) {
  const fieldId = `gschema-${veld.key}`;
  const sliderId = `gschema-${veld.key}-pct`;

  function handleText(e: ChangeEvent<HTMLTextAreaElement>) {
    onChange(veld.key, e.target.value);
  }

  function handleSlider(e: ChangeEvent<HTMLInputElement>) {
    onPercentage(veld.key, Number(e.target.value));
  }

  return (
    <div>
      <h3 className="font-extrabold text-ink">{veld.title}</h3>
      <label htmlFor={fieldId} className="mt-1 block text-[13px] text-ink-soft">
        {veld.prompt}
      </label>
      <textarea
        id={fieldId}
        className="input-soft mt-1.5 min-h-[88px] resize-y leading-body"
        rows={3}
        placeholder={veld.placeholder}
        value={value}
        onChange={handleText}
      />
      {veld.percentageLabel && (
        <div className="mt-2.5">
          <label htmlFor={sliderId} className="block text-[12.5px] font-semibold text-ink-soft">
            {veld.percentageLabel}
          </label>
          <div className="mt-1 flex items-center gap-3">
            <input
              id={sliderId}
              type="range"
              min={0}
              max={100}
              step={5}
              value={percentage}
              onChange={handleSlider}
              className="min-w-0 flex-1 accent-euca"
            />
            <span className="w-12 flex-none text-right text-[13.5px] font-extrabold text-euca-deep">
              {percentage}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Record (read) ----------------------------- */

function percentageZin(veld: GSchemaVeldDef, pct: number): string {
  return veld.key === 'gedachten' ? `geloofde ik ${pct}%` : `voelde ik ${pct}% sterk`;
}

function GSchemaRecord({ row }: { row: GSchemaRow }) {
  const gebeurtenis = (row.fields['gebeurtenis'] ?? '').trim();
  const samenvatting = gebeurtenis
    ? gebeurtenis.length > 60
      ? `${gebeurtenis.slice(0, 60).trimEnd()}…`
      : gebeurtenis
    : 'G-schema';

  const alleVelden = [...GSCHEMA_DEEL1, ...GSCHEMA_DEEL2];
  const ingevuld = alleVelden.filter((veld) => (row.fields[veld.key] ?? '').trim() !== '');

  return (
    <details className="card group">
      <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-bold uppercase tracking-wide text-ink-soft">
            {formatGSchemaDate(row.createdAt)}
          </p>
          <p className="mt-0.5 truncate text-[14.5px] font-bold text-ink">{samenvatting}</p>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="flex-none text-ink-soft transition-transform group-open:rotate-180"
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
      </summary>
      <div className="mt-3 flex flex-col gap-3 border-t border-line pt-3">
        {ingevuld.length === 0 ? (
          <p className="sub">Dit schema is zonder tekst opgeslagen.</p>
        ) : (
          ingevuld.map((veld) => {
            const pct = veld.percentageLabel ? row.percentages[veld.key] : undefined;
            return (
              <div key={veld.key}>
                <p className="text-[13px] font-extrabold text-ink">{veld.title}</p>
                <p className="mt-0.5 whitespace-pre-wrap text-[13.5px] leading-body text-ink">
                  {row.fields[veld.key]}
                </p>
                {pct !== undefined && (
                  <p className="mt-0.5 text-[12px] font-semibold text-ink-soft">— {percentageZin(veld, pct)}</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </details>
  );
}
