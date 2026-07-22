import { useLiveQuery } from 'dexie-react-hooks';
import { db, type GSchemaRow } from '../db/db';

/**
 * G-schema (gedachtenschema) — velddefinities en datahooks
 * --------------------------------------------------------
 * Gebaseerd op het werkblad "Het G-schema" (psycholoogtogo.nl) dat de
 * gebruiker heeft aangeleverd. Deel 1 onderzoekt de situatie
 * (Gebeurtenis, Gedachten, Gevoel, Gedrag, Gevolgen), Deel 2 daagt de
 * gedachte uit en bedenkt een helpender alternatief.
 *
 * Elke invulling wordt opgeslagen als record in `db.gSchemas` met een
 * aanmaakdatum, zodat eerdere G-schema's altijd terug te lezen zijn.
 *
 * Publieke API:
 *   GSCHEMA_DEEL1 / GSCHEMA_DEEL2          · velddefinities per deel
 *   useGSchemas()                          · live lijst, nieuwste eerst (undefined = laden)
 *   saveGSchema(fields, percentages)       · sla een nieuw G-schema op; geeft record-id
 *   formatGSchemaDate(ts)                  · NL-datumnotatie voor de records-lijst
 */

export interface GSchemaVeldDef {
  /** Sleutel in GSchemaRow.fields (en .percentages voor percentage-velden). */
  key: string;
  /** Zichtbare titel van het veld (de G uit het schema). */
  title: string;
  /** De begeleidende vraag uit het werkblad. */
  prompt: string;
  placeholder: string;
  /** Zo ja, dan hoort er een slider "0–100%" bij dit veld met dit label. */
  percentageLabel?: string;
}

export const GSCHEMA_DEEL1: GSchemaVeldDef[] = [
  {
    key: 'gebeurtenis',
    title: 'Gebeurtenis',
    prompt:
      'Wat was de situatie? Met wie was ik, waar was ik, wat gebeurde er? Kies één moment waarbij je gevoel het sterkst was en beschrijf wat er feitelijk gebeurde.',
    placeholder: 'Bijvoorbeeld: vanochtend aan de ontbijttafel, mijn partner zei …'
  },
  {
    key: 'gedachten',
    title: 'Gedachten',
    prompt: 'Wat waren mijn automatische gedachten? Kies hieruit je belangrijkste gedachte.',
    placeholder: 'Bijvoorbeeld: ik kan dit niet, niemand begrijpt me …',
    percentageLabel: 'Hoe sterk geloof ik deze belangrijkste gedachte?'
  },
  {
    key: 'gevoel',
    title: 'Gevoel',
    prompt: 'Wat voelde je toen? Denk aan de 4 b’s: boos, blij, bedroefd, bang.',
    placeholder: 'Bijvoorbeeld: bang en bedroefd …',
    percentageLabel: 'Hoe sterk was dit gevoel?'
  },
  {
    key: 'gedrag',
    title: 'Gedrag',
    prompt: 'Wat deed ik?',
    placeholder: 'Bijvoorbeeld: ik trok me terug, ik werd kortaf …'
  },
  {
    key: 'gevolgen',
    title: 'Gevolgen',
    prompt: 'Wat zijn de gevolgen van dit gedrag op korte en lange termijn?',
    placeholder: 'Bijvoorbeeld: korte termijn rust, lange termijn meer afstand …'
  }
];

export const GSCHEMA_DEEL2: GSchemaVeldDef[] = [
  {
    key: 'uitdagen',
    title: 'Uitdagen',
    prompt:
      'Klopt deze gedachte? Wat is het bewijs voor en tegen? Kan ik er op een andere manier naar kijken? Welke gedachte past beter bij de feiten en helpt mij meer?',
    placeholder: 'Bijvoorbeeld: bewijs voor …, bewijs tegen …'
  },
  {
    key: 'nieuwe-gedachten',
    title: 'Nieuwe gedachten',
    prompt: 'Bedenk een gedachte die beter bij de feiten past en meer helpt.',
    placeholder: 'Bijvoorbeeld: dit is moeilijk, en ik heb eerder …'
  },
  {
    key: 'nieuw-gedrag',
    title: 'Nieuw gedrag',
    prompt: 'Bedenk gedrag dat meer helpt. Hoe zou je willen reageren?',
    placeholder: 'Bijvoorbeeld: de volgende keer neem ik eerst drie ademhalingen en …'
  }
];

/** Live query: alle G-schema's, nieuwste eerst. undefined = nog aan het laden. */
export function useGSchemas(): GSchemaRow[] | undefined {
  return useLiveQuery(async () => {
    const rows = await db.gSchemas.toArray();
    return rows.sort((a, b) => b.createdAt - a.createdAt);
  }, []);
}

/** Sla een nieuw G-schema op als record. Lege tekstvelden mogen leeg blijven. */
export async function saveGSchema(
  fields: Record<string, string>,
  percentages: Record<string, number>
): Promise<number> {
  const now = Date.now();
  return db.gSchemas.add({ createdAt: now, updatedAt: now, fields, percentages });
}

export interface GSchemaDraft {
  fields: Record<string, string>;
  percentages: Record<string, number>;
  updatedAt: number;
}

const GSCHEMA_DRAFT_KEY = 'concept-gschema';
const GSCHEMA_DRAFT_RECOVERY_KEY = 'koers-concept-gschema-recovery';

function parseGSchemaDraft(value: string | null | undefined): GSchemaDraft | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<GSchemaDraft>;
    if (!parsed.fields || typeof parsed.fields !== 'object') return null;
    const fields = Object.fromEntries(
      Object.entries(parsed.fields).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
    );
    const percentages = Object.fromEntries(
      Object.entries(parsed.percentages ?? {}).filter(
        (entry): entry is [string, number] => typeof entry[1] === 'number' && Number.isFinite(entry[1])
      )
    );
    return { fields, percentages, updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : 0 };
  } catch {
    return null;
  }
}

function writeRecoveryDraft(draft: GSchemaDraft): void {
  try {
    localStorage.setItem(GSCHEMA_DRAFT_RECOVERY_KEY, JSON.stringify(draft));
  } catch {
    // IndexedDB blijft beschikbaar als localStorage niet mag.
  }
}

/**
 * Synchroon hersteljournaal voor tekst die nog vóór de IndexedDB-hydratie is
 * ingevoerd. Dit wordt bij iedere wijziging bijgewerkt; de gewone conceptopslag
 * blijft gedebounced.
 */
export function cacheGSchemaDraftForRecovery(
  fields: Record<string, string>,
  percentages: Record<string, number>
): void {
  writeRecoveryDraft({ fields, percentages, updatedAt: Date.now() });
}

/** Lees een tussentijds opgeslagen concept; ongeldige oude data wordt genegeerd. */
export async function loadGSchemaDraft(): Promise<GSchemaDraft | null> {
  const row = await db.settings.get(GSCHEMA_DRAFT_KEY);
  const indexedDraft = parseGSchemaDraft(row?.value);
  let recoveryDraft: GSchemaDraft | null = null;
  try {
    recoveryDraft = parseGSchemaDraft(localStorage.getItem(GSCHEMA_DRAFT_RECOVERY_KEY));
  } catch {
    // Alleen de IndexedDB-versie gebruiken als localStorage niet mag.
  }
  if (!indexedDraft) return recoveryDraft;
  if (!recoveryDraft) return indexedDraft;
  return recoveryDraft.updatedAt >= indexedDraft.updatedAt ? recoveryDraft : indexedDraft;
}

/** Bewaar de huidige invoer als één atomair conceptrecord. */
export async function saveGSchemaDraft(
  fields: Record<string, string>,
  percentages: Record<string, number>
): Promise<void> {
  const draft: GSchemaDraft = { fields, percentages, updatedAt: Date.now() };
  writeRecoveryDraft(draft);
  await db.settings.put({ key: GSCHEMA_DRAFT_KEY, value: JSON.stringify(draft) });
}

export async function clearGSchemaDraft(): Promise<void> {
  try {
    localStorage.removeItem(GSCHEMA_DRAFT_RECOVERY_KEY);
  } catch {
    // IndexedDB blijft de bron van waarheid als localStorage niet mag.
  }
  await db.settings.delete(GSCHEMA_DRAFT_KEY);
}

/** Datumnotatie voor records, bv. "12 mei 2026". */
export function formatGSchemaDate(ts: number): string {
  return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(ts));
}
