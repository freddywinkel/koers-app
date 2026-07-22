import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import type { SignaleringsplanRow } from '../db/db';
import {
  SIGNALERINGSPLAN_SECTIONS,
  ensureHuidigSignaleringsplan,
  formatRecordDate,
  planVeldContent,
  saveSignaleringsplanVeld,
  startNieuwSignaleringsplan,
  useHuidigSignaleringsplan,
  useSignaleringsplannen,
  type SignaleringsplanFieldDef,
  type SignaleringsplanSectionDef
} from '../lib/signaleringsplan';

/**
 * Signaleringsplan (/steun/signaleringsplan)
 * -----------------------------------------
 * Eén bewerkbare "huidige plan"-editor (pan 1–5 + professionele hulp) met
 * hetzelfde autosave-patroon als de Ehp-component: 700 ms debounce, flush
 * bij blur en bij unmount, en een zachte "✓ Opgeslagen"-melding.
 * Daaronder een records-lijst met eerdere plannen: het nieuwste plan is het
 * huidige plan (niet uitklapbaar — die bewerk je hierboven), oudere plannen
 * zijn uitklapbaar en read-only. Alles blijft lokaal op het apparaat.
 */
export default function Signaleringsplan() {
  const plan = useHuidigSignaleringsplan();
  const plannen = useSignaleringsplannen();

  // Het plan-id wordt één keer bij mount opgehaald (en een leeg plan
  // aangemaakt als er nog geen is), zodat de editor altijd kan opslaan.
  const [planId, setPlanId] = useState<number | null>(null);
  useEffect(() => {
    let cancelled = false;
    void ensureHuidigSignaleringsplan().then((id) => {
      if (!cancelled) setPlanId(id);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const [savedTick, setSavedTick] = useState(0);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (savedTick === 0) return;
    setShowSaved(true);
    const t = setTimeout(() => setShowSaved(false), 2400);
    return () => clearTimeout(t);
  }, [savedTick]);

  const handleSave = useCallback(
    async (key: string, content: string) => {
      if (planId === null) return;
      await saveSignaleringsplanVeld(planId, key, content);
      setSavedTick((t) => t + 1);
    },
    [planId]
  );

  async function handleNieuwPlan() {
    const ok = window.confirm(
      'Je start een nieuw, leeg signaleringsplan. Je huidige plan blijft bewaard bij de eerdere plannen hieronder — er gaat niets verloren.'
    );
    if (!ok) return;
    const id = await startNieuwSignaleringsplan();
    setPlanId(id);
  }

  const ouderePlannen = plannen && plannen.length > 1 ? plannen.slice(1) : [];

  return (
    <div className="screen-stack">
      {/* Header */}
      <header className="min-w-0 px-1 pt-2">
        <Link to="/steun" className="text-[13px] font-bold text-euca-deep">
          ← Terug naar Steun
        </Link>
        <p className="eyebrow mt-2.5">Steun</p>
        <h1 className="mt-1.5 font-display text-[29px] font-semibold leading-[1.16] tracking-[-0.01em]">
          Signaleringsplan
        </h1>
      </header>

      {/* Intro */}
      <p className="sub px-1">
        Vul dit plan in op een rustig moment — dan heb je het bij de hand als het moeilijker wordt. Begin je later een
        nieuw plan, dan blijft het vorige hieronder bewaard. In de lessen heet dit ook het Emotiehanteringsplan (EHP).
        In Koers bedoelen we daarmee dit Signaleringsplan.
      </p>

      {/* Huidig plan — editor */}
      <h2 className="card-title px-1">Huidig signaleringsplan</h2>
      {plan && planId !== null ? (
        <PlanEditor key={plan.id} plan={plan} showSaved={showSaved} onSave={handleSave} />
      ) : (
        <p className="sub px-1" aria-live="polite">
          Je plan wordt geladen …
        </p>
      )}

      {/* Nieuw plan starten */}
      <button type="button" className="btn-secondary w-full" onClick={() => void handleNieuwPlan()}>
        Nieuw signaleringsplan starten
      </button>

      {/* Records: eerdere plannen */}
      <section className="flex flex-col gap-3" aria-label="Eerdere signaleringsplannen">
        <h2 className="card-title px-1">Eerdere signaleringsplannen</h2>
        {plannen === undefined ? null : (
          <>
            {plannen.length > 0 && <HuidigPlanRij plan={plannen[0]} />}
            {ouderePlannen.length === 0 ? (
              <p className="sub px-1">
                Nog geen eerdere plannen — als je een nieuw plan start, blijft het vorige hier bewaard.
              </p>
            ) : (
              ouderePlannen.map((p) => <OudPlanKaart key={p.id} plan={p} />)
            )}
          </>
        )}
      </section>
    </div>
  );
}

/* ------------------------------- Editor ---------------------------------- */

interface PlanEditorProps {
  plan: SignaleringsplanRow;
  showSaved: boolean;
  onSave: (key: string, content: string) => Promise<void>;
}

function PlanEditor({ plan, showSaved, onSave }: PlanEditorProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="px-1 text-[12.5px] font-semibold text-ink-soft" aria-live="polite">
        {showSaved
          ? '✓ Opgeslagen — alles blijft alleen op dit apparaat.'
          : 'Je antwoorden worden automatisch opgeslagen, alleen op dit apparaat.'}
      </p>
      {SIGNALERINGSPLAN_SECTIONS.map((def) => (
        <PlanSectieKaart key={def.key} def={def} fields={plan.fields} onSave={onSave} />
      ))}
    </div>
  );
}

/* ------------------------------ Sectiekaart ------------------------------ */

interface PlanSectieKaartProps {
  def: SignaleringsplanSectionDef;
  fields: Record<string, string> | undefined;
  onSave: (key: string, content: string) => Promise<void>;
}

function PlanSectieKaart({ def, fields, onSave }: PlanSectieKaartProps) {
  // Pan-kaarten krijgen hun pannummer als badge, 'Professionele hulp' een plus.
  const badge = def.key.startsWith('pan') ? def.key.replace('pan', '') : '✚';

  return (
    <section className="card" aria-label={def.title}>
      <div className="flex items-start gap-2.5">
        <span
          className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-lg bg-dune text-xs font-extrabold text-euca-deep"
          aria-hidden="true"
        >
          {badge}
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-[17px] font-semibold tracking-[-0.01em] text-ink">{def.title}</h3>
          {def.intro && <p className="sub mt-1">{def.intro}</p>}
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-4">
        {def.fields.map((field) => (
          <PlanVeldEditor key={field.key} field={field} initial={planVeldContent(field, fields)} onSave={onSave} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Veld-editor ------------------------------ */

interface PlanVeldEditorProps {
  field: SignaleringsplanFieldDef;
  /** Beginwaarde (opgeslagen tekst, of de prefill). Latere live-updates worden genegeerd. */
  initial: string;
  onSave: (key: string, content: string) => Promise<void>;
}

function PlanVeldEditor({ field, initial, onSave }: PlanVeldEditorProps) {
  const [value, setValue] = useState(initial);
  const dirty = useRef(false);
  const latest = useRef(initial);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (dirty.current) {
      dirty.current = false;
      void onSave(field.key, latest.current);
    }
  }, [field.key, onSave]);

  const flushRef = useRef(flush);
  flushRef.current = flush;

  // Ook bij unmount (bv. routewissel of een nieuw plan) nog netjes opslaan.
  useEffect(() => {
    return () => flushRef.current();
  }, []);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const next = e.target.value;
    latest.current = next;
    dirty.current = true;
    setValue(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => flushRef.current(), 700);
  }

  const fieldId = `signaleringsplan-${field.key}`;

  return (
    <div>
      <label htmlFor={fieldId} className="block text-[14.5px] font-bold text-ink">
        {field.prompt}
      </label>
      <textarea
        id={fieldId}
        className="input-soft mt-1.5 min-h-[88px] resize-y leading-body"
        rows={3}
        placeholder={field.placeholder}
        value={value}
        onChange={handleChange}
        onBlur={flush}
      />
    </div>
  );
}

/* ------------------------------ Records-lijst ---------------------------- */

/** Het huidige plan in de records-lijst: niet uitklapbaar, alleen een label. */
function HuidigPlanRij({ plan }: { plan: SignaleringsplanRow }) {
  return (
    <div className="card flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-[14.5px] font-bold text-ink">{formatRecordDate(plan.createdAt)}</p>
        <p className="sub mt-[3px]">Dit plan bewerk je hierboven.</p>
      </div>
      <span className="chip chip-warm flex-none">Huidig plan</span>
    </div>
  );
}

/** Een ouder plan: uitklapbaar, read-only, alleen velden met inhoud. */
function OudPlanKaart({ plan }: { plan: SignaleringsplanRow }) {
  return (
    <details className="card group">
      <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 flex-1">
          <p className="text-[14.5px] font-bold text-ink">{formatRecordDate(plan.createdAt)}</p>
          <p className="sub mt-[3px]">Tik om dit plan te lezen.</p>
        </div>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="flex-none text-ink-soft transition-transform group-open:rotate-180"
        >
          <path d="m4 7 5 5 5-5" />
        </svg>
      </summary>
      <div className="mt-3 flex flex-col gap-4 border-t border-line pt-4">
        {SIGNALERINGSPLAN_SECTIONS.map((section) => (
          <OudPlanSectie key={section.key} section={section} fields={plan.fields} />
        ))}
      </div>
    </details>
  );
}

function OudPlanSectie({
  section,
  fields
}: {
  section: SignaleringsplanSectionDef;
  fields: Record<string, string> | undefined;
}) {
  const ingevuld = section.fields
    .map((field) => ({ field, content: planVeldContent(field, fields).trim() }))
    .filter((item) => item.content.length > 0);

  if (ingevuld.length === 0) return null;

  return (
    <div>
      <h3 className="font-display text-[15px] font-semibold tracking-[-0.01em] text-ink">{section.title}</h3>
      <div className="mt-2 flex flex-col gap-3">
        {ingevuld.map(({ field, content }) => (
          <div key={field.key}>
            <p className="text-[13px] font-bold text-euca-deep">{field.prompt}</p>
            <p className="sub mt-1 whitespace-pre-wrap">{content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
