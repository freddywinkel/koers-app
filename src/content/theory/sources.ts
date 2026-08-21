import type { TheorySource } from './types';

/** Publiek controleerbare bronregister. De les- en begripteksten zijn volledig eigen formuleringen. */
export const theorySources: TheorySource[] = [
  {
    id: 'acbs-six-core',
    title: { nl: 'De zes kernprocessen van ACT', en: 'The six core processes of ACT' },
    organization: 'Association for Contextual Behavioral Science (ACBS)',
    url: 'https://contextualscience.org/six_core_processes_act',
    accessedAt: '2026-08-21',
    note: {
      nl: 'Primaire vakverenigingbron voor de zes processen van psychologische flexibiliteit.',
      en: 'Primary professional-association source for the six psychological flexibility processes.'
    }
  },
  {
    id: 'acbs-act-model',
    title: { nl: 'Het ACT-model en psychologische inflexibiliteit', en: 'The ACT model and psychological inflexibility' },
    organization: 'Association for Contextual Behavioral Science (ACBS)',
    url: 'https://contextualscience.org/2_act_model_conceptually_self_lab',
    accessedAt: '2026-08-21',
    note: {
      nl: 'Bron voor de samenhang tussen flexibiliteits- en inflexibiliteitsprocessen.',
      en: 'Source for the relationship between flexibility and inflexibility processes.'
    }
  },
  {
    id: 'acbs-philosophical-roots',
    title: { nl: 'Filosofische basis van ACT', en: 'Philosophical roots of ACT' },
    organization: 'Association for Contextual Behavioral Science (ACBS)',
    url: 'https://contextualscience.org/philosophical_roots',
    accessedAt: '2026-08-21',
    note: {
      nl: 'Verdiepende bron over context, functie en werkbaarheid.',
      en: 'Advanced source about context, function and workability.'
    }
  },
  {
    id: 'trimbos-vers-training',
    title: { nl: 'Actuele beschrijving van de VERS-training', en: 'Current description of VERS training' },
    organization: 'Trimbos-instituut',
    url: 'https://www.trimbos.nl/aanbod/academie/trainingen/vers-training/',
    accessedAt: '2026-08-21',
    note: {
      nl: 'Actuele publieke bron voor doel, vorm en grenzen van de officiële VERS.',
      en: 'Current public source for the purpose, format and boundaries of official VERS.'
    }
  },
  {
    id: 'trimbos-vers-intro',
    title: { nl: 'Inleiding VERS I', en: 'Introduction to VERS I' },
    organization: 'Trimbos-instituut',
    url: 'https://documenten.trimbos.nl/openen-downloadbaar-bestand-prs/inleiding-vers-i-aug16-pdf',
    accessedAt: '2026-08-21',
    note: {
      nl: 'Publieke inhoudsbron voor de kernassumpties, vijf emotievaardigheden en negen levensgebieden.',
      en: 'Public content source for the core assumptions, five emotion skills and nine life domains.'
    }
  },
  {
    id: 'uiowa-stepps',
    title: { nl: 'STEPPS-programma', en: 'STEPPS programme' },
    organization: 'University of Iowa Health Care',
    url: 'https://uihc.org/services/stepps',
    accessedAt: '2026-08-21',
    note: {
      nl: 'Publieke bron over STEPPS, de internationale basis van VERS.',
      en: 'Public source about STEPPS, the international basis of VERS.'
    }
  },
  {
    id: 'cci-thinking-feeling',
    title: { nl: 'Denken, voelen, piekeren en gedachtedagboeken', en: 'Thinking, feeling, worry and thought diaries' },
    organization: 'Centre for Clinical Interventions, Government of Western Australia',
    url: 'https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself/Anxiety',
    accessedAt: '2026-08-21',
    note: {
      nl: 'Publieke overheidsbron voor piekeren, automatische gedachten en stapsgewijze gedachtedagboeken.',
      en: 'Public government source for worry, automatic thoughts and structured thought diaries.'
    }
  }
];

const sourceById = new Map(theorySources.map((source) => [source.id, source]));

export function getTheorySource(sourceId: string): TheorySource | undefined {
  return sourceById.get(sourceId);
}
