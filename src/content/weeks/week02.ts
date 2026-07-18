import type { Week, Flashcard } from '../types';

/**
 * Week 2 — Hier en nu & observeren.
 * Contact met het huidige moment, basis van aandacht (mindfulness),
 * de VERS-vaardigheid "afstand nemen en observeren" (+ beschrijven in
 * gewone woorden), je zintuigen als anker, en een eerste foto van één moment in de
 * terugblik. Les w02-l03 is de stage-1 voorbeeldles, ongewijzigd overgenomen.
 */
export const week02: Week = {
  id: 'w02',
  number: 2,
  title: 'Hier en nu & observeren',
  tagline: 'Leren kijken naar wat er nu is, zonder er meteen iets mee te moeten.',
  lessons: [
    {
      id: 'w02-l01',
      weekId: 'w02',
      order: 1,
      kind: 'lesson',
      title: 'Aandacht: wat is dat eigenlijk?',
      minutes: 5,
      tags: ['Hier en nu'],
      intro: [
        'Je hoofd is vaak als een tijdmachine. Het reist naar gisteren: wat er misging. Of naar morgen: wat er allemaal kan komen.',
        'Maar je leven gebeurt op één plek: hier, nu. In dit moment. Je aandacht is de knop waarmee je terugkomt.',
        'Aandacht betekent: merken wat er nú is. Wat je ziet, hoort en voelt. Zonder er meteen iets van te vinden.',
        'Dat klinkt simpel. En het is ook simpel. Maar het vraagt wel oefening. Je hoofd dwalt vanzelf weer weg. Dat hoort erbij.'
      ],
      metaphorCard: {
        title: 'De automatische piloot',
        text: 'Vaak doe je dingen op de automatische piloot: je eet, loopt of luistert terwijl je hoofd ergens anders is. Aandacht oefenen is even terug in de cockpit stappen.',
        art: 'mist'
      },
      exercise: {
        title: 'Eén minuut hier',
        steps: [
          { n: 1, title: 'Kijk om je heen', text: 'Kijk rustig om je heen. Noem in je hoofd drie dingen die je ziet.', seconds: 30 },
          { n: 2, title: 'Luister', text: 'Kijk zacht voor je uit of doe je ogen dicht. Welke geluiden hoor je, dichtbij en ver weg?', seconds: 30 },
          { n: 3, title: 'Terug naar nu', text: 'Voel je voeten op de grond. Voel de stoel of de vloer. Je bent hier, nu.', seconds: 15 }
        ]
      },
      reflection: 'Misschien dwalde je af. Misschien niet. Allebei is prima. Aandacht oefenen is telkens zachtjes terugkomen.',
      assignment: 'Doe deze week elke dag één ding met volle aandacht. Bijvoorbeeld je koffie drinken of je handen wassen. Alleen dat ene ding.',
      relatedSkillIds: [],
      flashcardIds: ['w02-l01-f1', 'w02-l01-f2']
    },
    {
      id: 'w02-l02',
      weekId: 'w02',
      order: 2,
      kind: 'lesson',
      title: 'Observeren zonder te oordelen',
      minutes: 6,
      tags: ['Afstand & observeren'],
      intro: [
        'Je kunt naar je gevoelens kijken zoals een verslaggever naar het nieuws kijkt. Je meldt alleen wat er is. Niet of het goed of slecht is.',
        'Dat heet observeren. Je merkt op: dit gevoel is er. Deze gedachte komt langs. Je hoeft er niet meteen iets mee.',
        'Daarna beschrijf je het in gewone woorden. Bijvoorbeeld: "Ik merk dat ik spanning voel." Of: "Ik merk de gedachte dat ik het niet kan."',
        'Zo maak je een beetje afstand. Je gevoel is er nog, maar je zit er niet meer middenin. Je kijkt ernaar, als naar wolken die voorbijtrekken.'
      ],
      metaphorCard: {
        title: 'De verslaggever in je hoofd',
        text: 'Een verslaggever meldt alleen wat er gebeurt. Zo kun jij ook naar binnen kijken: benoemen wat er is, zonder er een oordeel aan te hangen.',
        art: 'mist'
      },
      exercise: {
        title: 'Observeren en benoemen',
        steps: [
          { n: 1, title: 'Stop even', text: 'Pauzeer. Doe je ogen dicht of kijk zacht voor je uit. Je hoeft niets op te lossen.', seconds: 20 },
          { n: 2, title: 'Kijk naar binnen', text: 'Wat is er nu? Een gevoel? Een gedachte? Iets in je lijf? Kijk rustig, zonder oordeel.', seconds: 45 },
          { n: 3, title: 'Benoem het', text: 'Zeg in je hoofd: "Ik merk dat ik ... voel." Of: "Ik merk de gedachte dat ..." Gebruik je eigen woorden.', seconds: 45 },
          { n: 4, title: 'Kijk als naar wolken', text: 'Blijf even kijken naar wat je benoemde. Alsof het een wolk is die voorbijkomt. Je hoeft er niets mee te doen.', seconds: 30 }
        ]
      },
      reflection: 'Lukte het niet helemaal? Ook goed. Observeren is een vaardigheid. Die groeit door te oefenen, niet door het perfect te doen.',
      assignment: 'Benoem deze week elke dag één keer wat je voelt. Gebruik de zin: "Ik merk dat ik ..." Dat is alles.',
      relatedSkillIds: ['afstand-observeren'],
      flashcardIds: ['w02-l02-f1', 'w02-l02-f2', 'w02-l02-f3']
    },
    {
      id: 'w02-l03',
      weekId: 'w02',
      order: 3,
      kind: 'lesson',
      title: 'Ademhalen met aandacht',
      minutes: 7,
      tags: ['Adem & aandacht'],
      intro: [
        'Je adem is altijd bij je. Waar je ook bent, je kunt er altijd even naar kijken.',
        'In deze les oefen je om je aandacht zachtjes bij je adem te houden. Zo leer je spanning opmerken, zonder er meteen iets mee te hoeven.'
      ],
      metaphorCard: {
        title: 'De golf en het strand',
        text: 'Je adem is als een golf: hij komt en gaat vanzelf. Jij hoeft niets te sturen. Je mag op het strand zitten en gewoon kijken.',
        art: 'golf'
      },
      exercise: {
        title: 'Adem volgen in 4 stappen',
        steps: [
          { n: 1, title: 'Ga rustig zitten', text: 'Zit of sta ergens rustig. Leg één hand op je buik. Je ogen mogen open of dicht.', seconds: 20 },
          { n: 2, title: 'Voel je adem', text: 'Voel hoe je buik omhoog en omlaag gaat. Je hoeft niet dieper te ademen. Gewoon voelen wat er al is.', seconds: 60 },
          { n: 3, title: 'Afdwalen is oké', text: 'Je gedachten gaan vanzelf ergens anders heen. Dat hoort erbij. Merk het op en kom zachtjes terug naar je adem.', seconds: 60 },
          { n: 4, title: 'Rond zachtjes af', text: 'Neem één rustige ademhaling. Kijk om je heen. Voel: je bent hier, nu.', seconds: 15 }
        ]
      },
      reflection: 'Wat viel je op? Misschien werd je rustig, misschien juist niet. Allebei is goed. Het opmerken ís de oefening.',
      assignment: 'Oefen deze week elke dag 2 minuten met je adem. Bijvoorbeeld bij het koffiezetten of voor het slapen gaan.',
      relatedSkillIds: ['ademanker'],
      flashcardIds: ['fc-w02-l03-a', 'fc-w02-l03-b']
    },
    {
      id: 'w02-l04',
      weekId: 'w02',
      order: 4,
      kind: 'oefening',
      title: 'Je zintuigen als anker',
      minutes: 5,
      tags: ['Gronden 5-4-3-2-1'],
      intro: [
        'Soms wordt het te veel in je hoofd. Dan helpt het om terug te gaan naar je zintuigen. Die zijn altijd in het nu.',
        'Deze oefening heet 5-4-3-2-1. Je telt rustig af via je ogen, oren en lijf. Zo kom je met beide voeten op de grond.',
        'Hij werkt ook als je pannetje al warm is. Zelfs bij pan 4 of 5 kun je hem proberen.'
      ],
      exercise: {
        title: '5-4-3-2-1 gronden',
        steps: [
          { n: 1, title: 'Adem rustig', text: 'Ga zitten of staan. Neem één kalme ademhaling. Je hoeft niets weg te duwen.', seconds: 20 },
          { n: 2, title: 'Vijf dingen zien', text: 'Kijk om je heen. Noem vijf dingen die je ziet. Klein is prima.', seconds: 45 },
          { n: 3, title: 'Vier dingen horen', text: 'Luister. Noem vier geluiden. Dichtbij of ver weg, het maakt niet uit.', seconds: 40 },
          { n: 4, title: 'Drie dingen voelen', text: 'Voel drie dingen: de stoel, je kleding, de grond onder je voeten.', seconds: 40 },
          { n: 5, title: 'Twee dingen ruiken', text: 'Ruik rustig. Noem twee geuren. Geen geur bij je? Ruik aan je koffie of je handen.', seconds: 30 },
          { n: 6, title: 'Eén ding proeven', text: 'Proef één ding. Een slokje water, of gewoon de smaak in je mond.', seconds: 20 }
        ]
      },
      reflection: 'Hoe voel je je nu? Een beetje stiller, of niet? Allebei is oké. Je hebt geoefend, en dat telt.',
      assignment: 'Oefen 5-4-3-2-1 deze week twee keer op een rustig moment. Zo is hij er ook als het eens drukker wordt.',
      relatedSkillIds: ['gronden-54321'],
      flashcardIds: ['w02-l04-f1', 'w02-l04-f2']
    },
    {
      id: 'w02-l05',
      weekId: 'w02',
      order: 5,
      kind: 'herhaling',
      title: 'Terugblik op je week',
      minutes: 4,
      tags: ['Terugblik'],
      intro: [
        'Week twee zit er bijna op. Tijd om rustig terug te kijken. Niet om te toetsen, maar om te leren.',
        'Kijk naar je check-ins van deze week. Welke pannen kwamen voor? Zie je een patroon?',
        'Kies één moment waarop je gevoel omhoogging. Daar maken we nu een "foto" van: een stilstaand beeld van één moment, dat je van een afstandje bekijkt.'
      ],
      exercise: {
        title: 'Een foto van één moment',
        steps: [
          { n: 1, title: 'Kies je moment', text: 'Kies één moment deze week waarop je gevoel steeg. Rustig kiezen. Het mag een klein moment zijn.', seconds: 30 },
          { n: 2, title: 'Wat gebeurde er?', text: 'Beschrijf kort wat er gebeurde. Alsof je een foto beschrijft: wie, wat, waar. Alleen feiten.', seconds: 45 },
          { n: 3, title: 'Wat voelde en dacht je?', text: 'In welke pan zat je? Wat voelde je in je lijf? Welke gedachten kwamen langs?', seconds: 45 },
          { n: 4, title: 'Wat hielp, wat nu?', text: 'Wat deed je toen? Hielp dat een beetje? Wat zou je een volgende keer kunnen proberen?', seconds: 45 }
        ]
      },
      reflection: 'Terugkijken is geen bekritiseren. Je bekeek jezelf met vriendelijke ogen. Daar word je wijzer van, week na week.',
      assignment: 'Houd volgende week je dagelijkse check-ins vol. Gebruik ook eens één van je nieuwe oefeningen: adem, aandacht of 5-4-3-2-1.',
      relatedSkillIds: [],
      flashcardIds: ['w02-l05-f1', 'w02-l05-f2']
    }
  ]
};

export const week02Flashcards: Flashcard[] = [
  {
    id: 'w02-l01-f1',
    lessonId: 'w02-l01',
    front: 'Wat betekent aandacht in deze cursus?',
    back: 'Merken wat er nu is: wat je ziet, hoort en voelt, zonder er meteen iets van te vinden. Je komt terug uit je tijdmachine naar hier en nu.'
  },
  {
    id: 'w02-l01-f2',
    lessonId: 'w02-l01',
    front: 'Je hoofd dwalt af tijdens een oefening. Wat dan?',
    back: 'Heel normaal. Zo werken hoofden. Merk het vriendelijk op en kom zachtjes terug. Dat terugkomen ís de oefening.'
  },
  {
    id: 'w02-l02-f1',
    lessonId: 'w02-l02',
    skillId: 'afstand-observeren',
    front: 'Wat is observeren zonder te oordelen?',
    back: 'Je merkt op wat er is, een gevoel of een gedachte, zonder het goed of slecht te vinden. Je kijkt als een verslaggever: alleen melden wat er gebeurt.'
  },
  {
    id: 'w02-l02-f2',
    lessonId: 'w02-l02',
    skillId: 'afstand-observeren',
    front: 'Welke zin helpt je om afstand te nemen?',
    back: '"Ik merk dat ik ... voel" of "Ik merk de gedachte dat ..." Zo beschrijf je wat er is, in plaats van erin mee te gaan.'
  },
  {
    id: 'w02-l02-f3',
    lessonId: 'w02-l02',
    skillId: 'afstand-observeren',
    front: 'Wat doet observeren met je gevoelens?',
    back: 'Ze blijven er, maar je zit er niet meer middenin. Je maakt een beetje afstand. Alsof je naar wolken kijkt die voorbijtrekken.'
  },
  {
    id: 'w02-l04-f1',
    lessonId: 'w02-l04',
    skillId: 'gronden-54321',
    front: 'Hoe werkt de oefening 5-4-3-2-1?',
    back: 'Noem 5 dingen die je ziet, 4 die je hoort, 3 die je voelt, 2 die je ruikt en 1 die je proeft. Zo brengen je zintuigen je terug naar nu.'
  },
  {
    id: 'w02-l04-f2',
    lessonId: 'w02-l04',
    skillId: 'gronden-54321',
    front: 'Wanneer gebruik je 5-4-3-2-1?',
    back: 'Als het te veel in je hoofd wordt, ook bij een warm pannetje. Oefen hem eerst op rustige momenten, dan werkt hij beter als het erom gaat.'
  },
  {
    id: 'w02-l05-f1',
    lessonId: 'w02-l05',
    front: 'Wat is een foto van één moment?',
    back: 'Een stilstaand beeld van één moment waarop je gevoel steeg. Je bekijkt het op afstand: wat gebeurde er, wat voelde je, wat deed je, wat hielp.'
  },
  {
    id: 'w02-l05-f2',
    lessonId: 'w02-l05',
    front: 'Waarom kijk je elke week terug?',
    back: 'Niet om jezelf te beoordelen, maar om te leren. Je ziet patronen in je pannen. En je ontdekt wat voor jou werkt.'
  }
];
