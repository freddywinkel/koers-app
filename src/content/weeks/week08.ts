import type { Week, Flashcard } from '../types';

/**
 * Week 8 — Toegewijd handelen
 * ---------------------------
 * Bron: research/act-deep-dive.md (§2.6 Toegewijd handelen) en
 * research/instructional-design.md (als-dan-plannen, kleine stappen, B1).
 * Alle teksten zijn origineel geschreven voor Koers.
 */
export const week08: Week = {
  id: 'w08',
  number: 8,
  title: 'Toegewijd handelen',
  tagline: 'Kleine stappen in de richting die er voor jou toe doet.',
  lessons: [
    {
      id: 'w08-l01',
      weekId: 'w08',
      order: 1,
      kind: 'lesson',
      title: 'Kleine stappen, echte richting',
      minutes: 6,
      tags: ['Toegewijd handelen'],
      intro: [
        'Vorige week vond je je kompas: wat jou belangrijk is. Nu komt de volgende stap. Er ook echt iets mee doen.',
        'Dat heet toegewijd handelen. Kleine dingen doen die passen bij jouw waarden. Niet perfect, wel echt.',
        'Grote plannen voelen vaak te zwaar. Daarom werken we met kleine stappen. Een kleine stap vandaag is meer waard dan een groot plan voor ooit.'
      ],
      metaphorCard: {
        title: 'De wandeltocht',
        text: 'Een lange wandeling begint met één stap. En daarna weer één. Omwegen en rusten horen erbij. Je blijft gewoon op pad.',
        art: 'mist'
      },
      exercise: {
        title: 'Klein maken',
        steps: [
          { n: 1, title: 'Kies een waarde', text: 'Pak je kompas van week 7 erbij. Kies één waarde die je nu aanspreekt.', seconds: 30 },
          { n: 2, title: 'Denk aan iets groots', text: 'Wat zou je ooit willen doen bij deze waarde? Groot denken mag hier.', seconds: 30 },
          { n: 3, title: 'Maak het steeds kleiner', text: 'Deel het in twee. En nog eens in twee. Tot je iets hebt dat je deze week echt kunt doen.', seconds: 60 },
          { n: 4, title: 'Schrijf je stap op', text: 'Bijvoorbeeld: woensdag even appen met een vriendin. Dát is je stap. Klein en echt.', seconds: 30 }
        ]
      },
      reflection: 'Voelt je stap te groot? Maak hem kleiner. Een stap die je echt zet, is altijd beter dan een mooie stap die blijft liggen.',
      assignment: 'Zet deze week je kleine stap. Schrijf daarna kort op hoe het ging. Ook als het niet lukte.',
      relatedSkillIds: [],
      flashcardIds: ['w08-l01-f1', 'w08-l01-f2']
    },
    {
      id: 'w08-l02',
      weekId: 'w08',
      order: 2,
      kind: 'lesson',
      title: 'Handelen met gevoelens erbij',
      minutes: 6,
      tags: ['Toegewijd handelen', 'Bereidheid'],
      intro: [
        'Op weg naar wat belangrijk is, kom je barrières tegen. Vaak zitten ze binnenin: angst, twijfel, vermoeidheid.',
        'Je hoeft niet te wachten tot die gevoelens weg zijn. Dat heb je al geoefend. Je gevoel mag mee op reis.',
        'Bereidheid betekent: ik doe het mét mijn spanning erbij. Niet omdat het prettig is. Maar omdat de richting ertoe doet.',
        'Je oude vaardigheden helpen hier. Afstand nemen van gedachten. Ruimte maken voor gevoelens. Je adem als anker.'
      ],
      metaphorCard: {
        title: 'De moerasoversteek',
        text: 'Niemand loopt voor zijn plezier door een moeras. Maar ligt er aan de overkant iets dat ertoe doet? Dan ga je. De modder hoort bij de weg.',
        art: 'stroom'
      },
      exercise: {
        title: 'Je barrière voorzien',
        steps: [
          { n: 1, title: 'Kies je stap', text: 'Denk aan de kleine stap uit les 1. Die van deze week.', seconds: 20 },
          { n: 2, title: 'Wat zegt je hoofd?', text: 'Welke gedachte duikt op? "Het lukt toch niet." "Doe het morgen." Schrijf er één op.', seconds: 45 },
          { n: 3, title: 'Wat voelt je lijf?', text: 'Wat merk je in je lichaam bij die stap? Spanning, zwaarte, onrust? Benoem het zachtjes.', seconds: 45 },
          { n: 4, title: 'Kies je vaardigheid', text: 'Kies één ding dat je dan helpt. Je adem volgen. De gedachte benoemen. Even gronden.', seconds: 30 }
        ]
      },
      reflection: 'Barrières zijn geen stopborden. Het zijn borden langs de weg: hier wordt het spannend. En daarom is het de moeite waard.',
      assignment: 'Doe deze week één keer je stap mét de spanning erbij. Merk op: de gevoelens gingen mee, en het lukte toch.',
      relatedSkillIds: ['afstand-observeren', 'ademanker'],
      flashcardIds: ['w08-l02-f1', 'w08-l02-f2', 'w08-l02-f3']
    },
    {
      id: 'w08-l03',
      weekId: 'w08',
      order: 3,
      kind: 'oefening',
      title: 'Je eerste stap zetten',
      minutes: 7,
      tags: ['Toegewijd handelen', 'Actieplan'],
      intro: [
        'Nu maak je je eigen actieplan. In ACT heet dat een ACTieplan: een plan dat past bij jouw waarden.',
        'Een goed plan is klein, concreet en haalbaar, met een vast moment erbij. En het hoort bij iets dat jou belangrijk is.',
        'Je maakt ook een als-dan-plan. Daarmee bedenk je nú al wat je doet op het moment zelf. Dat maakt slagen veel makkelijker.'
      ],
      exercise: {
        title: 'Je ACTieplan in vijf stappen',
        steps: [
          { n: 1, title: 'Kies je waarde', text: 'Kies één waarde uit je kompas van week 7.', seconds: 20 },
          { n: 2, title: 'Kies je stap', text: 'Kies één kleine stap die bij die waarde past. Zo klein dat je hem bijna niet kunt missen.', seconds: 45 },
          { n: 3, title: 'Maak hem concreet', text: 'Wat doe je precies? Waar? Hoe lang? Schrijf het op in één zin.', seconds: 45 },
          { n: 4, title: 'Maak je als-dan-plan', text: 'Vul in: "Als het [moment] is, dan doe ik [mijn stap]." Bijvoorbeeld: "Als de afwas klaar is, dan bel ik mijn broer."', seconds: 60 },
          { n: 5, title: 'Bedenk je plan B', text: 'Wat als het niet lukt? Kies een kleinere versie van je stap. Dan heb je altijd een weg vooruit.', seconds: 30 }
        ]
      },
      reflection: 'Je plan hoeft niet mooi te zijn, maar wel van jou. Een klein plan dat je echt doet, werkt beter dan een perfect plan op papier.',
      assignment: 'Voer je als-dan-plan deze week één keer uit. Schrijf daarna op: wat lukte, en wat was lastig?',
      relatedSkillIds: [],
      flashcardIds: ['w08-l03-f1', 'w08-l03-f2', 'w08-l03-f3']
    },
    {
      id: 'w08-l04',
      weekId: 'w08',
      order: 4,
      kind: 'herhaling',
      title: 'Terugblik op je week',
      minutes: 4,
      tags: ['Terugblik'],
      intro: [
        'Deze week maakte je van je waarden echte stappen. Je leerde over bereidheid, barrières en je ACTieplan.',
        'Terugkijken hoort bij leren. Niet om te oordelen. Maar om te zien wat werkt voor jou.'
      ],
      exercise: {
        title: 'Terugblik in drie stappen',
        steps: [
          { n: 1, title: 'Wat heb je gedaan?', text: 'Welke stap heb je gezet, of geprobeerd? Proberen telt ook.', seconds: 30 },
          { n: 2, title: 'Wat merkte je?', text: 'Wat gebeurde er binnenin? Spanning, trots, teleurstelling? Alles mag benoemd worden.', seconds: 45 },
          { n: 3, title: 'Wat is je volgende stap?', text: 'Kies: dezelfde stap nog eens, een kleinere versie, of iets nieuws bij een andere waarde.', seconds: 30 }
        ]
      },
      reflection: 'Toegewijd handelen is nooit af. Elke week mag je opnieuw kiezen: dit is mijn richting, en dit is mijn stap.',
      assignment: 'Houd je ACTieplan actief. Kies voor volgende week één stap bij één waarde. Klein is goed genoeg.',
      relatedSkillIds: [],
      flashcardIds: ['w08-l04-f1', 'w08-l04-f2']
    }
  ]
};

/** Flashcards voor week 8 (ids: w08-lMM-fK). */
export const week08Flashcards: Flashcard[] = [
  {
    id: 'w08-l01-f1',
    lessonId: 'w08-l01',
    front: 'Wat is toegewijd handelen?',
    back: 'Kleine dingen doen die passen bij jouw waarden. Niet perfect, wel echt. Stap voor stap, ook als het moeilijk is.'
  },
  {
    id: 'w08-l01-f2',
    lessonId: 'w08-l01',
    front: 'Wat doe je als een stap te groot voelt?',
    back: 'Maak hem kleiner. Deel hem in twee, en nog eens. Tot je iets hebt dat je deze week echt kunt doen.'
  },
  {
    id: 'w08-l02-f1',
    lessonId: 'w08-l02',
    front: 'Wat betekent bereidheid?',
    back: 'Je doet wat ertoe doet mét je moeilijke gevoelens erbij. Je wacht niet tot de spanning weg is.'
  },
  {
    id: 'w08-l02-f2',
    lessonId: 'w08-l02',
    front: 'Wat doe je met een gedachte als "het lukt toch niet"?',
    back: 'Neem afstand: "Ik heb de gedachte dat het niet lukt." Dan kies je toch je stap. De gedachte mag mee, maar hij stuurt niet.'
  },
  {
    id: 'w08-l02-f3',
    lessonId: 'w08-l02',
    skillId: 'afstand-observeren',
    front: 'Welke vaardigheden helpen bij barrières?',
    back: 'Je adem als anker. Gedachten benoemen. Gronden met je zintuigen. Kies er één die bij jou past.'
  },
  {
    id: 'w08-l03-f1',
    lessonId: 'w08-l03',
    front: 'Wat is een ACTieplan?',
    back: 'Een klein, concreet plan dat past bij jouw waarde. Met een wat, een waar en een moment erbij. Zo wordt een waarde een echte stap.'
  },
  {
    id: 'w08-l03-f2',
    lessonId: 'w08-l03',
    front: 'Hoe werkt een als-dan-plan?',
    back: 'Je koppelt je stap aan een vast moment: "Als het zover is, dan doe ik mijn stap." Zo hoef je op het moment zelf niet meer te twijfelen.'
  },
  {
    id: 'w08-l03-f3',
    lessonId: 'w08-l03',
    front: 'Wat doe je als je plan niet lukt?',
    back: 'Geen ramp. Gebruik je plan B: een kleinere versie van je stap. En kijk zonder oordeel wat er in de weg zat. Dat is informatie, geen falen.'
  },
  {
    id: 'w08-l04-f1',
    lessonId: 'w08-l04',
    front: 'Wat was de kern van week 8?',
    back: 'Van waarde naar actie. Kleine stappen in jouw richting, mét je gevoelens erbij. Met een als-dan-plan en een plan B.'
  },
  {
    id: 'w08-l04-f2',
    lessonId: 'w08-l04',
    front: 'Hoe ga je na deze week verder?',
    back: 'Blijf elke week één kleine stap kiezen bij een waarde. Lukt het niet? Maak de stap kleiner en kijk zonder oordeel opnieuw.'
  }
];
