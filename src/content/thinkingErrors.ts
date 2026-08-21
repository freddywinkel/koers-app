import type { TheorySection } from './types';

type LocalizedText = Readonly<{
  nl: string;
  en: string;
}>;

interface LocalizedThinkingPattern {
  id: string;
  title: LocalizedText;
  alsoCalled?: LocalizedText;
  text: LocalizedText;
  example: LocalizedText;
}

const copy = {
  title: {
    nl: '12 veelvoorkomende denkpatronen',
    en: '12 common thinking patterns'
  },
  intro: [
    {
      nl: 'In de cognitieve gedragstherapie heten deze patronen vaak denkfouten. Dat is geen oordeel over jou. Het zijn snelle gewoontes van een brein dat probeert te begrijpen wat er gebeurt.',
      en: 'In cognitive behavioural therapy, these patterns are often called thinking errors. That is not a judgement about you. They are quick habits of a mind trying to make sense of what is happening.'
    },
    {
      nl: 'Er bestaat geen vaste lijst met alle denkfouten. Koers gebruikt twaalf veelvoorkomende patronen. Andere bronnen kunnen ze samenvoegen of anders noemen.',
      en: 'There is no single definitive list of every thinking error. Koers uses twelve common patterns. Other sources may combine them or use different names.'
    }
  ],
  takeaway: {
    nl: 'Je hoeft niet precies het juiste label te vinden. Eén gedachte kan bij meerdere patronen passen. Kies daarna wat helpt: neem afstand van de gedachte, of onderzoek haar rustig met de feiten.',
    en: 'You do not need to find the exact right label. One thought can fit more than one pattern. Then choose what helps: step back from the thought, or calmly examine it using the evidence.'
  },
  caution: {
    nl: 'Een label bewijst niet dat je gedachte onwaar is. Echte problemen, gevaar, discriminatie en je grenzen hoef je niet weg te redeneren. Zit je in pan 4 (Pruttelt) of pan 5 (Kookt over)? Kies eerst een vaardigheid die rust of steun geeft en onderzoek de gedachte later.',
    en: 'A label does not prove that your thought is untrue. You do not have to reason away real problems, danger, discrimination or your boundaries. Are you Simmering or Boiling over? First choose a skill that brings calm or support, and examine the thought later.'
  },
  source: {
    nl: 'Bronnen: veelgebruikte CGT-overzichten van het Beck Institute, CCI en de NHS. De uitleg en voorbeelden zijn in eigen woorden.',
    en: 'Sources: widely used CBT overviews from the Beck Institute, CCI and the NHS. The explanations and examples are written in our own words.'
  }
} satisfies Record<string, LocalizedText | LocalizedText[]>;

/**
 * Praktische, niet-diagnostische set. Er is geen universele lijst met alle
 * cognitieve vertekeningen; bronnen splitsen en groeperen patronen anders.
 * De selectie dekt de gangbare categorieën uit:
 * - Beck Institute CBT Worksheet Packet (Beck, 2020), p. 41/45;
 * - Centre for Clinical Interventions, Unhelpful Thinking Styles;
 * - NHS-uitleg over unhelpful thinking styles.
 * Alle Nederlandse uitleg en voorbeelden hieronder zijn origineel geschreven.
 */
export const THINKING_PATTERNS: readonly LocalizedThinkingPattern[] = [
  {
    id: 'black-and-white',
    title: { nl: 'Zwart-witdenken', en: 'Black-and-white thinking' },
    alsoCalled: { nl: 'alles-of-nietsdenken', en: 'all-or-nothing thinking' },
    text: {
      nl: 'Je ziet alleen twee uitersten: goed of slecht, gelukt of mislukt. Wat ertussen zit, raakt uit beeld.',
      en: 'You see only two extremes: good or bad, success or failure. Everything in between disappears from view.'
    },
    example: {
      nl: 'Als ik niet alles afmaak, heb ik gefaald.',
      en: 'If I do not finish everything, I have failed.'
    }
  },
  {
    id: 'overgeneralising',
    title: { nl: 'Overgeneraliseren', en: 'Overgeneralising' },
    text: {
      nl: 'Je maakt van één gebeurtenis een regel voor altijd, overal of iedereen.',
      en: 'You turn one event into a rule about always, everywhere or everyone.'
    },
    example: {
      nl: 'Dit gesprek ging stroef. Ik kan nooit goed met mensen praten.',
      en: 'This conversation was awkward. I can never talk to people well.'
    }
  },
  {
    id: 'negative-filter',
    title: { nl: 'Negatief filter', en: 'Negative mental filter' },
    alsoCalled: { nl: 'mentale filter', en: 'mental filter' },
    text: {
      nl: 'Eén negatief detail krijgt alle aandacht. Positieve of neutrale informatie raakt uit beeld.',
      en: 'One negative detail gets all your attention. Positive or neutral information disappears from view.'
    },
    example: {
      nl: 'Eén reactie was kritisch, dus mijn hele werk was slecht.',
      en: 'One response was critical, so all my work was bad.'
    }
  },
  {
    id: 'dismissing-positive',
    title: { nl: 'Het positieve wegwuiven', en: 'Dismissing the positive' },
    text: {
      nl: 'Je laat iets goeds niet meetellen. Je noemt het toeval, geluk of niet belangrijk.',
      en: 'You do not let something good count. You call it chance, luck or unimportant.'
    },
    example: {
      nl: 'Het ging goed, maar dat was alleen geluk.',
      en: 'It went well, but that was only luck.'
    }
  },
  {
    id: 'mind-reading',
    title: { nl: 'Gedachten lezen', en: 'Mind reading' },
    alsoCalled: { nl: 'te snel conclusies trekken', en: 'jumping to conclusions' },
    text: {
      nl: 'Je denkt te weten wat een ander denkt, zonder dit te vragen of genoeg bewijs te hebben.',
      en: 'You assume you know what someone else thinks, without asking or having enough evidence.'
    },
    example: {
      nl: 'Ze antwoordt kort, dus ze vindt mij vervelend.',
      en: 'She replies briefly, so she must find me annoying.'
    }
  },
  {
    id: 'future-prediction',
    title: { nl: 'De toekomst invullen', en: 'Predicting the future' },
    alsoCalled: { nl: 'toekomst voorspellen', en: 'fortune telling' },
    text: {
      nl: 'Je behandelt een onzekere voorspelling alsof die al vaststaat.',
      en: 'You treat an uncertain prediction as if it has already been decided.'
    },
    example: {
      nl: 'Morgen klap ik zeker dicht.',
      en: 'Tomorrow I will definitely freeze.'
    }
  },
  {
    id: 'catastrophising',
    title: { nl: 'Rampdenken', en: 'Catastrophising' },
    alsoCalled: { nl: 'catastroferen', en: 'catastrophic thinking' },
    text: {
      nl: 'Je verwacht het ergste en denkt dat de kans heel groot is of dat je het niet aankunt.',
      en: 'You expect the worst and believe it is very likely or that you could not cope with it.'
    },
    example: {
      nl: 'Ik maak één fout. Straks raak ik alles kwijt.',
      en: 'I will make one mistake. Then I will lose everything.'
    }
  },
  {
    id: 'emotional-reasoning',
    title: { nl: 'Redeneren vanuit gevoel', en: 'Emotional reasoning' },
    alsoCalled: { nl: 'emotioneel redeneren', en: 'reasoning from feelings' },
    text: {
      nl: 'Je gevoel wordt bewijs voor wat er buiten jou gebeurt. Het gevoel is echt, maar de conclusie hoeft niet te kloppen.',
      en: 'Your feeling becomes evidence for what is happening outside you. The feeling is real, but the conclusion may not be accurate.'
    },
    example: {
      nl: 'Ik voel me afgewezen, dus zij wijst mij af.',
      en: 'I feel rejected, so she is rejecting me.'
    }
  },
  {
    id: 'should-must',
    title: { nl: 'Moeten-denken', en: 'Should and must thinking' },
    text: {
      nl: 'Je legt strenge regels op aan jezelf of anderen met moet, hoort, altijd of nooit.',
      en: 'You set strict rules for yourself or others using should, must, always or never.'
    },
    example: {
      nl: 'Ik mag nooit hulp nodig hebben.',
      en: 'I should never need help.'
    }
  },
  {
    id: 'labelling',
    title: { nl: 'Etiketten plakken', en: 'Labelling' },
    text: {
      nl: 'Je maakt van één gedrag of één fout een vast oordeel over een heel persoon.',
      en: 'You turn one behaviour or one mistake into a fixed judgement about a whole person.'
    },
    example: {
      nl: 'Ik vergat de afspraak, dus ik ben onbetrouwbaar.',
      en: 'I forgot the appointment, so I am unreliable.'
    }
  },
  {
    id: 'personalising',
    title: { nl: 'Personaliseren', en: 'Personalising' },
    text: {
      nl: 'Je ziet jezelf als oorzaak van iets, terwijl er ook andere verklaringen kunnen zijn.',
      en: 'You see yourself as the cause of something, even though there may be other explanations.'
    },
    example: {
      nl: 'Hij is stil. Ik heb vast iets verkeerd gedaan.',
      en: 'He is quiet. I must have done something wrong.'
    }
  },
  {
    id: 'magnifying-minimising',
    title: { nl: 'Vergroten en verkleinen', en: 'Magnifying and minimising' },
    text: {
      nl: 'Je maakt fouten of risico’s heel groot. Wat goed ging of wat je kunt, maak je heel klein.',
      en: 'You make mistakes or risks seem very large. You make what went well or what you can do seem very small.'
    },
    example: {
      nl: 'Mijn fout is enorm. Wat goed ging, telt niet.',
      en: 'My mistake is enormous. What went well does not count.'
    }
  }
] as const;

export const thinkingPatternsTheorySection: TheorySection = {
  id: 'common-thinking-patterns',
  title: copy.title.nl,
  intro: copy.intro.map((paragraph) => paragraph.nl),
  items: THINKING_PATTERNS.map((pattern) => ({
    id: pattern.id,
    title: pattern.title.nl,
    alsoCalled: pattern.alsoCalled?.nl,
    text: pattern.text.nl,
    example: pattern.example.nl
  })),
  takeaway: copy.takeaway.nl,
  caution: copy.caution.nl,
  source: copy.source.nl
};

const allLocalizedText: LocalizedText[] = [
  copy.title,
  ...copy.intro,
  copy.takeaway,
  copy.caution,
  copy.source,
  ...THINKING_PATTERNS.flatMap((pattern) => [
    pattern.title,
    ...(pattern.alsoCalled ? [pattern.alsoCalled] : []),
    pattern.text,
    pattern.example
  ])
];

/** Curated British-English copy; this wins over generated machine translation. */
export const THINKING_PATTERNS_ENGLISH_OVERRIDES: Readonly<Record<string, string>> = Object.fromEntries(
  allLocalizedText.map((value) => [value.nl, value.en])
);
