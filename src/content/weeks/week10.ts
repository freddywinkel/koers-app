import type { Week, Flashcard } from '../types';

/**
 * Week 10 — Leven in balans
 * --------------------------
 * De VERS-gedragsvaardigheden: balans herstellen over de leefdomeinen
 * eten, slapen, bewegen, gezondheid, vrije tijd, werk/dagbesteding,
 * financiën en relaties. Zelfinschatting (domeinenkaart) + kleine,
 * geplande stappen per domein. Grenzen bewaken hoort erbij.
 * De integrator koppelt dit bestand aan curriculum.ts en flashcards.ts.
 */
export const week10: Week = {
  id: 'w10',
  number: 10,
  title: 'Leven in balans',
  tagline: 'Zorgen voor wat je energie geeft, grenzen bewaken.',
  lessons: [
    {
      id: 'w10-l01',
      weekId: 'w10',
      order: 1,
      kind: 'lesson',
      title: 'Wat kost en geeft energie?',
      minutes: 6,
      tags: ['Balans & energie'],
      intro: [
        'Emoties zijn zwaarder om te dragen als je basis wiebelt. Slecht slapen, onregelmatig eten, geen ontspanning: dan gaat je pannetje sneller omhoog.',
        'Daarom kijken we deze week naar acht gebieden uit je leven: eten, slapen, bewegen, gezondheid, vrije tijd, werk of dagbesteding, financiën en relaties.',
        'Er is ook een negende gebied: zelfbeschadiging voorkomen. Dat betekent: jezelf beschermen op de moeilijkste momenten. Daar geven we in week 11 alle aandacht aan, met een eigen plan. Voor nu is het genoeg om te weten dat dit gebied er is.',
        'Je maakt straks een kaart van die acht gebieden. Geen rapport en geen oordeel. Gewoon een foto van hoe het er nu voor staat.'
      ],
      metaphorCard: {
        title: 'Acht beekjes, één rivier',
        text: 'Je energie is een rivier, gevoed door acht beekjes. Stroomt er een tijd geen water in een beekje, dan wordt de rivier laag. Kijken welk beekje water nodig heeft: dat is deze week.',
        art: 'stroom'
      },
      exercise: {
        title: 'Jouw domeinenkaart',
        steps: [
          { n: 1, title: 'Lees de acht gebieden', text: 'Eten. Slapen. Bewegen. Gezondheid. Vrije tijd. Werk of dagbesteding. Financiën. Relaties. Lees ze rustig door.', seconds: 45 },
          { n: 2, title: 'Geef elk gebied een cijfer', text: 'Van 1 tot 5: hoe vol stroomt dit beekje nu? 1 is bijna droog, 5 is stroomt goed. Je gevoel mag kiezen.', seconds: 90 },
          { n: 3, title: 'Zoek de laagste twee', text: 'Welke twee gebieden scoren het laagst? Omcirkel ze. Dit is geen oordeel. Het is gewoon je kaart van nu.', seconds: 45 },
          { n: 4, title: 'Kies er één', text: 'Kies één gebied waar je deze week aandacht aan geeft. Niet het moeilijkste. Het gebied dat jou nu roept.', seconds: 30 }
        ]
      },
      reflection: 'Er bestaat geen goed of fout cijfer. De kaart laat alleen zien waar je energie stroomt en waar hij weglekt. Kijken is al genoeg voor vandaag.',
      assignment: 'Bewaar je kaart. Kijk er deze week elke dag even naar, vooral naar het gebied dat je koos. Alleen kijken is al voldoende.',
      relatedSkillIds: [],
      flashcardIds: ['w10-l01-f1', 'w10-l01-f2', 'w10-l01-f3']
    },
    {
      id: 'w10-l02',
      weekId: 'w10',
      order: 2,
      kind: 'lesson',
      title: 'Grenzen bewaken',
      minutes: 5,
      tags: ['Grenzen'],
      intro: [
        'Balans houden betekent ook: je energie beschermen. Elke keer ja zeggen kost iets. Te vaak ja, en je emmer loopt leeg.',
        'Een grens is geen muur. Het is meer een lijn die aangeeft: tot hier, en niet verder. En jij mag die lijn bewaken. Dat is geen onvriendelijkheid. Dat is zorg voor jezelf.',
        'Je lijf vertelt vaak als eerste dat een grens is bereikt. Moeheid. Boosheid. Het gevoel: weer ja gezegd. Die signalen zijn geen zwakte. Het is informatie.'
      ],
      metaphorCard: {
        title: 'De vloedlijn',
        text: 'Op het strand zie je de vloedlijn: tot daar komt de zee, en niet verder. Zo mag jij ook een lijn trekken. Rustig en duidelijk.',
        art: 'golf'
      },
      exercise: {
        title: 'Een vriendelijke nee oefenen',
        steps: [
          { n: 1, title: 'Een ja met een nee erin', text: 'Herinner je een moment waarop je ja zei, maar van binnen nee voelde.', seconds: 45 },
          { n: 2, title: 'Wat kostte dat je?', text: 'Tijd? Rust? Slaap? Schrijf het kort op. Zo zie je wat je beschermt.', seconds: 45 },
          { n: 3, title: 'Schrijf je nee op', text: 'Kort en vriendelijk. Bijvoorbeeld: "Dat past nu niet voor me." Een lange uitleg hoeft niet.', seconds: 60 },
          { n: 4, title: 'Oefen hem hardop', text: 'Zeg je zin een paar keer, hardop of in je hoofd. Kort is krachtig. Je stem mag zacht blijven.', seconds: 45 }
        ]
      },
      reflection: 'Een nee tegen een verzoek is vaak een ja tegen iets belangrijks: je rust, je gezin, je herstel. Jij kiest waar je energie heen gaat.',
      assignment: 'Let er deze week op waar je ja zegt terwijl je nee voelt. Alleen opmerken is genoeg. Lukt het? Oefen dan één keer een kleine, vriendelijke nee.',
      relatedSkillIds: [],
      flashcardIds: ['w10-l02-f1', 'w10-l02-f2', 'w10-l02-f3']
    },
    {
      id: 'w10-l03',
      weekId: 'w10',
      order: 3,
      kind: 'oefening',
      title: 'Je week in balans plannen',
      minutes: 8,
      tags: ['Plannen', 'Balans & energie'],
      intro: [
        'Je hebt een kaart van je acht gebieden. Nu ga je ermee aan de slag. Niet met grote plannen, maar met kleine stappen.',
        'Klein werkt beter dan groot. Elke dag tien minuten wandelen doet meer dan een sportplan dat nergens van komt.',
        'En vergeet het fijnste deel niet: je plant ook iets dat je energie geeft. Dat is geen luxe. Dat is onderhoud.'
      ],
      metaphorCard: {
        title: 'Eb en vloed',
        text: 'Balans is als eb en vloed: geven en nemen wisselen elkaar af. Jij plant ze allebei in je week: geven én ontvangen.',
        art: 'golf'
      },
      exercise: {
        title: 'Eén klein stapje inplannen',
        steps: [
          { n: 1, title: 'Pak je domeinenkaart', text: 'Kijk naar je kaart uit de eerste les van deze week.', seconds: 20 },
          { n: 2, title: 'Kies één gebied', text: 'Niet het moeilijkste. Kies het gebied dat je nu aandacht wilt geven.', seconds: 30 },
          { n: 3, title: 'Bedenk een piepklein stapje', text: 'Zo klein dat hij bijna altijd lukt. Bij slapen: om elf uur de telefoon weg. Bij bewegen: tien minuten wandelen.', seconds: 60 },
          { n: 4, title: 'Plan hem concreet', text: 'Welke dag? Welk moment van de dag? Schrijf het op. Vage plannen verdwijnen vanzelf.', seconds: 45 },
          { n: 5, title: 'Plan ook iets fijns', text: 'Kies één ding dat je energie geeft. Een bad, een goed gesprek, muziek. Plan dat ook. Het is onderhoud, geen luxe.', seconds: 45 },
          { n: 6, title: 'Kijk later vriendelijk terug', text: 'Aan het einde van de week kijk je terug. Gelukt? Fijn. Niet gelukt? Dan was de stap te groot. Maak hem kleiner en probeer opnieuw.', seconds: 45 }
        ]
      },
      reflection: 'Balans is geen eindpunt dat je bereikt. Het is een ritme dat je elke week opnieuw stemt. Kleine stappen tellen echt.',
      assignment: 'Voer je twee geplande stappen uit deze week: je kleine stap en je fijne moment. Vink ze af. En neem even de tijd om ze te vieren, hoe klein ook.',
      relatedSkillIds: [],
      flashcardIds: ['w10-l03-f1', 'w10-l03-f2', 'w10-l03-f3']
    },
    {
      id: 'w10-l04',
      weekId: 'w10',
      order: 4,
      kind: 'herhaling',
      title: 'Terugblik op je week',
      minutes: 4,
      tags: ['Terugblik'],
      intro: [
        'Je keek deze week naar je acht leefgebieden. Je oefende met grenzen. En je plantte kleine stappen.',
        'Nu kijk je terug met een zachte blik. Niet om te cijferen, maar om te zien wat jou helpt.'
      ],
      exercise: {
        title: 'Terugkijken met een zachte blik',
        steps: [
          { n: 1, title: 'Vink je stappen af', text: 'Welke stappen uit je weekplan heb je gezet? Vink ze af, ook de kleinste.', seconds: 45 },
          { n: 2, title: 'Wat stroomde goed?', text: 'Welk gebied ging deze week goed? Wat hielp daarbij? Dat wil je onthouden.', seconds: 60 },
          { n: 3, title: 'Kies je volgende stapje', text: 'Welk gebied vraagt volgende week aandacht? Kies alvast één klein stapje.', seconds: 45 }
        ]
      },
      reflection: 'Je bouwt aan een ritme dat bij jou past. Dat gaat met vallen en opstaan, en dat is normaal. Elke week opnieuw kijken: dát is de vaardigheid.',
      assignment: 'Maak er een vast moment van: neem elke week tien minuten om je domeinenkaart in te vullen en één klein stapje te kiezen. Bijvoorbeeld op zondag.',
      relatedSkillIds: [],
      flashcardIds: ['w10-l04-f1', 'w10-l04-f2']
    }
  ]
};

export const week10Flashcards: Flashcard[] = [
  {
    id: 'w10-l01-f1',
    lessonId: 'w10-l01',
    front: 'Welke acht gebieden horen bij een leven in balans?',
    back: 'Eten, slapen, bewegen, gezondheid, vrije tijd, werk of dagbesteding, financiën en relaties. Er is ook een negende gebied: zelfbeschadiging voorkomen. Daar besteedt week 11 extra aandacht aan.'
  },
  {
    id: 'w10-l01-f2',
    lessonId: 'w10-l01',
    front: 'Waarom helpen deze gebieden bij je gevoelens?',
    back: 'Als je basis stevig is, kunnen je lijf en hoofd meer hebben. Je pannetje gaat dan minder snel omhoog.'
  },
  {
    id: 'w10-l01-f3',
    lessonId: 'w10-l01',
    front: 'Hoe maak je een domeinenkaart?',
    back: 'Geef elk van de acht gebieden een cijfer van 1 tot 5: hoe vol stroomt dit gebied nu? De laagste scores vragen aandacht. Zonder oordeel.'
  },
  {
    id: 'w10-l02-f1',
    lessonId: 'w10-l02',
    front: 'Hoe herken je dat een grens is overschreden?',
    back: 'Vaak aan signalen als moeheid, boosheid of het gevoel "weer ja gezegd". Die signalen zijn geen zwakte. Het is informatie.'
  },
  {
    id: 'w10-l02-f2',
    lessonId: 'w10-l02',
    front: 'Waarom is nee zeggen goed voor je balans?',
    back: 'Elke ja kost energie. Een vriendelijke nee houdt ruimte vrij voor wat jij belangrijk vindt.'
  },
  {
    id: 'w10-l02-f3',
    lessonId: 'w10-l02',
    front: 'Hoe klinkt een korte, vriendelijke nee?',
    back: 'Bijvoorbeeld: "Dat past nu niet voor me." Kort en duidelijk is genoeg. Een lange uitleg of excuses hoeven niet.'
  },
  {
    id: 'w10-l03-f1',
    lessonId: 'w10-l03',
    front: 'Hoe klein mag een stap zijn?',
    back: 'Zo klein dat hij bijna altijd lukt. Tien minuten wandelen telt. Klein en vaak werkt beter dan groot en eenmalig.'
  },
  {
    id: 'w10-l03-f2',
    lessonId: 'w10-l03',
    front: 'Wat doe je als een stap niet lukte?',
    back: 'Niet oordelen, maar verkleinen. De stap was te groot voor deze week. Maak hem kleiner en probeer het opnieuw.'
  },
  {
    id: 'w10-l03-f3',
    lessonId: 'w10-l03',
    front: 'Waarom plan je ook iets leuks of fijns?',
    back: 'Dingen die energie geven zijn onderhoud, geen luxe. Ze vullen je emmer bij, zodat jij meer aankunt.'
  },
  {
    id: 'w10-l04-f1',
    lessonId: 'w10-l04',
    front: 'Wat is balans eigenlijk?',
    back: 'Geen perfecte verdeling. Wel een ritme: steeds opnieuw aandacht voor eten, slapen, bewegen, gezondheid, vrije tijd, dagbesteding, financiën en relaties.'
  },
  {
    id: 'w10-l04-f2',
    lessonId: 'w10-l04',
    front: 'Hoe houd je balans vast na deze cursus?',
    back: 'Met een vast ritueel. Vul bijvoorbeeld elke zondag je domeinenkaart in en kies één klein stapje. Tien minuten is genoeg.'
  }
];
