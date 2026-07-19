import { useEffect, useState } from 'react';
import * as crisisRaw from '../content/crisis';
import Ehp from '../components/Ehp';
import { EHP_SECTIONS, useEhpFilledCount } from '../lib/ehp';

/**
 * Steun nu (/crisis) — kalm, compleet crisis-oppervlak.
 * Volgorde: eerst gronden (5-4-3-2-1), dan mensen bereiken (113 in warm
 * abrikoos — nooit rood), dan je eigen Emotiehanteringsplan.
 * Copy komt uit content/crisis.ts, maar elke import heeft een ingebouwde
 * fallback zodat dit scherm altijd blijft werken.
 */

/* ------------------------- Defensieve contentlaag ------------------------- */

interface CrisisActionView {
  label: string;
  href: string;
  kind: 'tel' | 'link';
}

interface CrisisContactView {
  id: string;
  title: string;
  text: string;
  actions: CrisisActionView[];
}

interface GroundingStep {
  count: number;
  label: string;
  hint: string;
}

const FALLBACK_TITLE = 'Je hoeft dit niet alleen te dragen';
const FALLBACK_INTRO =
  'Soms wordt het te veel. Dat is menselijk. Hier vind je rust en mensen die er nu voor je zijn.';

const FALLBACK_CONTACTS: CrisisContactView[] = [
  {
    id: '113',
    title: '113 Zelfmoordpreventie',
    text: 'Dag en nacht bereikbaar, gratis en anoniem. Ook als je je zorgen maakt om iemand anders.',
    actions: [
      { label: 'Bel 113', href: 'tel:113', kind: 'tel' },
      { label: 'Bel 0800-0113', href: 'tel:08000113', kind: 'tel' },
      { label: 'Chat op 113.nl', href: 'https://www.113.nl', kind: 'link' }
    ]
  },
  {
    id: 'huisarts',
    title: 'Huisarts of huisartsenpost',
    text: 'Voor zorgen die niet kunnen wachten. Bel overdag je eigen huisarts; ’s avonds en in het weekend de huisartsenpost in je regio.',
    actions: []
  },
  {
    id: '112',
    title: 'Bij direct gevaar',
    text: 'Ben jij of is iemand anders in direct levensgevaar? Bel dan 112.',
    actions: [{ label: 'Bel 112', href: 'tel:112', kind: 'tel' }]
  }
];

const FALLBACK_GROUNDING: GroundingStep[] = [
  { count: 5, label: 'dingen die je kunt zien', hint: 'Kijk langzaam om je heen. Benoem ze één voor één in je hoofd.' },
  { count: 4, label: 'dingen die je kunt voelen', hint: 'Je voeten op de grond, de stof van je kleding, de temperatuur van de lucht.' },
  { count: 3, label: 'dingen die je kunt horen', hint: 'Dichtbij of ver weg. Je hoeft ze niet mooi te vinden.' },
  { count: 2, label: 'dingen die je kunt ruiken', hint: 'Adem rustig in door je neus. Subtiel is ook goed.' },
  { count: 1, label: 'ding dat je kunt proeven', hint: 'Neem een slokje water, of merk de smaak in je mond op.' }
];

const cm = crisisRaw as unknown as {
  header?: { title?: unknown; text?: unknown };
  intro?: { title?: unknown; text?: unknown };
  crisisContent?: { header?: { title?: unknown; text?: unknown }; contacts?: unknown; sections?: unknown; grounding?: unknown };
  contacts?: unknown;
  crisisContacts?: unknown;
  sections?: unknown;
  grounding?: unknown;
  grounding54321?: unknown;
};

function asText(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
}

function asContacts(value: unknown): CrisisContactView[] | null {
  if (!Array.isArray(value)) return null;
  const out: CrisisContactView[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const o = item as Record<string, unknown>;
    const rawActions = Array.isArray(o.actions) ? o.actions : [];
    const actions: CrisisActionView[] = rawActions
      .filter((a): a is Record<string, unknown> => !!a && typeof a === 'object')
      .map((a) => ({
        label: asText(a.label, 'Bellen'),
        href: asText(a.href, '#'),
        kind: a.kind === 'link' ? 'link' : 'tel'
      }));
    const title = asText(o.title, '');
    if (!title) continue;
    out.push({ id: asText(o.id, title), title, text: asText(o.text, ''), actions });
  }
  return out.length > 0 ? out : null;
}

function asGrounding(value: unknown): GroundingStep[] | null {
  if (!Array.isArray(value)) return null;
  const out: GroundingStep[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const o = item as Record<string, unknown>;
    const count = typeof o.count === 'number' && o.count > 0 ? Math.round(o.count) : NaN;
    const label = asText(o.label ?? o.sense ?? o.text, '');
    if (!Number.isFinite(count) || !label) continue;
    out.push({ count, label, hint: asText(o.hint ?? o.description, '') });
  }
  return out.length > 0 ? out : null;
}

const headerSource = cm.header ?? cm.intro ?? cm.crisisContent?.header;
const TITLE = asText(headerSource?.title, FALLBACK_TITLE);
const INTRO = asText(headerSource?.text, FALLBACK_INTRO);
const CONTACTS: CrisisContactView[] =
  asContacts(cm.crisisContacts) ??
  asContacts(cm.contacts) ??
  asContacts(cm.sections) ??
  asContacts(cm.crisisContent?.contacts) ??
  asContacts(cm.crisisContent?.sections) ??
  FALLBACK_CONTACTS;
const GROUNDING: GroundingStep[] =
  asGrounding(cm.grounding54321) ?? asGrounding(cm.grounding) ?? asGrounding(cm.crisisContent?.grounding) ?? FALLBACK_GROUNDING;

/** 113-blok herkennen: titel of een van de nummers bevat 113. */
function is113(contact: CrisisContactView): boolean {
  if (/113/.test(contact.title)) return true;
  return contact.actions.some((a) => a.href.replace(/\D/g, '').includes('113'));
}

/* --------------------------------- Scherm --------------------------------- */

export default function Crisis() {
  return (
    <div className="screen-stack">
      <header className="px-1 pt-2">
        <p className="eyebrow !text-ap-deep">Steun nu</p>
        <h1 className="mt-1.5 font-display text-[29px] font-semibold leading-[1.16] tracking-[-0.01em]">{TITLE}</h1>
        <p className="sub mt-1.5">{INTRO}</p>
      </header>

      {/* Gronding: interactieve 5-4-3-2-1 */}
      <section className="card !bg-dune" aria-label="Kom eerst even tot rust">
        <h2 className="card-title">Kom eerst even tot rust</h2>
        <p className="sub mt-1.5">
          Zet je voeten plat op de grond. Adem in door je neus … en langzaam weer uit. Daarna nemen we je mee, stap
          voor stap.
        </p>
        <GroundingStepper steps={GROUNDING} />
      </section>

      {/* Hulplijnen — 113 in kalm abrikoos */}
      {CONTACTS.map((contact) => (
        <ContactCard key={contact.id} contact={contact} warm={is113(contact)} />
      ))}

      {/* Emotiehanteringsplan */}
      <EhpSection />

      <p className="px-1 pb-2 text-center text-[13px] font-semibold text-ink-soft">Je bent niet alleen. 🤍</p>
    </div>
  );
}

/* ------------------------------ Grondingstapper ---------------------------- */

function GroundingStepper({ steps }: { steps: GroundingStep[] }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [remaining, setRemaining] = useState(steps[0].count);
  const [finished, setFinished] = useState(false);

  const step = steps[Math.min(stepIdx, steps.length - 1)];
  const isLast = stepIdx >= steps.length - 1;

  function restart() {
    setStepIdx(0);
    setRemaining(steps[0].count);
    setFinished(false);
  }

  function goNext() {
    if (isLast) {
      setFinished(true);
    } else {
      setStepIdx(stepIdx + 1);
      setRemaining(steps[stepIdx + 1].count);
    }
  }

  if (finished) {
    return (
      <div className="mt-4 rounded-2xl bg-sand p-4 text-center">
        <p className="font-display text-[19px] font-semibold text-ink">Goed gedaan. 🤍</p>
        <p className="sub mt-1.5">
          Je aandacht is even terug bij het hier en nu. Dit gevoel is hevig — en het gaat weer voorbij.
        </p>
        <button type="button" className="btn-secondary mx-auto mt-3.5 w-full" onClick={restart}>
          Opnieuw beginnen
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-2xl bg-sand p-4" aria-live="polite">
      {/* Voortgang */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5" aria-hidden="true">
          {steps.map((_, i) => (
            <span
              key={i}
              className={[
                'h-2 w-5 rounded-full transition-colors',
                i < stepIdx ? 'bg-euca' : i === stepIdx ? 'bg-euca-deep' : 'bg-dune'
              ].join(' ')}
            />
          ))}
        </div>
        <span className="ml-auto text-[12px] font-bold text-ink-soft">
          Stap {stepIdx + 1} van {steps.length}
        </span>
      </div>

      {/* Huidige stap */}
      <p className="mt-4 text-center font-display text-[44px] font-semibold leading-none text-euca-deep">
        {remaining}
      </p>
      <p className="mt-1.5 text-center text-[15.5px] font-bold text-ink">
        {step.label}
      </p>
      {step.hint && <p className="sub mt-1 text-center">{step.hint}</p>}

      {/* Acties — tikken telt af, overslaan mag altijd */}
      {remaining > 0 ? (
        <button
          type="button"
          className="btn-primary mt-4"
          onClick={() => setRemaining((r) => Math.max(0, r - 1))}
        >
          Ik heb er {remaining === step.count ? 'een' : 'nog een'} benoemd
        </button>
      ) : (
        <button type="button" className="btn-primary mt-4" onClick={goNext}>
          {isLast ? 'Afronden' : 'Volgende stap'}
        </button>
      )}
      <button
        type="button"
        className="mx-auto mt-1 flex min-h-[44px] items-center justify-center px-4 text-[13px] font-bold text-ink-soft underline decoration-line underline-offset-4"
        onClick={goNext}
      >
        Sla deze stap over
      </button>
    </div>
  );
}

/* ------------------------------- Contactkaart ------------------------------ */

function ContactCard({ contact, warm }: { contact: CrisisContactView; warm: boolean }) {
  return (
    <section
      className={['card', warm ? '!border-ap-border !bg-apricot-soft' : ''].join(' ')}
      aria-label={contact.title}
    >
      <h2 className={['card-title', warm ? '!text-ap-deep' : ''].join(' ')}>{contact.title}</h2>
      {contact.text && <p className="sub mt-1.5">{contact.text}</p>}
      {contact.actions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {contact.actions.map((action) =>
            action.kind === 'tel' ? (
              warm ? (
                <a
                  key={action.href + action.label}
                  href={action.href}
                  /* Abrikoos knop met vaste donkere inkt-tekst: AA in licht én donker,
                     warm maar nooit rood, nooit alarmistisch. */
                  className="flex min-h-[50px] items-center justify-center gap-2 rounded-2xl bg-apricot px-5 text-[15px] font-extrabold text-apricot-ink transition-transform active:scale-[0.99]"
                >
                  {action.label}
                </a>
              ) : (
                <a
                  key={action.href + action.label}
                  href={action.href}
                  className="btn-primary !min-h-[50px] !w-auto px-5 text-sm"
                >
                  {action.label}
                </a>
              )
            ) : (
              <a
                key={action.href + action.label}
                href={action.href}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                {action.label}
              </a>
            )
          )}
        </div>
      )}
    </section>
  );
}

/* --------------------------- Emotiehanteringsplan --------------------------- */

function EhpSection() {
  const filled = useEhpFilledCount();
  // null = nog niet besloten: open zodra er al inhoud is, anders ingeklapt beginnen.
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    if (open === null && filled !== undefined) setOpen(filled > 0);
  }, [open, filled]);

  const isOpen = open ?? false;

  return (
    <>
      <section className="card border-ap-border" aria-label="Emotiehanteringsplan">
        <button
          type="button"
          className="flex min-h-[44px] w-full items-center gap-3 text-left"
          aria-expanded={isOpen}
          aria-controls="ehp-editor"
          onClick={() => setOpen(!isOpen)}
        >
          <span className="min-w-0 flex-1">
            <span className="eyebrow block !text-ap-deep">Jouw plan</span>
            <span className="card-title mt-1 block">Emotiehanteringsplan</span>
          </span>
          {filled !== undefined && (
            <span className="chip chip-warm flex-none">
              {filled} van {EHP_SECTIONS.length}
            </span>
          )}
          <svg
            className={['ml-auto flex-none text-ap-deep transition-transform', isOpen ? 'rotate-90' : ''].join(' ')}
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6.5 3.5 11 9l-4.5 5.5" />
          </svg>
        </button>
        {!isOpen && (
          <p className="sub mt-1.5">
            Per pan schrijf je op: hoe herken ik dit, wat helpt mij, en wat kunnen anderen doen — op rustige
            momenten ingevuld, in hevige momenten meteen bij de hand.
          </p>
        )}
      </section>

      {isOpen && (
        <div id="ehp-editor" className="flex flex-col gap-3.5">
          <p className="sub px-1">
            Vul dit plan in op een rustig moment. Er is geen goed of fout — alles wat voor jou werkt, telt.
          </p>
          <Ehp />
        </div>
      )}
    </>
  );
}
