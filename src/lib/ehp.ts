import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';

/**
 * Emotiehanteringsplan (EHP) — secties en datahooks
 * -------------------------------------------------
 * Het EHP is een persoonlijk veiligheidsplan, opgebouwd per pan (1 t/m 5),
 * precies zoals de lessen w11-l02 en w12-l03 dat leren:
 * "Per pan schrijf je op: hoe herken ik dit? Wat helpt mij? Wat kunnen
 * anderen doen?" Daarnaast is er één vaste sectie 'Professionele hulp'.
 * Opslag: tabel `ehpSections` { key, content } — één rij per veld.
 * Een rij ontstaat pas zodra de gebruiker iets wijzigt; de prefill van
 * 'Professionele hulp' wordt dus nooit ongevraagd opgeslagen.
 * Alles blijft lokaal op het apparaat (privacy-by-design).
 *
 * Publieke API:
 *   EHP_SECTIONS                    · de 6 secties (pan 1–5 + professionele hulp)
 *   useEhpSections()                · live map { [veldKey]: content } (undefined = laden)
 *   ehpFieldContent(def, map)       · effectieve inhoud van een veld (opgeslagen, anders prefill)
 *   countFilledEhpSections(map)     · aantal secties met minstens één veld met inhoud
 *   useEhpFilledCount()             · zelfde, als live hook
 *   saveEhpSection(key, content)    · upsert één veld
 */

export interface EhpFieldDef {
  /** Sleutel in de ehpSections-tabel. */
  key: string;
  /** Eén van de drie vragen uit de lessen (B1, ik-vorm). */
  prompt: string;
  placeholder: string;
  /** Vooringevulde tekst; alleen getoond, niet opgeslagen tot de gebruiker wijzigt. */
  prefill?: string;
}

export interface EhpSectionDef {
  /** Sleutel van de sectie (pan1 … pan5, professioneel). */
  key: string;
  /** Zichtbare titel van de sectie. */
  title: string;
  /** Korte, warme toelichting onder de titel (optioneel). */
  intro?: string;
  /** De velden van deze sectie (per pan: de drie vragen uit de les). */
  fields: EhpFieldDef[];
}

export const EHP_SECTIONS: EhpSectionDef[] = [
  {
    key: 'pan1',
    title: 'Pan 1: Rustig',
    intro: 'Dit is je basis. Schrijf op wat je doet om zo te blijven.',
    fields: [
      {
        key: 'pan1-herken',
        prompt: 'Hoe herken ik dit?',
        placeholder: 'Bijvoorbeeld: ik slaap lekker, ik kan lachen, er is ruimte in mijn hoofd …'
      },
      {
        key: 'pan1-helpt',
        prompt: 'Wat helpt mij?',
        placeholder: 'Bijvoorbeeld: slapen, bewegen, even ademen met aandacht …'
      },
      {
        key: 'pan1-anderen',
        prompt: 'Wat kunnen anderen doen?',
        placeholder: 'Bijvoorbeeld: gewoon gezellig samen zijn, mee wandelen …'
      }
    ]
  },
  {
    key: 'pan2',
    title: 'Pan 2: Rimpelt',
    intro: 'Kleine rimpels horen erbij. Hier vang je ze vroeg op.',
    fields: [
      {
        key: 'pan2-herken',
        prompt: 'Hoe herken ik dit?',
        placeholder: 'Bijvoorbeeld: iets minder geduld, kleine ergernissen …'
      },
      {
        key: 'pan2-helpt',
        prompt: 'Wat helpt mij?',
        placeholder: 'Bijvoorbeeld: mijn ritme vasthouden, iets fijns plannen, even naar buiten …'
      },
      {
        key: 'pan2-anderen',
        prompt: 'Wat kunnen anderen doen?',
        placeholder: 'Bijvoorbeeld: even vragen hoe het gaat, iets liefs …'
      }
    ]
  },
  {
    key: 'pan3',
    title: 'Pan 3: Borrelt',
    intro: 'Nu borrelt het. Afstand nemen en observeren helpt hier.',
    fields: [
      {
        key: 'pan3-herken',
        prompt: 'Hoe herken ik dit?',
        placeholder: 'Bijvoorbeeld: piekeren, spanning in mijn lijf, slecht slapen …'
      },
      {
        key: 'pan3-helpt',
        prompt: 'Wat helpt mij?',
        placeholder: 'Bijvoorbeeld: afstand nemen en observeren, aandacht verplaatsen …'
      },
      {
        key: 'pan3-anderen',
        prompt: 'Wat kunnen anderen doen?',
        placeholder: 'Bijvoorbeeld: met me meedenken, even bellen …'
      }
    ]
  },
  {
    key: 'pan4',
    title: 'Pan 4: Pruttelt',
    intro: 'Nu telt alleen nog simpel. Eén grondende oefening, één persoon.',
    fields: [
      {
        key: 'pan4-herken',
        prompt: 'Hoe herken ik dit?',
        placeholder: 'Bijvoorbeeld: kortaf zijn, mijden, nergens aan beginnen …'
      },
      {
        key: 'pan4-helpt',
        prompt: 'Wat helpt mij?',
        placeholder: 'Bijvoorbeeld: 5-4-3-2-1, het ademanker, drie minuten bewegen …'
      },
      {
        key: 'pan4-anderen',
        prompt: 'Wat kunnen anderen doen?',
        placeholder: 'Bijvoorbeeld: mijn steunpersoon bellen, bij me blijven …'
      }
    ]
  },
  {
    key: 'pan5',
    title: 'Pan 5: Kookt over',
    intro: 'Stop alles. Grond je. Bereik iemand.',
    fields: [
      {
        key: 'pan5-herken',
        prompt: 'Hoe herken ik dit?',
        placeholder: 'Bijvoorbeeld: ik voel dat ik er helemaal doorheen ga …'
      },
      {
        key: 'pan5-helpt',
        prompt: 'Wat helpt mij?',
        placeholder: 'Bijvoorbeeld: stop alles, grond me met 5-4-3-2-1, maak mijn omgeving veilig …'
      },
      {
        key: 'pan5-anderen',
        prompt: 'Wat kunnen anderen doen?',
        placeholder: 'Bijvoorbeeld: bereik me, blijf bij me, bel samen met mij hulp …'
      }
    ]
  },
  {
    key: 'professioneel',
    title: 'Professionele hulp',
    fields: [
      {
        key: 'professioneel',
        prompt:
          'Deze hulplijnen zijn er altijd — ook ’s nachts, ook anoniem. Je mag deze tekst aanpassen aan je eigen situatie.',
        placeholder: 'Hulplijnen en hulpverleners …',
        prefill:
          '113 Zelfmoordpreventie: bel 113 of 0800-0113 (gratis, dag en nacht). Chatten kan via 113.nl.\n' +
          'Huisarts of huisartsenpost: overdag je eigen huisarts, ’s avonds en in het weekend de huisartsenpost.\n' +
          '112: bij direct gevaar.'
      }
    ]
  }
];

/* --------------------------------- Hooks --------------------------------- */

/** Live query: alle EHP-velden als map { key: content }. undefined = nog aan het laden. */
export function useEhpSections(): Record<string, string> | undefined {
  return useLiveQuery(async () => {
    const rows = await db.ehpSections.toArray();
    const map: Record<string, string> = {};
    for (const row of rows) map[row.key] = row.content;
    return map;
  }, []);
}

/**
 * Effectieve inhoud van een veld: de opgeslagen tekst als die er is,
 * anders de prefill (die wordt dus nooit als rij opgeslagen).
 */
export function ehpFieldContent(def: EhpFieldDef, sections: Record<string, string> | undefined): string {
  const saved = sections?.[def.key];
  return saved !== undefined ? saved : (def.prefill ?? '');
}

/** Heeft een sectie minstens één veld met zichtbare inhoud (opgeslagen tekst of prefill)? */
function ehpSectionFilled(def: EhpSectionDef, sections: Record<string, string> | undefined): boolean {
  return def.fields.some((field) => ehpFieldContent(field, sections).trim().length > 0);
}

/** Hoeveel secties hebben minstens één veld met zichtbare inhoud? */
export function countFilledEhpSections(sections: Record<string, string> | undefined): number {
  return EHP_SECTIONS.filter((def) => ehpSectionFilled(def, sections)).length;
}

/** Live hook-versie van countFilledEhpSections. undefined = nog aan het laden. */
export function useEhpFilledCount(): number | undefined {
  const sections = useEhpSections();
  return sections === undefined ? undefined : countFilledEhpSections(sections);
}

/* --------------------------------- Opslag -------------------------------- */

/**
 * Sla één veld op (upsert op sleutel). Lege tekst is toegestaan: zo kan een
 * veld met prefill bewust leeggemaakt worden (rij bestaat, content = '').
 */
export async function saveEhpSection(key: string, content: string): Promise<void> {
  await db.ehpSections.put({ key, content });
}
