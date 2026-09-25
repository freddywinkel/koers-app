import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router';
import type { SignaleringsplanRow } from '../db/db';
import { createQueuedAutosave, type AutosaveStatus } from '../lib/queuedAutosave';
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

  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [creating, setCreating] = useState(false);
  const creatingRef = useRef(false);
  const [createError, setCreateError] = useState(false);
  const pendingFields = useRef(new Map<string, () => Promise<void>>());
  const registerFlush = useCallback((key: string, flush: (() => Promise<void>) | null) => {
    if (flush) pendingFields.current.set(key, flush);
    else pendingFields.current.delete(key);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoadError(false);
    void ensureHuidigSignaleringsplan().catch(() => {
      if (!cancelled) setLoadError(true);
    });
    return () => {
      cancelled = true;
    };
  }, [loadAttempt]);

  const [savedTick, setSavedTick] = useState(0);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (savedTick === 0) return;
    setShowSaved(true);
    const t = setTimeout(() => setShowSaved(false), 2400);
    return () => clearTimeout(t);
  }, [savedTick]);

  const handleSave = useCallback(
    async (id: number, key: string, content: string) => {
      await saveSignaleringsplanVeld(id, key, content);
      setSavedTick((t) => t + 1);
    },
    []
  );

  async function handleNieuwPlan() {
    if (creatingRef.current || !plan) return;
    const ok = window.confirm(
      'Je start een nieuw, leeg signaleringsplan. Je huidige plan blijft bewaard bij de eerdere plannen hieronder — er gaat niets verloren.'
    );
    if (!ok) return;
    creatingRef.current = true;
    setCreating(true);
    setCreateError(false);
    try {
      // A new editor is opened only after every change to the old plan is saved.
      await Promise.all([...pendingFields.current.values()].map((flush) => flush()));
      await startNieuwSignaleringsplan();
    } catch {
      setCreateError(true);
    } finally {
      creatingRef.current = false;
      setCreating(false);
    }
  }

  const ouderePlannen = plannen && plannen.length > 1 ? plannen.slice(1) : [];

  return (
    <div className="screen-stack">
      {/* Header */}
      <header className="min-w-0 px-1 pt-2">
        <Link to="/steun" className="inline-flex min-h-[44px] items-center text-[13px] font-bold text-euca-deep">
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
      {plan && plan.id !== undefined ? (
        <fieldset disabled={creating} className="min-w-0">
          <PlanEditor key={plan.id} plan={plan} showSaved={showSaved} onSave={handleSave} registerFlush={registerFlush} />
        </fieldset>
      ) : loadError ? (
        <div className="card">
          <p className="sub" role="alert">Je plan kon niet worden geopend. Probeer het opnieuw.</p>
          <button type="button" className="btn-secondary mt-3" onClick={() => setLoadAttempt((attempt) => attempt + 1)}>Probeer opnieuw</button>
        </div>
      ) : (
        <p className="sub px-1" aria-live="polite">
          Je plan wordt geladen …
        </p>
      )}

      {/* Nieuw plan starten */}
      <button type="button" className="btn-secondary w-full" disabled={creating || !plan} onClick={() => void handleNieuwPlan()}>
        Nieuw signaleringsplan starten
      </button>
      {createError && <p className="sub" role="alert">Een nieuw plan starten lukte niet. Je huidige plan blijft staan.</p>}

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
  onSave: (id: number, key: string, content: string) => Promise<void>;
  registerFlush: (key: string, flush: (() => Promise<void>) | null) => void;
}

function PlanEditor({ plan, showSaved, onSave, registerFlush }: PlanEditorProps) {
  // Bind writes to this editor's plan, including its final unmount flush.
  const saveField = useCallback((key: string, content: string) => onSave(plan.id!, key, content), [onSave, plan.id]);
  return (
    <div className="flex flex-col gap-3">
      <p className="px-1 text-[12.5px] font-semibold text-ink-soft" aria-live="polite">
        {showSaved
          ? '✓ Opgeslagen — alles blijft alleen op dit apparaat.'
          : 'Je antwoorden worden automatisch opgeslagen, alleen op dit apparaat.'}
      </p>
      {SIGNALERINGSPLAN_SECTIONS.map((def) => (
        <PlanSectieKaart key={def.key} def={def} fields={plan.fields} onSave={saveField} registerFlush={registerFlush} />
      ))}
    </div>
  );
}

/* ------------------------------ Sectiekaart ------------------------------ */

interface PlanSectieKaartProps {
  def: SignaleringsplanSectionDef;
  fields: Record<string, string> | undefined;
  onSave: (key: string, content: string) => Promise<void>;
  registerFlush: PlanEditorProps['registerFlush'];
}

function PlanSectieKaart({ def, fields, onSave, registerFlush }: PlanSectieKaartProps) {
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
          <PlanVeldEditor key={field.key} field={field} initial={planVeldContent(field, fields)} onSave={onSave} registerFlush={registerFlush} />
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
  registerFlush: PlanEditorProps['registerFlush'];
}

function PlanVeldEditor({ field, initial, onSave, registerFlush }: PlanVeldEditorProps) {
  const [value, setValue] = useState(initial);
  const [status, setStatus] = useState<AutosaveStatus>('idle');
  const mounted = useRef(true);
  const [autosave] = useState(() => createQueuedAutosave(
    (content: string) => onSave(field.key, content),
    (nextStatus) => { if (mounted.current) setStatus(nextStatus); }
  ));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    return autosave.flush();
  }, [autosave]);

  // Ook bij unmount (bv. routewissel of een nieuw plan) nog netjes opslaan.
  useEffect(() => {
    mounted.current = true;
    registerFlush(field.key, flush);
    const safelyFlush = () => { void flush().catch(() => undefined); };
    const onVisibility = () => { if (document.visibilityState === 'hidden') safelyFlush(); };
    window.addEventListener('pagehide', safelyFlush);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      mounted.current = false;
      registerFlush(field.key, null);
      window.removeEventListener('pagehide', safelyFlush);
      document.removeEventListener('visibilitychange', onVisibility);
      safelyFlush();
    };
  }, [field.key, flush, registerFlush]);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const next = e.target.value;
    autosave.change(next);
    setValue(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { void flush().catch(() => undefined); }, 700);
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
        onBlur={() => { void flush().catch(() => undefined); }}
      />
      {status === 'error' && (
        <div className="mt-2">
          <p className="sub" role="alert">Je tekst is nog niet opgeslagen. Probeer opnieuw voordat je deze pagina verlaat.</p>
          <button type="button" className="btn-secondary mt-2" onClick={() => { void flush().catch(() => undefined); }}>Probeer opnieuw</button>
        </div>
      )}
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
            <p className="sub mt-1 whitespace-pre-wrap" data-no-translate>{content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
