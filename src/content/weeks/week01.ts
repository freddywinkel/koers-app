import type { Week, Flashcard } from '../types';

/**
 * Week 1 — Start & inzicht.
 * Onboarding: wat is deze cursus, wat zijn ACT en VERS, het pannetjesmodel,
 * de eerste dagelijkse check-in en hoe de app werkt.
 * Geschreven volgens src/content/README.md (B1, warm, oefening-eerst).
 */
export const week01: Week = {
  id: 'w01',
  number: 1,
  title: 'Start & inzicht',
  tagline: 'Kennismaken met de cursus en met het pannetjesmodel.',
  lessons: [
    {
      id: 'w01-l01',
      weekId: 'w01',
      order: 1,
      kind: 'lesson',
      title: 'Welkom bij Koers',
      minutes: 5,
      intro: [
        'Welkom. Fijn dat je er bent. Deze cursus helpt je om beter om te gaan met sterke gevoelens.',
        'Iedereen kent het gevoel dat te groot lijkt. Boosheid die oplaait. Verdriet dat blijft hangen. Als dat vaak gebeurt, kost het veel energie.',
        'Je leert hier twee dingen. Met ACT oefen je om gevoelens en gedachten ruimte te geven, in plaats van ertegen te vechten. Met VERS leer je vaardigheden om je emoties stap voor stap rustiger te maken.',
        'Je oefent elke dag een beetje, ongeveer 10 tot 20 minuten. Elke dag een klein beetje werkt beter dan af en toe veel.'
      ],
      reflection: 'Je hoeft nu nog niets te kunnen. Nieuwsgierig beginnen is genoeg voor vandaag.',
      assignment: 'Kijk vandaag rustig rond in de app, in je eigen tempo. Geen haast.',
      relatedSkillIds: [],
      flashcardIds: ['w01-l01-f1', 'w01-l01-f2']
    },
    {
      id: 'w01-l02',
      weekId: 'w01',
      order: 2,
      kind: 'lesson',
      title: 'Het pannetjesmodel',
      minutes: 6,
      tags: ['Pannetjesmodel'],
      intro: [
        'Stel je een pannetje melk op het fornuis voor. Soms staat het vuur uit. Soms begint het zachtjes te rimpelen. En soms kookt het over.',
        'Zo werken je gevoelens vaak ook. Ze kunnen stap voor stap oplopen, al kan dat soms heel snel gaan. Het helpt om jouw eerste signalen te leren kennen.',
        'Het pannetjesmodel heeft vijf pannen. Pan 1 is Rustig. Pan 2 is Rimpelt: er beweegt iets. Pan 3 is Borrelt: het wordt sterker. Pan 4 is Pruttelt: je voelt je echt niet fijn. Pan 5 is Kookt over: je verliest de grip.',
        'Het goede nieuws: op elke stap kun je iets doen. Hoe eerder je merkt in welke pan je zit, hoe meer keus je hebt. De vaardigheden uit deze cursus zijn het keukengerei waarmee je het vuur lager zet.'
      ],
      metaphorCard: {
        title: 'Pannetjes op het fornuis',
        text: 'Je gevoelens zijn als pannetjes melk. Ze warmen stap voor stap op: Rustig, Rimpelt, Borrelt, Pruttelt, Kookt over. Jij leert het vuur op tijd lager te zetten.',
        art: 'mist'
      },
      reflection: 'Iedereen zit weleens in elke pan. Ook in pan 4 of 5. Daar is niets mis mee. Het gaat erom dat je leert merken waar je zit.',
      assignment: 'Let deze week eens op: in welke pan zit je op rustige momenten? En op drukke momenten? Alleen maar kijken, verder niets.',
      relatedSkillIds: [],
      flashcardIds: ['w01-l02-f1', 'w01-l02-f2', 'w01-l02-f3']
    },
    {
      id: 'w01-l03',
      weekId: 'w01',
      order: 3,
      kind: 'oefening',
      title: 'Je eerste check-in',
      minutes: 3,
      tags: ['Check-in'],
      intro: [
        'Vanaf vandaag doe je elke dag een korte check-in. Dat duurt nog geen minuut.',
        'Je stopt even en vraagt: in welk pannetje zit ik nu? Je kiest pan 1 tot en met 5. Meer hoeft niet.',
        'Door elke dag te kijken, leer je je gevoelens steeds beter kennen. Je gaat patronen zien. En je merkt eerder dat een pannetje warmer wordt.'
      ],
      exercise: {
        title: 'Je eerste check-in',
        steps: [
          { n: 1, title: 'Stop even', text: 'Zet wat je doet even op pauze. Haal één keer rustig adem.', seconds: 15 },
          { n: 2, title: 'Kijk naar binnen', text: 'Vraag jezelf af: hoe voel ik me nu? Rustig, of borrelt er iets? Alles mag er zijn.', seconds: 30 },
          { n: 3, title: 'Kies je pan', text: 'Kies het pannetje dat het beste past: Rustig, Rimpelt, Borrelt, Pruttelt of Kookt over. Gok gerust, het hoeft niet perfect.', seconds: 20 },
          { n: 4, title: 'Klaar', text: 'Dat was het. Je hebt vandaag naar jezelf gekeken. Precies goed.', seconds: 10 }
        ]
      },
      reflection: 'Er is geen goed of fout antwoord. Pan 3 is net zo welkom als pan 1. Het kijken telt, niet de uitslag.',
      assignment: 'Doe deze week elke dag één check-in. Koppel hem aan iets dat je toch al doet, zoals koffie zetten of tandenpoetsen.',
      relatedSkillIds: [],
      flashcardIds: ['w01-l03-f1', 'w01-l03-f2']
    },
    {
      id: 'w01-l04',
      weekId: 'w01',
      order: 4,
      kind: 'lesson',
      title: 'Zo werkt deze cursus',
      minutes: 4,
      intro: [
        'De cursus duurt twaalf weken. Elke week heeft een eigen thema, met een paar korte lessen en oefeningen.',
        'Zo ziet je week eruit: je doet elke dag je check-in. Je volgt de lessen in je eigen tempo. En je oefent in je dagelijks leven met een kleine opdracht.',
        'Flashcards helpen je onthouden wat je leerde. Bij Oefenen vind je al je vaardigheden terug. Die kun je altijd gebruiken.',
        'Sla je een dag over? Geen probleem. Je pikt de draad gewoon weer op. Deze cursus is geen toets. Hij is er voor jou.'
      ],
      reflection: 'Deze cursus is zelfhulp, geen behandeling. Merk je dat het te zwaar wordt? Praat dan met je huisarts of behandelaar. Steun vragen is sterk.',
      assignment: 'Kies vandaag jouw vaste moment voor de check-in. Zeg tegen jezelf: "Na het ... doe ik mijn check-in."',
      relatedSkillIds: [],
      flashcardIds: ['w01-l04-f1', 'w01-l04-f2']
    }
  ]
};

export const week01Flashcards: Flashcard[] = [
  {
    id: 'w01-l01-f1',
    lessonId: 'w01-l01',
    front: 'Waar helpt deze cursus je mee?',
    back: 'Je leert beter omgaan met sterke gevoelens. Je oefent om ze ruimte te geven (ACT) en je leert vaardigheden om ze rustiger te maken (VERS).'
  },
  {
    id: 'w01-l01-f2',
    lessonId: 'w01-l01',
    front: 'Hoeveel oefen je per dag?',
    back: 'Ongeveer 10 tot 20 minuten. Elke dag een beetje werkt beter dan af en toe veel. Kleine stappen zijn prima.'
  },
  {
    id: 'w01-l02-f1',
    lessonId: 'w01-l02',
    front: 'Noem de vijf pannen van het pannetjesmodel.',
    back: 'Pan 1 Rustig, pan 2 Rimpelt, pan 3 Borrelt, pan 4 Pruttelt, pan 5 Kookt over. Je gevoelens lopen meestal stap voor stap op.'
  },
  {
    id: 'w01-l02-f2',
    lessonId: 'w01-l02',
    front: 'Waarom helpt het om te weten in welke pan je zit?',
    back: 'Emoties lopen meestal in stappen op, niet in één keer. Hoe eerder je merkt waar je zit, hoe eerder je iets kunt doen. Op elke stap heb je keus.'
  },
  {
    id: 'w01-l02-f3',
    lessonId: 'w01-l02',
    front: 'Wat is het keukengerei bij het pannetjesmodel?',
    back: 'Dat zijn de vaardigheden uit deze cursus. Daarmee zet je het vuur onder je pannetje lager, stap voor stap.'
  },
  {
    id: 'w01-l03-f1',
    lessonId: 'w01-l03',
    front: 'Wat is een check-in?',
    back: 'Een korte pauze waarin je kijkt hoe je je voelt. Je vraagt: in welk pannetje zit ik nu? Nog geen minuut werk.'
  },
  {
    id: 'w01-l03-f2',
    lessonId: 'w01-l03',
    front: 'Hoe maak je van de check-in een gewoonte?',
    back: 'Koppel hem aan iets dat je al elke dag doet. Bijvoorbeeld na het tandenpoetsen of bij je eerste kopje koffie.'
  },
  {
    id: 'w01-l04-f1',
    lessonId: 'w01-l04',
    front: 'Hoe is een week in deze cursus opgebouwd?',
    back: 'Elke dag een korte check-in. Een paar korte lessen per week, in je eigen tempo. En een kleine opdracht om in je dagelijks leven te oefenen.'
  },
  {
    id: 'w01-l04-f2',
    lessonId: 'w01-l04',
    front: 'Wat als je een dag overslaat?',
    back: 'Helemaal niets ergs. Eén dag missen remt je niet. Je pikt de draad de volgende dag weer op, zonder schuldgevoel.'
  }
];
