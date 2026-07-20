import { useLiveQuery } from 'dexie-react-hooks';
import { db, type GSchemaRow } from '../db/db';

/**
 * G-schema (gedachtenschema) — velddefinities en datahooks
 * --------------------------------------------------------
 * Gebaseerd op het werkblad "Het G-schema" (psycholoogtogo.nl) dat de
 * gebruiker heeft aangeleverd. Deel 1 onderzoekt de situatie
 * (Gebeurtenis, Gedachten, Gevoel, Gedrag, Gevolgen), Deel 2 daagt de
 * gedachte uit en formuleert een helpender alternatief.
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
    prompt: 'Wat waren mijn automatische gedachten? Kies hieruit je belangrijkste kerngedachten.',
    placeholder: 'Bijvoorbeeld: ik kan dit niet, niemand begrijpt me …',
    percentageLabel: 'Hoe sterk geloof ik deze kerngedachten?'
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
      'Klopt deze gedachte? Wat zijn bewijzen voor en tegen? Kan ik er op een andere manier naar kijken? Is dit realistisch en helpend om te denken?',
    placeholder: 'Bijvoorbeeld: bewijs voor …, bewijs tegen …'
  },
  {
    key: 'nieuwe-gedachten',
    title: 'Nieuwe gedachten',
    prompt: 'Formuleer een meer realistische, helpende gedachte.',
    placeholder: 'Bijvoorbeeld: dit is moeilijk, en ik heb eerder …'
  },
  {
    key: 'nieuw-gedrag',
    title: 'Nieuw gedrag',
    prompt: 'Formuleer meer helpend gedrag. Hoe zou je willen reageren?',
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

/** Datumnotatie voor records, bv. "12 mei 2026". */
export function formatGSchemaDate(ts: number): string {
  return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(ts));
}
