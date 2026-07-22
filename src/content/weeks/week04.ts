import type { Week, Flashcard } from '../types';

/**
 * Week 4 — Defusie & gedachten.
 * Afstand nemen van gedachten: verstrengeling, defusie-technieken
 * (zin ervoor, bedank je brein, verhaal een naam geven, melk-melk-melk),
 * bladeren op de stroom, en de expliciete brug naar de VERS-vaardigheid
 * gedachten uitdagen: defusie is de eerste stap, uitdagen het alternatief
 * voor gedachten over controleerbare feiten (brug zit in w04-l02).
 * Metaforen: passagiers op de bus, bladeren op de stroom (originele teksten).
 * Gebaseerd op research/act-deep-dive.md (§2.2), research/vers-deep-dive.md
 * (§6.1 vaardigheid 3) en research/course-structure-literature.md (§7.2).
 * Geschreven volgens src/content/README.md (B1, warm, oefening-eerst).
 */
export const week04: Week = {
  id: 'w04',
  number: 4,
  title: 'Defusie & gedachten',
  tagline: 'Afstand nemen van gedachten die je tegenhouden.',
  lessons: [
    {
      id: 'w04-l01',
      weekId: 'w04',
      order: 1,
      kind: 'lesson',
      title: 'Gedachten zijn geen feiten',
      minutes: 6,
      tags: ['Defusie'],
      intro: [
        'Stel: je denkt "dit gaat niet lukken". Die zin voelt als een feit. Als een muur. Maar het is een zin in je hoofd. Woorden, geen werkelijkheid.',
        'Je brein bedenkt de hele dag gedachten. Commentaar, waarschuwingen, oordelen. Dat is zijn werk. Vaak handig. Maar soms raak je erin verstrikt. In ACT heet dat verstrengeling: je neemt elke gedachte voor waar aan.',
        'Deze week leer je defusie. Dat is gewoon: afstand nemen van gedachten. Niet weg ermee. Je leert kijken náár een gedachte, in plaats van vánuit een gedachte.'
      ],
      metaphorCard: {
        title: 'Passagiers op de bus',
        text: 'Jij bestuurt de bus van je leven. Achterin zitten luidruchtige passagiers: gedachten die roepen welke kant je op moet. Je kunt ze er niet uitzetten. Maar jij houdt het stuur vast.',
        art: 'mist'
      },
      exercise: {
        title: 'Eén gedachte bekijken',
        steps: [
          { n: 1, title: 'Kies een gedachte', text: 'Denk aan een zin die vaak in je hoofd opduikt. Bijvoorbeeld: ik ben niet goed genoeg.', seconds: 30 },
          { n: 2, title: 'Zie hem als tekst', text: 'Stel je voor dat de zin op een scherm staat. Welke letters? Welke kleur? Het is tekst, verder niets.', seconds: 45 },
          { n: 3, title: 'Zet er een zin voor', text: 'Zeg nu: ik merk de gedachte dat ik niet goed genoeg ben. Voel je het verschil? De zin voelt iets verder weg.', seconds: 45 },
          { n: 4, title: 'Laat hem meereizen', text: 'Je hoeft de gedachte niet weg te halen. Hij mag gewoon meereizen, als passagier achterin je bus.', seconds: 15 }
        ]
      },
      reflection: 'Een gedachte hoeft niet waar te zijn om luid te zijn. Je kunt hem horen zonder hem te gehoorzamen. Dat is het begin van defusie.',
      assignment: 'Let deze week op drie gedachten die vaak terugkomen. Schrijf ze op of onthoud ze. Je doet er nog niets mee. Alleen herkennen is genoeg.',
      relatedSkillIds: ['defusie-afstand-van-gedachten'],
      flashcardIds: ['w04-l01-f1', 'w04-l01-f2', 'w04-l01-f3']
    },
    {
      id: 'w04-l02',
      weekId: 'w04',
      order: 2,
      kind: 'lesson',
      title: 'Afstand nemen van gedachten',
      minutes: 6,
      tags: ['Defusie', 'Gedachten uitdagen'],
      intro: [
        'In de vorige les zag je: een gedachte is een zin, geen feit. Nu leer je drie snelle manieren om afstand te nemen. Ze duren elk maar een paar seconden.',
        'Eén: zet er een zin voor. "Ik merk de gedachte dat..." Twee: bedank je brein. "Bedankt, brein, voor die melding." Drie: geef het verhaal een naam. "Ah, het niet-goed-genoeg-verhaal is weer op visite."',
        'Soms wil je meer dan alleen afstand. Dan is er een tweede vaardigheid, uit VERS: gedachten uitdagen. Daarbij kijk je als een detective na of een gedachte klopt. Wat zijn de feiten voor en tegen? Wat zou je tegen een lieve vriend of vriendin zeggen?',
        'De volgorde is belangrijk. Eerst afstand nemen, dan eventueel nakijken. Ga je meteen discussiëren met een gedachte, dan wordt het al snel weer touwtrekken. Defusie is je eerste stap. Uitdagen is een extra gereedschap, voor gedachten over feiten die je kunt controleren.'
      ],
      exercise: {
        title: 'Melk, melk, melk',
        steps: [
          { n: 1, title: 'Kies een woord', text: 'Neem het woord "melk". Zeg het één keer rustig, hardop of in je hoofd. Denk aan koud, wit, een glas.', seconds: 20 },
          { n: 2, title: 'Herhaal het snel', text: 'Zeg het woord nu 45 seconden snel achter elkaar: melk, melk, melk. Let op wat er met de betekenis gebeurt.', seconds: 45 },
          { n: 3, title: 'Kijk wat er over is', text: 'Meestal blijft er alleen een klank over. Het woord verliest zijn verhaal. Dat gevoel is afstand.', seconds: 30 },
          { n: 4, title: 'Probeer een lastig woord', text: 'Neem nu één woord uit een moeilijke gedachte, bijvoorbeeld "zwak". Herhaal dat ook 30 seconden. Ook dit is maar een klank.', seconds: 30 }
        ]
      },
      reflection: 'Voelde het gek? Dat hoort erbij. Woorden zijn klanken tot wij er verhalen van maken. Daar zit je vrijheid.',
      assignment: 'Probeer deze week bij een lastige gedachte één van de drie snelle stappen: de zin ervoor, bedank je brein, of een naam voor het verhaal. Gaat de gedachte over een controleerbaar feit? Dan mag je hem ook als detective nakijken.',
      relatedSkillIds: ['defusie-afstand-van-gedachten'],
      flashcardIds: ['w04-l02-f1', 'w04-l02-f2', 'w04-l02-f3']
    },
    {
      id: 'w04-l03',
      weekId: 'w04',
      order: 3,
      kind: 'oefening',
      title: 'Gedachten benoemen',
      minutes: 5,
      tags: ['Defusie'],
      intro: [
        'Nu ga je oefenen met de snelste stap uit de vorige les: een gedachte benoemen. Alsof je een etiket op een doos plakt.',
        'Een naam geven lijkt klein. Maar wie een gedachte kan benoemen, staat er niet meer middenin. Je kijkt ernaar, in plaats van erin te zijn.'
      ],
      exercise: {
        title: 'Gedachten benoemen in 4 stappen',
        steps: [
          { n: 1, title: 'Word stil', text: 'Ga rustig zitten. Adem een paar keer in en uit. Laat je gedachten gewoon komen.', seconds: 30 },
          { n: 2, title: 'Vang er één', text: 'Welke gedachte duikt op? Iets over gisteren, over morgen, over jezelf? Alles telt.', seconds: 45 },
          { n: 3, title: 'Plak het etiket', text: 'Zeg er zachtjes bij: ik merk de gedachte dat... Of: daar is het piekeren weer. Geef het een naam die bij jou past.', seconds: 60 },
          { n: 4, title: 'Herhaal een paar keer', text: 'Elke nieuwe gedachte krijgt een etiket. Je hoeft nergens op te reageren. Benoemen, en weer verder kijken.', seconds: 90 }
        ]
      },
      reflection: 'Het werkt ook als het maar af en toe lukt. Elke keer dat je een gedachte herkende, was je al aan het oefenen.',
      assignment: 'Benoem deze week elke dag drie gedachten met "ik merk de gedachte dat...". Bijvoorbeeld in de trein, onder de douche of voor het slapen.',
      relatedSkillIds: ['defusie-afstand-van-gedachten'],
      flashcardIds: ['w04-l03-f1', 'w04-l03-f2']
    },
    {
      id: 'w04-l04',
      weekId: 'w04',
      order: 4,
      kind: 'oefening',
      title: 'Bladeren op de stroom',
      minutes: 8,
      tags: ['Defusie'],
      intro: [
        'Dit is een klassieke ACT-oefening. Je stelt je een rustig stroompje voor, met bladeren op het water.',
        'Elke gedachte die opkomt, leg je op een blaadje. Groot of klein, prettig of vervelend. En je kijkt hoe het wegdrijft. Je hoeft niets weg te duwen en niets vast te houden.',
        'Soms stopt het stroompje in je hoofd. Ook dat is normaal. Dan kijk je gewoon naar het stilstaande blaadje. Er is niets dat fout kan gaan.'
      ],
      metaphorCard: {
        title: 'Bladeren op de stroom',
        text: 'Je zit op de oever van een stroompje. Gedachten zijn bladeren op het water. Ze komen aangedreven en drijven voorbij. Jij blijft op de oever en kijkt.',
        art: 'stroom'
      },
      exercise: {
        title: 'Bladeren op de stroom in 5 stappen',
        steps: [
          { n: 1, title: 'Ga rustig zitten', text: 'Doe je ogen dicht of kijk zacht voor je uit. Adem drie keer rustig in en uit.', seconds: 40 },
          { n: 2, title: 'Zie het stroompje', text: 'Stel je een klein stroompje voor met bladeren op het water. Hoor het kabbelen. Voel de oever onder je.', seconds: 60 },
          { n: 3, title: 'Leg gedachten op bladeren', text: 'Elke gedachte die komt, leg je op een blaadje. Woorden, beelden, piekeren, plannen. Alles mag op een blaadje.', seconds: 180 },
          { n: 4, title: 'Kijk hoe ze drijven', text: 'Volg de bladeren tot ze uit beeld zijn. Nieuwe gedachte? Nieuw blaadje. Stroomt het even niet? Kijk dan rustig naar het stilstaande blaadje.', seconds: 120 },
          { n: 5, title: 'Kom zacht terug', text: 'Laat het stroompje gaan. Voel de stoel onder je. Doe je ogen rustig open.', seconds: 20 }
        ]
      },
      reflection: 'Dwaalde je vaak af? Dan heb je veel geoefend. Telkens terugkeren naar het stroompje ís de training. Kijken kan niet fout.',
      assignment: 'Doe deze oefening deze week nog twee keer, bijvoorbeeld voor het slapen. Zie je geen beelden? Dan mag je de gedachten ook gewoon benoemen, zoals in de vorige les.',
      relatedSkillIds: ['bladeren-op-de-stroom'],
      flashcardIds: ['w04-l04-f1', 'w04-l04-f2']
    },
    {
      id: 'w04-l05',
      weekId: 'w04',
      order: 5,
      kind: 'herhaling',
      title: 'Terugblik op je week',
      minutes: 4,
      intro: [
        'Deze week keek je anders naar je gedachten. Niet als feiten, maar als woorden en beelden van je brein. Tijd voor een korte terugblik.',
        'Ook nu geldt: geen toets. Gewoon kijken wat je opviel, en wat je wilt bewaren.'
      ],
      exercise: {
        title: 'Terugblik in 3 stappen',
        steps: [
          { n: 1, title: 'Denk terug aan een gedachte', text: 'Welke gedachte kwam deze week vaak terug? Hoe ging je ermee om?', seconds: 60 },
          { n: 2, title: 'Kies je favoriete stap', text: 'Wat hielp het meest: benoemen, bedanken, bladeren of de detective? Kies er één om te bewaren.', seconds: 60 },
          { n: 3, title: 'Rond af', text: 'Haal één keer rustig adem. Je hebt nu gereedschap uit twee weken: ruimte voor gevoelens, afstand van gedachten.', seconds: 20 }
        ]
      },
      reflection: 'Afstand nemen is geen trucje dat altijd meteen werkt. Het is een richting. Elke keer dat je een gedachte zag als gedachte, was je al onderweg.',
      assignment: 'Blijf komende week elke dag drie gedachten benoemen. Week 5 gaat over het deel van jou dat alles kan waarnemen. Rustig kijken helpt daarbij.',
      relatedSkillIds: ['defusie-afstand-van-gedachten'],
      flashcardIds: ['w04-l05-f1', 'w04-l05-f2']
    }
  ]
};

/** Flashcards voor week 4 (Defusie & gedachten). */
export const week04Flashcards: Flashcard[] = [
  {
    id: 'w04-l01-f1',
    lessonId: 'w04-l01',
    front: 'Zijn gedachten feiten?',
    back: 'Nee. Gedachten zijn woorden en beelden die je brein bedenkt. Sommige kloppen, veel niet. Je mag ze horen zonder ze meteen te geloven of te volgen.'
  },
  {
    id: 'w04-l01-f2',
    lessonId: 'w04-l01',
    front: 'Wat is verstrengeling?',
    back: 'Dan neem je een gedachte automatisch voor waar aan. "Dit gaat niet lukken" voelt als een feit, terwijl het een zin in je hoofd is. Defusie helpt je er afstand van te nemen.'
  },
  {
    id: 'w04-l01-f3',
    lessonId: 'w04-l01',
    front: 'Wie houdt het stuur vast bij de bus-metafoor?',
    back: 'Jij. De passagiers, je gedachten, mogen roepen wat ze willen. Zij bepalen niet waar de bus heen rijdt.'
  },
  {
    id: 'w04-l02-f1',
    lessonId: 'w04-l02',
    front: 'Noem drie snelle manieren om afstand te nemen van een gedachte.',
    back: 'Zet "ik merk de gedachte dat..." ervoor. Bedank je brein voor de melding. Of geef het verhaal een naam: ah, het niet-goed-genoeg-verhaal weer.'
  },
  {
    id: 'w04-l02-f2',
    lessonId: 'w04-l02',
    front: 'Wat is gedachten uitdagen?',
    back: 'Een vaardigheid uit VERS. Je kijkt als een detective na of een gedachte klopt. Wat zijn de feiten voor en tegen? Wat zou je tegen een vriend zeggen? Zo kom je tot een eerlijkere gedachte.'
  },
  {
    id: 'w04-l02-f3',
    lessonId: 'w04-l02',
    front: 'Wat doe je eerst: defusie of gedachten uitdagen?',
    back: 'Eerst defusie: afstand nemen. Uitdagen is een extra stap voor gedachten over controleerbare feiten. Meteen discussiëren kan weer touwtrekken worden.'
  },
  {
    id: 'w04-l03-f1',
    lessonId: 'w04-l03',
    front: 'Hoe benoem je een gedachte?',
    back: 'Zet er een zin voor: ik merk de gedachte dat... Daarna mag je het verhaal een naam geven, bijvoorbeeld: het piekeren weer. Benoemen en weer verder kijken.'
  },
  {
    id: 'w04-l03-f2',
    lessonId: 'w04-l03',
    front: 'Waarom helpt benoemen?',
    back: 'Wie een gedachte benoemt, kijkt ernaar in plaats van erin te zitten. De gedachte blijft er, maar zijn greep wordt kleiner.'
  },
  {
    id: 'w04-l04-f1',
    lessonId: 'w04-l04',
    front: 'Wat doe je bij bladeren op de stroom?',
    back: 'Je stelt je een stroompje met bladeren voor. Elke gedachte leg je op een blaadje en je kijkt hoe hij wegdrijft. Niets wegduwen, niets vasthouden.'
  },
  {
    id: 'w04-l04-f2',
    lessonId: 'w04-l04',
    front: 'Wat als het stroompje in je hoofd stopt?',
    back: 'Dat is normaal. Kijk dan rustig naar het stilstaande blaadje tot het weer beweegt. Er is niets dat fout kan gaan.'
  },
  {
    id: 'w04-l05-f1',
    lessonId: 'w04-l05',
    front: 'Wat was de kern van week 4?',
    back: 'Gedachten zijn geen feiten, maar dingen die in je hoofd gebeuren. Defusie is je eerste stap: benoemen, bedanken, bladeren op de stroom. Gedachten uitdagen kan daarna, bij controleerbare feiten.'
  },
  {
    id: 'w04-l05-f2',
    lessonId: 'w04-l05',
    front: 'Welk gereedschap heb je na week 3 en 4?',
    back: 'Uit week 3: ruimte maken voor gevoelens en toestemming geven. Uit week 4: afstand nemen van gedachten, en zo nodig de feiten nakijken als een detective.'
  }
];
