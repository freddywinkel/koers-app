import type { Week, Flashcard } from '../types';

/**
 * Week 3 — Acceptatie.
 * Minder vechten tegen gevoelens, meer ruimte maken: creatieve hooploosheid
 * (de controleagenda werkt niet), bereidheid, en twee kernoefeningen:
 * ruimte maken voor gevoelens en toestemming geven (toestaan van emoties).
 * Metaforen: drijfzand en touwtrekken met een monster (originele teksten).
 * Gebaseerd op research/act-deep-dive.md (§1.4, §2.1) en
 * research/course-structure-literature.md (§7.2–7.3).
 * Geschreven volgens src/content/README.md (B1, warm, oefening-eerst).
 */
export const week03: Week = {
  id: 'w03',
  number: 3,
  title: 'Acceptatie',
  tagline: 'Minder vechten tegen gevoelens, meer ruimte maken.',
  lessons: [
    {
      id: 'w03-l01',
      weekId: 'w03',
      order: 1,
      kind: 'lesson',
      title: 'Wat is acceptatie?',
      minutes: 6,
      tags: ['Acceptatie'],
      intro: [
        'Stel: je voelt je verdrietig of gespannen. Je probeert het weg te denken. Je zoekt afleiding. En toch komt het gevoel terug. Herkenbaar?',
        'Acceptatie is de andere weg. Het gevoel mag er gewoon zijn. Je hoeft het niet fijn te vinden. Je hoeft er ook niets mee te doen. Je geeft het alleen wat ruimte.',
        'Acceptatie is niet opgeven en niet goedkeuren. Het is ook geen zwakte. Het is eerlijk kijken: dit is er nu. En dan je energie bewaren voor dingen die wel belangrijk voor je zijn.'
      ],
      metaphorCard: {
        title: 'Drijfzand',
        text: 'Wie in drijfzand spartelt, zakt dieper weg. Plat gaan liggen helpt: je verdeelt je gewicht en je blijft drijven. Zo werkt het ook met pijnlijke gevoelens. Hoe harder je vecht, hoe dieper je wegzakt.',
        art: 'stroom'
      },
      exercise: {
        title: 'Even toestaan',
        steps: [
          { n: 1, title: 'Merk iets op', text: 'Denk aan iets kleins dat je deze week bezighield. Niets groots. Gewoon een klein knagend gevoel.', seconds: 30 },
          { n: 2, title: 'Voel waar het zit', text: 'Waar voel je dat in je lichaam? In je buik, je borst of je keel? Kijk er rustig naar.', seconds: 45 },
          { n: 3, title: 'Zeg er ja tegen', text: 'Zeg in jezelf: dit gevoel mag er even zijn. Ik hoef er niets mee. Blijf zachtjes ademen.', seconds: 60 },
          { n: 4, title: 'Laat weer los', text: 'Haal één keer rustig adem. Kijk om je heen. Voel: je bent hier, nu.', seconds: 15 }
        ]
      },
      reflection: 'Misschien voelde het vreemd om iets toe te staan. Dat is logisch. Toestaan is een vaardigheid, geen knop. Elke keer oefenen telt.',
      assignment: 'Let deze week op één moment per dag waarop je tegen een gevoel vecht. Zeg dan zachtjes: dit mag er even zijn. Meer hoeft niet.',
      relatedSkillIds: [],
      flashcardIds: ['w03-l01-f1', 'w03-l01-f2', 'w03-l01-f3']
    },
    {
      id: 'w03-l02',
      weekId: 'w03',
      order: 2,
      kind: 'lesson',
      title: 'Vechten kost energie',
      minutes: 5,
      tags: ['Acceptatie'],
      intro: [
        'Denk aan een gevoel dat je liever niet voelt. Wat heb je allemaal geprobeerd om het weg te krijgen? Afleiding zoeken. Piekeren. Slapen. Tegen jezelf zeggen dat je je niet zo moet aanstellen.',
        'En werkte het? Misschien even. Maar meestal komt het gevoel terug. Soms zelfs sterker. Dat is niet jouw schuld. Je brein lost graag problemen op. Alleen: gevoelens zijn geen rekensommen.',
        'Therapeuten noemen dit de controleagenda: het plan om moeilijke gevoelens weg te houden. Die agenda kost veel energie. En op lange termijn werkt hij zelden. Deze week kijk je of er een andere weg is.'
      ],
      metaphorCard: {
        title: 'Touwtrekken met een monster',
        text: 'Je trekt aan een touw. Aan de andere kant trekt een groot monster. Hoe harder jij trekt, hoe harder het monster trekt. Er is ook een andere optie: het touw laten vallen. Het monster blijft, maar de strijd stopt.',
        art: 'mist'
      },
      exercise: {
        title: 'De witte-ijsbeertest',
        steps: [
          { n: 1, title: 'Ga rustig zitten', text: 'Ga lekker zitten. Je ogen mogen open of dicht.', seconds: 15 },
          { n: 2, title: 'Denk aan een ijsbeer', text: 'Stel je een witte ijsbeer voor. Groot en zacht, in de sneeuw. Maak het beeld heel duidelijk.', seconds: 30 },
          { n: 3, title: 'Nu juist niet denken', text: 'Probeer één minuut níet aan de ijsbeer te denken. Helemaal niet. Let goed op wat er gebeurt.', seconds: 60 },
          { n: 4, title: 'Kijk wat er gebeurde', text: 'Lukte het niet? Bijna niemand lukt dat. Een gedachte verbieden maakt hem juist sterker.', seconds: 30 }
        ]
      },
      reflection: 'Deze test lukt bijna niemand. Dat is precies de les. Wegduwen en verbieden werken niet bij gedachten en gevoelens. Daarom oefenen we met toestaan.',
      assignment: 'Schrijf drie dingen op die jij doet om moeilijke gevoelens weg te houden. Wat kosten ze je op een dag? Alleen kijken, nog niets veranderen.',
      relatedSkillIds: [],
      flashcardIds: ['w03-l02-f1', 'w03-l02-f2', 'w03-l02-f3']
    },
    {
      id: 'w03-l03',
      weekId: 'w03',
      order: 3,
      kind: 'oefening',
      title: 'Ruimte maken voor gevoelens',
      minutes: 8,
      tags: ['Acceptatie'],
      intro: [
        'In deze oefening ga je niet weg bij een moeilijk gevoel. Je blijft er juist zachtjes bij. Je maakt er ruimte voor, in plaats van het weg te duwen.',
        'Kies iets kleins uit pan 2 of 3: Rimpelt of Borrelt. Een lichte spanning of een kriebel van verdriet. Geen pan 5, daar oefen je dit nog niet mee.',
        'Je mag altijd stoppen. Wordt het te veel? Open dan je ogen en adem rustig. Jij bepaalt het tempo.'
      ],
      exercise: {
        title: 'Ruimte maken in 6 stappen',
        steps: [
          { n: 1, title: 'Kom tot rust', text: 'Ga zitten met je voeten op de grond. Adem een paar keer rustig in en uit.', seconds: 45 },
          { n: 2, title: 'Zoek het gevoel', text: 'Denk aan iets kleins dat je bezighoudt. Waar voel je dat in je lichaam? Buik, borst, keel of schouders?', seconds: 60 },
          { n: 3, title: 'Bekijk het als onderzoeker', text: 'Beschrijf het alsof je wetenschapper bent. Warm of koud? Groot of klein? Beweegt het of staat het stil?', seconds: 90 },
          { n: 4, title: 'Adem eromheen', text: 'Stel je voor dat je adem om het gevoel heen stroomt. Je ademt het niet weg. Je ademt er alleen omheen.', seconds: 120 },
          { n: 5, title: 'Geef het ruimte', text: 'Stel je voor dat je borst of buik iets groter wordt. Het gevoel krijgt een eigen plekje. Het mag er zijn.', seconds: 90 },
          { n: 6, title: 'Rond zacht af', text: 'Laat het beeld los. Voel de stoel onder je. Kijk rustig om je heen.', seconds: 30 }
        ]
      },
      reflection: 'Misschien werd het gevoel zachter, misschien niet. Allebei is goed. Het doel was niet weghalen, maar ruimte maken. Dat je bleef kijken, is de oefening.',
      assignment: 'Oefen deze week elke dag drie minuten met een klein gevoel. Bijvoorbeeld lichte ergernis in de rij, of onrust voor het slapen.',
      relatedSkillIds: [],
      flashcardIds: ['w03-l03-f1', 'w03-l03-f2']
    },
    {
      id: 'w03-l04',
      weekId: 'w03',
      order: 4,
      kind: 'oefening',
      title: 'Toestemming geven',
      minutes: 5,
      tags: ['Acceptatie'],
      intro: [
        'Ruimte maken heb je al geoefend. Nu ga je een stap verder: het gevoel actief toestemming geven. Alsof je de deur openzet in plaats van dicht te houden.',
        'In ACT heet dit ook wel bereidheid. Je bent bereid het gevoel te hebben, omdat vechten je meer kost. Toestemming geven is niet hetzelfde als het leuk vinden.',
        'Je doet het met een paar rustige woorden. Kleine zinnen, met een groot effect.'
      ],
      exercise: {
        title: 'Toestemming geven in 5 stappen',
        steps: [
          { n: 1, title: 'Merk op wat er is', text: 'Stop even. Welk gevoel is er nu? Geef het een naam: spanning, verdriet, boosheid, onrust.', seconds: 45 },
          { n: 2, title: 'Leg je hand erop', text: 'Voel waar het gevoel zit. Leg je hand op die plek. Je buik, je borst of je keel.', seconds: 30 },
          { n: 3, title: 'Zeg het zachtjes', text: 'Zeg in jezelf: dit gevoel mag er zijn. Of: ik hoef hier niet tegen te vechten. Kies woorden die bij jou passen.', seconds: 60 },
          { n: 4, title: 'Blijf even zo', text: 'Houd je hand op de plek. Adem rustig. Merk op wat er gebeurt als je niet vecht.', seconds: 90 },
          { n: 5, title: 'Rond af', text: 'Haal je hand weg. Neem één diepe ademhaling. Kijk om je heen.', seconds: 15 }
        ]
      },
      reflection: 'Toestemming geven kan in het begin raar voelen. Alsof je iets binnenlaat dat er niet hoort. Maar het gevoel was er al. Jij stopte alleen met duwen.',
      assignment: 'Zeg deze week bij elk moeilijk gevoel één keer: dit mag er zijn. Ook als het maar half lukt. Half is genoeg.',
      relatedSkillIds: [],
      flashcardIds: ['w03-l04-f1', 'w03-l04-f2']
    },
    {
      id: 'w03-l05',
      weekId: 'w03',
      order: 5,
      kind: 'herhaling',
      title: 'Terugblik op je week',
      minutes: 4,
      intro: [
        'Je hebt deze week geoefend met anders omgaan met moeilijke gevoelens. Minder vechten, meer ruimte. Tijd om even stil te staan.',
        'Terugkijken is geen toets. Er is geen goed of fout. Alleen: wat viel je op? En wat wil je meenemen naar volgende week?'
      ],
      exercise: {
        title: 'Korte terugblik',
        steps: [
          { n: 1, title: 'Denk terug aan de strijd', text: 'Denk aan een moment deze week waarop je tegen een gevoel vocht. Wat deed je toen? Wat kostte het je?', seconds: 60 },
          { n: 2, title: 'Denk terug aan de ruimte', text: 'Was er ook een moment dat het gevoel er mocht zijn? Hoe klein ook. Wat hielp je toen?', seconds: 60 },
          { n: 3, title: 'Kies één beeld', text: 'Drijfzand of touwtrekken: welk beeld blijft hangen? Dat beeld is je anker voor als het weer spannend wordt.', seconds: 45 },
          { n: 4, title: 'Rond af', text: 'Neem een rustige ademhaling. Je hebt deze week iets nieuws geoefend. Dat telt.', seconds: 15 }
        ]
      },
      reflection: 'Minder vechten leer je door te oefenen, niet door het alleen te snappen. Liet je deze week één keer het touw vallen? Dan heb je de kern al te pakken.',
      assignment: 'Blijf komende week elke dag kort oefenen: twee minuten ruimte maken of toestemming geven. Week 4 gaat over gedachten. De rust van deze week neem je daarin mee.',
      relatedSkillIds: [],
      flashcardIds: ['w03-l05-f1', 'w03-l05-f2']
    }
  ]
};

/** Flashcards voor week 3 (Acceptatie). */
export const week03Flashcards: Flashcard[] = [
  {
    id: 'w03-l01-f1',
    lessonId: 'w03-l01',
    front: 'Wat is acceptatie?',
    back: 'Acceptatie betekent: een gevoel mag er zijn, ook al is het onprettig. Je hoeft het niet fijn te vinden en er niet naar te handelen. Je geeft het gewoon wat ruimte.'
  },
  {
    id: 'w03-l01-f2',
    lessonId: 'w03-l01',
    front: 'Is acceptatie hetzelfde als opgeven?',
    back: 'Nee. Opgeven is er niet meer naar omkijken. Acceptatie is juist aanwezig blijven, zonder te vechten. Dat kost minder energie dan vechten.'
  },
  {
    id: 'w03-l01-f3',
    lessonId: 'w03-l01',
    front: 'Wat leert het beeld van drijfzand?',
    back: 'Wie spartelt in drijfzand, zakt dieper weg. Plat liggen en je gewicht verdelen helpt wel. Zo werkt het ook met pijnlijke gevoelens: vechten maakt ze zwaarder.'
  },
  {
    id: 'w03-l02-f1',
    lessonId: 'w03-l02',
    front: 'Wat is de controleagenda?',
    back: 'Het plan om moeilijke gevoelens weg te houden of te veranderen. Afleiding, wegduwen, piekeren. Het kost veel energie en werkt op lange termijn zelden.'
  },
  {
    id: 'w03-l02-f2',
    lessonId: 'w03-l02',
    front: 'Wat leert de witte-ijsbeertest?',
    back: 'Een gedachte of gevoel verbieden werkt niet. Probeer niet aan een witte ijsbeer te denken, en daar is hij. Onderdrukken maakt het juist sterker.'
  },
  {
    id: 'w03-l02-f3',
    lessonId: 'w03-l02',
    front: 'Wat is de andere optie bij touwtrekken met een monster?',
    back: 'Het touw laten vallen. Het monster blijft bestaan, maar jij stopt met trekken. De strijd kost dan geen energie meer.'
  },
  {
    id: 'w03-l03-f1',
    lessonId: 'w03-l03',
    front: 'Hoe maak je ruimte voor een gevoel?',
    back: 'Zoek waar het in je lijf zit. Bekijk het als een onderzoeker: vorm, warmte, beweging. Adem er zachtjes omheen. Je hoeft het niet weg te maken.'
  },
  {
    id: 'w03-l03-f2',
    lessonId: 'w03-l03',
    front: 'Met welk gevoel oefen je dit het beste?',
    back: 'Begin klein: pan 2 of 3, Rimpelt of Borrelt. Zit je in pan 4 of 5? Gebruik dan eerst je adem of de 5-4-3-2-1-oefening.'
  },
  {
    id: 'w03-l04-f1',
    lessonId: 'w03-l04',
    front: 'Wat zeg je bij toestemming geven?',
    back: 'Een korte, rustige zin. Bijvoorbeeld: dit gevoel mag er zijn. Of: ik hoef hier niet tegen te vechten. Daarna adem je gewoon verder.'
  },
  {
    id: 'w03-l04-f2',
    lessonId: 'w03-l04',
    front: 'Betekent toestemming geven dat je het gevoel fijn vindt?',
    back: 'Nee. Je vindt het niet leuk en je keurt het niet goed. Je erkent alleen: het is er nu. Toestaan kost minder dan vechten.'
  },
  {
    id: 'w03-l05-f1',
    lessonId: 'w03-l05',
    front: 'Wat was de kern van week 3?',
    back: 'Vechten tegen gevoelens kost energie en werkt zelden. Acceptatie is de andere weg: het gevoel mag er zijn. Ruimte maken en toestemming geven zijn de oefeningen.'
  },
  {
    id: 'w03-l05-f2',
    lessonId: 'w03-l05',
    front: 'Wat doe je als toestaan niet lukt?',
    back: 'Dan is dat oké. Toestaan is oefenen, geen knop omzetten. Begin klein, bij pan 2 of 3. En gebruik je adem als anker als het te veel wordt.'
  }
];
