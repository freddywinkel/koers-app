import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import {
  EHP_SECTIONS,
  ehpFieldContent,
  saveEhpSection,
  useEhpSections,
  type EhpFieldDef,
  type EhpSectionDef
} from '../lib/ehp';

/**
 * Emotiehanteringsplan — editor opgebouwd per pan (1 t/m 5), zoals de
 * lessen w11-l02 en w12-l03 dat leren. Per pan een kaart met drie vragen:
 * hoe herken ik dit? wat helpt mij? wat kunnen anderen doen?
 * Daarnaast één vaste kaart 'Professionele hulp'.
 * Autosave: 700 ms na de laatste toetsaanslag én direct bij verlaten (blur)
 * of unmount. Zichtbaar als zachte "✓ Opgeslagen"-melding, nooit als alarm.
 */
export default function Ehp() {
  const sections = useEhpSections();
  const ready = sections !== undefined;

  const [savedTick, setSavedTick] = useState(0);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (savedTick === 0) return;
    setShowSaved(true);
    const t = setTimeout(() => setShowSaved(false), 2400);
    return () => clearTimeout(t);
  }, [savedTick]);

  const handleSave = useCallback(async (key: string, content: string) => {
    await saveEhpSection(key, content);
    setSavedTick((t) => t + 1);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <p className="px-1 text-[12.5px] font-semibold text-ink-soft" aria-live="polite">
        {showSaved
          ? '✓ Opgeslagen — alles blijft alleen op dit apparaat.'
          : 'Je antwoorden worden automatisch opgeslagen, alleen op dit apparaat.'}
      </p>
      {EHP_SECTIONS.map((def) => (
        <EhpSectionCard key={def.key} def={def} ready={ready} sections={sections} onSave={handleSave} />
      ))}
    </div>
  );
}

/* ------------------------------- Sectiekaart ------------------------------ */

interface EhpSectionCardProps {
  def: EhpSectionDef;
  /** true zodra de live query geladen is; daarna initialiseren de velden éénmalig. */
  ready: boolean;
  /** Live map met opgeslagen inhoud (undefined = nog laden). */
  sections: Record<string, string> | undefined;
  onSave: (key: string, content: string) => Promise<void>;
}

function EhpSectionCard({ def, ready, sections, onSave }: EhpSectionCardProps) {
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
          <EhpFieldEditor
            key={field.key}
            field={field}
            ready={ready}
            initial={sections ? ehpFieldContent(field, sections) : ''}
            onSave={onSave}
          />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------- Veld-editor ------------------------------ */

interface EhpFieldEditorProps {
  field: EhpFieldDef;
  /** true zodra de live query geladen is; daarna initialiseert het veld éénmalig. */
  ready: boolean;
  /** Beginwaarde (opgeslagen tekst, of de prefill). Latere live-updates worden genegeerd. */
  initial: string;
  onSave: (key: string, content: string) => Promise<void>;
}

function EhpFieldEditor({ field, ready, initial, onSave }: EhpFieldEditorProps) {
  const [value, setValue] = useState('');
  const inited = useRef(false);
  const dirty = useRef(false);
  const latest = useRef('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Eénmalig initialiseren zodra de data er is; daarna nooit meer overschrijven
  // (anders zou onze eigen autosave het getypte veld kunnen overschrijven).
  useEffect(() => {
    if (ready && !inited.current) {
      inited.current = true;
      latest.current = initial;
      setValue(initial);
    }
  }, [ready, initial]);

  const flush = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (inited.current && dirty.current) {
      dirty.current = false;
      void onSave(field.key, latest.current);
    }
  }, [field.key, onSave]);

  const flushRef = useRef(flush);
  flushRef.current = flush;

  // Ook bij unmount (bv. routewissel) nog netjes opslaan.
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

  const fieldId = `ehp-${field.key}`;

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
