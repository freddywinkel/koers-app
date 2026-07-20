import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as crisisRaw from '../content/crisis';
import {
  countFilledPlanSections,
  SIGNALERINGSPLAN_SECTIONS,
  useHuidigSignaleringsplan
} from '../lib/signaleringsplan';

/**
 * Steun (/steun) — kalm, compleet oppervlak voor moeilijke momenten.
 * Volgorde: eerst gronden (5-4-3-2-1), daarna een kleine aanvullende
 * methode kiezen en tenslotte doorverwijzen naar het eigen gereedschap
 * (Signaleringsplan en G-Schema) op eigen pagina's.
 */

/* ------------------------- Defensieve contentlaag ------------------------- */

interface CalmingMethod {
  id: string;
  title: string;
  text: string;
  steps: string[];
}

interface GroundingStep {
  count: number;
  label: string;
  hint: string;
}

const FALLBACK_TITLE = 'Je hoeft dit niet alleen te dragen';
const FALLBACK_INTRO =
  'Soms wordt het te veel. Dat is menselijk. Hier vind je rust en concrete stappen voor dit moment.';

const CALMING_METHODS: CalmingMethod[] = [
  {
    id: 'adem',
    title: 'Adem langer uit',
    text: 'Een rustige, langere uitademing kan je lichaam helpen vertragen.',
    steps: ['Adem zacht in en tel tot 4.', 'Adem langzaam uit en tel tot 6.', 'Herhaal dit 6 keer — rustig aan, het hoeft niet perfect.']
  },
  {
    id: 'koel',
    title: 'Gebruik iets koels',
    text: 'Een koele prikkel kan je aandacht terugbrengen naar je lichaam.',
    steps: [
      'Maak een washandje nat met koud water, of pak een koud flesje.',
      'Houd het 15 tot 30 seconden tegen je wangen.',
      'Leg ijs nooit rechtstreeks op je huid en stop als het onprettig voelt.'
    ]
  },
  {
    id: 'ontladen',
    title: 'Ontlaad de spanning',
    text: 'Geef de energie in je lijf een kleine, veilige uitweg.',
    steps: [
      'Druk je voeten 10 seconden stevig op de vloer.',
      'Laat los en merk het verschil op.',
      'Herhaal dit 3 keer, of loop rustig een minuut als dat goed voelt.'
    ]
  },
  {
    id: 'klein',
    title: 'Houd de volgende minuut klein',
    text: 'Je hoeft nu niet alles op te lossen. Kies alleen één haalbare stap.',
    steps: [
      'Ga zitten op een plek die iets rustiger voelt.',
      'Neem een slok water of pak iets zachts vast.',
      'Vraag jezelf af: wat heb ik alleen voor de komende minuut nodig?'
    ]
  }
];

const FALLBACK_GROUNDING: GroundingStep[] = [
  { count: 5, label: 'dingen die je kunt zien', hint: 'Kijk langzaam om je heen. Benoem ze één voor één in je hoofd.' },
  { count: 4, label: 'dingen die je kunt voelen', hint: 'Je voeten op de grond, de stof van je kleding, de temperatuur van de lucht.' },
  { count: 3, label: 'dingen die je kunt horen', hint: 'Dichtbij of ver weg. Je hoeft ze niet mooi te vinden.' },
  { count: 2, label: 'dingen die je kunt ruiken', hint: 'Adem rustig in door je neus. Een klein beetje ruiken is ook goed.' },
  { count: 1, label: 'ding dat je kunt proeven', hint: 'Neem een slokje water, of merk de smaak in je mond op.' }
];

const cm = crisisRaw as unknown as {
  header?: { title?: unknown; text?: unknown };
  intro?: { title?: unknown; text?: unknown };
  crisisIntro?: unknown;
  crisisContent?: { header?: { title?: unknown; text?: unknown }; grounding?: unknown };
  grounding?: unknown;
  grounding54321?: unknown;
};

function asText(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
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
const INTRO = asText(cm.crisisIntro ?? headerSource?.text, FALLBACK_INTRO);
const GROUNDING: GroundingStep[] =
  asGrounding(cm.grounding54321) ?? asGrounding(cm.grounding) ?? asGrounding(cm.crisisContent?.grounding) ?? FALLBACK_GROUNDING;

/* --------------------------------- Scherm --------------------------------- */

export default function Crisis() {
  return (
    <div className="screen-stack">
      <header className="px-1 pt-2">
        <p className="eyebrow !text-ap-deep">Steun</p>
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

      <CalmingMethods />

      {/* Gereedschap: doorverwijzing naar eigen pagina's */}
      <GereedschapSection />

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
          Oefening opnieuw beginnen
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
      <div className="mt-1 grid grid-cols-2 gap-2">
        <button
          type="button"
          className="flex min-h-[44px] items-center justify-center px-2 text-[13px] font-bold text-ink-soft underline decoration-line underline-offset-4"
          onClick={goNext}
        >
          Sla stap over
        </button>
        <button
          type="button"
          className="flex min-h-[44px] items-center justify-center rounded-xl px-2 text-[13px] font-extrabold text-euca-deep"
          onClick={restart}
        >
          Oefening opnieuw beginnen
        </button>
      </div>
    </div>
  );
}

/* -------------------------- Aanvullende methoden -------------------------- */

function CalmingMethods() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="card" aria-label="Wat kan nu nog helpen">
      <p className="eyebrow">Kies wat past</p>
      <h2 className="card-title mt-1">Wat kan nu nog helpen?</h2>
      <p className="sub mt-1.5">Eén methode is genoeg. Stop als iets niet prettig voelt.</p>

      <div className="mt-3 flex flex-col gap-2">
        {CALMING_METHODS.map((method) => {
          const open = method.id === openId;
          const panelId = `calming-method-${method.id}`;
          return (
            <div key={method.id} className="overflow-hidden rounded-2xl border border-line bg-dune">
              <button
                type="button"
                className="flex min-h-[56px] w-full items-center gap-3 px-4 py-3 text-left"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : method.id)}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-extrabold text-ink">{method.title}</span>
                  <span className="sub mt-0.5 block">{method.text}</span>
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={['flex-none text-euca-deep transition-transform', open ? 'rotate-90' : ''].join(' ')}
                  aria-hidden="true"
                >
                  <path d="M6.5 3.5 11 9l-4.5 5.5" />
                </svg>
              </button>

              {open && (
                <ol id={panelId} className="border-t border-line bg-sand px-4 py-3.5">
                  {method.steps.map((step, index) => (
                    <li key={step} className="flex gap-3 py-1.5 text-sm leading-body text-ink">
                      <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-eucatint text-xs font-extrabold text-euca-deep">
                        {index + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------- Gereedschap ------------------------------ */

function GereedschapSection() {
  const plan = useHuidigSignaleringsplan();
  const filled = plan ? countFilledPlanSections(plan.fields) : undefined;

  return (
    <section className="card" aria-label="Je gereedschap">
      <p className="eyebrow">Voor later en voor nu</p>
      <h2 className="card-title mt-1">Je gereedschap</h2>
      <p className="sub mt-1.5">Twee rustige oefeningen, elk op een eigen pagina — altijd bij de hand.</p>

      <div className="mt-3 flex flex-col gap-2">
        {/* Signaleringsplan */}
        <Link
          to="/steun/signaleringsplan"
          className="flex min-h-[56px] items-center gap-3 rounded-2xl border border-line bg-eucatint px-4 py-3 text-left"
        >
          <span className="min-w-0 flex-1">
            <b className="block text-[15px] font-extrabold text-ink">Signaleringsplan</b>
            <span className="sub mt-0.5 block">
              Per pan opschrijven wat helpt — op rustige momenten ingevuld, in hevige momenten bij de hand.
            </span>
          </span>
          {plan && filled !== undefined && (
            <span className="chip flex-none">
              {filled} van {SIGNALERINGSPLAN_SECTIONS.length}
            </span>
          )}
          <svg
            className="ml-auto flex-none text-euca-deep"
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
        </Link>

        {/* G-Schema */}
        <Link
          to="/steun/g-schema"
          className="flex min-h-[56px] items-center gap-3 rounded-2xl border border-line bg-eucatint px-4 py-3 text-left"
        >
          <span className="min-w-0 flex-1">
            <b className="block text-[15px] font-extrabold text-ink">G-schema</b>
            <span className="sub mt-0.5 block">
              Onderzoek een moeilijke gedachte stap voor stap en bedenk een alternatief dat beter helpt.
            </span>
          </span>
          <svg
            className="ml-auto flex-none text-euca-deep"
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
        </Link>
      </div>
    </section>
  );
}
