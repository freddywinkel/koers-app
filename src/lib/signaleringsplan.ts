import { useLiveQuery } from 'dexie-react-hooks';
import { db, type SignaleringsplanRow } from '../db/db';
import { EHP_SECTIONS, type EhpFieldDef, type EhpSectionDef } from './ehp';
import { translate } from '../i18n';

/**
 * Signaleringsplan — datahooks boven op `db.signaleringsplannen`
 * ---------------------------------------------------------------
 * Voorheen heette dit het Emotiehanteringsplan (één set velden in
 * `ehpSections`). Nu is elk ingevuld plan een eigen record met een
 * aanmaakdatum: de gebruiker kan later een nieuw plan starten terwijl
 * oudere plannen bewaard blijven en terug te lezen zijn.
 *
 * De sectie- en velddefinities (pan 1–5 + professionele hulp) komen
 * ongewijzigd uit lib/ehp.ts (EHP_SECTIONS). De veldsleutels zijn dus
 * gelijk gebleven, waardoor de migratie uit db.ts versie 2 één-op-één
 * de oude inhoud in een eerste plan kan zetten.
 *
 * Publieke API:
 *   useSignaleringsplannen()                  · live lijst, nieuwste eerst (undefined = laden)
 *   useHuidigSignaleringsplan()               · het nieuwste plan (undefined = laden, null = nog geen plan)
 *   ensureHuidigSignaleringsplan()            · maak een leeg plan als er nog geen is; geeft plan-id
 *   saveSignaleringsplanVeld(id, key, value)  · upsert één veld in een plan
 *   startNieuwSignaleringsplan()              · maak een nieuw leeg plan; geeft plan-id
 *   planVeldContent(def, fields)              · effectieve inhoud van een veld (opgeslagen, anders prefill)
 *   countFilledPlanSections(fields)           · aantal secties met minstens één veld met inhoud
 *   formatRecordDate(ts)                      · NL-datumnotatie voor de records-lijst
 */

export { EHP_SECTIONS as SIGNALERINGSPLAN_SECTIONS };
export type { EhpFieldDef as SignaleringsplanFieldDef, EhpSectionDef as SignaleringsplanSectionDef };

/** Live query: alle plannen, nieuwste eerst. undefined = nog aan het laden. */
export function useSignaleringsplannen(): SignaleringsplanRow[] | undefined {
  return useLiveQuery(async () => {
    const rows = await db.signaleringsplannen.toArray();
    return rows.sort((a, b) => b.createdAt - a.createdAt);
  }, []);
}

/**
 * Het huidige (nieuwste) plan.
 * undefined = nog aan het laden; null = er is nog geen plan aangemaakt.
 */
export function useHuidigSignaleringsplan(): SignaleringsplanRow | null | undefined {
  const plannen = useSignaleringsplannen();
  if (plannen === undefined) return undefined;
  return plannen.length > 0 ? plannen[0] : null;
}

/**
 * Geef het id van het huidige plan; maak een leeg plan aan als er nog geen is.
 * Zo kan de editor altijd meteen opslaan, ook bij de allereerste keer.
 */
export async function ensureHuidigSignaleringsplan(): Promise<number> {
  const rows = await db.signaleringsplannen.orderBy('createdAt').reverse().limit(1).toArray();
  if (rows.length > 0 && rows[0].id !== undefined) return rows[0].id;
  return startNieuwSignaleringsplan();
}

/** Sla één veld op in een bestaand plan (en werk updatedAt bij). */
export async function saveSignaleringsplanVeld(planId: number, key: string, content: string): Promise<void> {
  await db.signaleringsplannen
    .where('id')
    .equals(planId)
    .modify((plan) => {
      plan.fields = { ...plan.fields, [key]: content };
      plan.updatedAt = Date.now();
    });
}

/**
 * Start een nieuw, leeg signaleringsplan. Het vorige plan blijft als record
 * bewaard (met zijn aanmaakdatum) en is terug te lezen in de records-lijst.
 */
export async function startNieuwSignaleringsplan(): Promise<number> {
  const now = Date.now();
  return db.signaleringsplannen.add({ createdAt: now, updatedAt: now, fields: {} });
}

/**
 * Effectieve inhoud van een veld: de opgeslagen tekst als die er is,
 * anders de prefill (die wordt dus nooit als rij opgeslagen).
 */
export function planVeldContent(def: EhpFieldDef, fields: Record<string, string> | undefined): string {
  const saved = fields?.[def.key];
  if (saved !== undefined) return saved;
  return def.prefill?.split('\n').map(translate).join('\n') ?? '';
}

/** Hoeveel secties hebben minstens één veld met zichtbare inhoud? */
export function countFilledPlanSections(fields: Record<string, string> | undefined): number {
  return EHP_SECTIONS.filter((section) =>
    section.fields.some((field) => planVeldContent(field, fields).trim().length > 0)
  ).length;
}

/** Datumnotatie voor records, bv. "12 mei 2026". */
export function formatRecordDate(ts: number): string {
  const locale = localStorage.getItem('koers-language') === 'en' ? 'en-GB' : 'nl-NL';
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(ts));
}
