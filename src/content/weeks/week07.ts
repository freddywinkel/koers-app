import type { Week, Flashcard } from '../types';

/**
 * Week 7 — Waarden
 * -----------------
 * Bron: research/act-deep-dive.md (§2.5 Waarden) en
 * research/instructional-design.md (oefening-eerst, B1-schrijfstijl).
 * Alle teksten zijn origineel geschreven voor Koers.
 */
export const week07: Week = {
  id: 'w07',
  number: 7,
  title: 'Waarden',
  tagline: 'Ontdekken wat jou echt belangrijk is.',
  lessons: [
    {
      id: 'w07-l01',
      weekId: 'w07',
      order: 1,
      kind: 'lesson',
      title: 'Wat is jou belangrijk?',
      minutes: 6,
      tags: ['Waarden'],
      intro: [
        'Je hebt al veel geoefend. Met aandacht, met gevoelens, met gedachten. Nu komt een grote vraag: waar doe je het allemaal voor?',
        'Waarden zijn dingen die jij belangrijk vindt. Bijvoorbeeld: er zijn voor je gezin. Eerlijk zijn. Gezond leven. Ze geven richting aan je leven.',
        'Waarden zijn niet wat anderen van je vinden. Ze zijn van jou. Deze week ontdek je wat er voor jou echt toe doet.'
      ],
      metaphorCard: {
        title: 'Het kompas',
        text: 'Een kompas zegt niet waar je bent. Het wijst alleen de richting. Zo werken waarden ook: ze sturen je, elke dag opnieuw.',
        art: 'mist'
      },
      exercise: {
        title: 'Kijken naar je dag',
        steps: [
          { n: 1, title: 'Kom rustig aan', text: 'Ga rustig zitten. Neem één rustige ademhaling. Je hoeft nergens anders heen.', seconds: 20 },
          { n: 2, title: 'Denk aan een mooi moment', text: 'Denk aan een moment deze week dat goed voelde. Klein mag: koffie in de zon, een praatje, even rust.', seconds: 60 },
          { n: 3, title: 'Wat maakte het mooi?', text: 'Vraag je af: wat zat er in dat moment dat jou belangrijk is? Samen zijn? Rust? Zorgen voor iemand?', seconds: 60 },
          { n: 4, title: 'Schrijf één woord op', text: 'Schrijf één woord op dat dat belangrijke ding benoemt. Dat kan al een waarde van jou zijn.', seconds: 45 }
        ]
      },
      reflection: 'Er is geen goed of fout antwoord. Wat jij belangrijk vindt, telt. Ook als het klein of gewoon lijkt.',
      assignment: 'Kijk deze week bij twee gewone momenten: voelt dit belangrijk voor mij? Schrijf telkens één woord op.',
      relatedSkillIds: [],
      flashcardIds: ['w07-l01-f1', 'w07-l01-f2']
    },
    {
      id: 'w07-l02',
      weekId: 'w07',
      order: 2,
      kind: 'lesson',
      title: 'Waarden zijn geen doelen',
      minutes: 5,
      tags: ['Waarden'],
      intro: [
        'Een doel kun je afvinken. "Ik bel mijn zus deze week." Klaar is klaar.',
        'Een waarde vink je nooit af. "Een zorgzame zus zijn" is nooit klaar. Je kunt er elke dag weer voor kiezen.',
        'Waarden zijn een richting, geen eindpunt. Dat is goed nieuws. Je hoeft nergens te komen. Je kunt vandaag al in de richting lopen.',
        'Soms leven we mee met doelen van anderen. "Dat hoort zo." Deze les helpt je kijken: is dit echt van mij?'
      ],
      metaphorCard: {
        title: 'De poolster',
        text: 'Zeelieden bereiken de poolster nooit. Toch varen ze er al eeuwen op. Zo is een waarde: je arriveert er niet, maar hij wijst je de weg.',
        art: 'stroom'
      },
      exercise: {
        title: 'Van waarde naar doel',
        steps: [
          { n: 1, title: 'Kies een waarde', text: 'Pak je woord van les 1 erbij. Of kies iets als: gezondheid, vriendschap, rust.', seconds: 30 },
          { n: 2, title: 'Maak er een doel bij', text: 'Bedenk iets kleins dat bij die waarde past. Iets dat je kunt afvinken. Bijvoorbeeld: vanavond twintig minuten wandelen.', seconds: 60 },
          { n: 3, title: 'Zie het verschil', text: 'Kijk naar je lijstje. Het doel is de stap. De waarde is de richting. Je voelt het verschil.', seconds: 45 }
        ]
      },
      reflection: 'Voelt iets als "moeten"? Dan is het misschien een doel van een ander. Jouw eigen waarden voelen van binnenuit goed, ook als het spannend is.',
      assignment: 'Schrijf bij één waarde twee kleine doelen. Ze mogen heel klein zijn. Klein is juist goed.',
      relatedSkillIds: [],
      flashcardIds: ['w07-l02-f1', 'w07-l02-f2']
    },
    {
      id: 'w07-l03',
      weekId: 'w07',
      order: 3,
      kind: 'oefening',
      title: 'Je kompas vinden',
      minutes: 8,
      tags: ['Waarden', 'Kompas'],
      intro: [
        'Dit is de grote oefening van deze week. Je gaat je eigen kompas vinden: waar wil jij dat jouw leven voor staat?',
        'Je doet dit in kleine stappen. Eerst kijk je van ver. Daarna kies je woorden. Als laatste kijk je waar je nu staat.',
        'Neem er rustig de tijd voor. Er is geen goed of fout. Alles wat opkomt, mag er zijn.'
      ],
      exercise: {
        title: 'Je kompas vinden in zes stappen',
        steps: [
          { n: 1, title: 'Kom rustig aan', text: 'Ga rustig zitten. Voel je voeten op de grond. Adem een paar keer rustig in en uit.', seconds: 40 },
          { n: 2, title: 'Je tachtigste verjaardag', text: 'Stel je voor: je bent tachtig. Er is een feestje. Mensen die jij lief vindt, zijn er.', seconds: 45 },
          { n: 3, title: 'Wat zeggen ze?', text: 'Iemand houdt een korte toespraak over jou. Wat wil jij dat die persoon zegt? Waar stond jij voor in je leven?', seconds: 90 },
          { n: 4, title: 'Kies je woorden', text: 'Schrijf drie dingen op die je hoorde. Bijvoorbeeld: liefdevol, eerlijk, moedig, betrouwbaar. Dat zijn jouw waarden.', seconds: 60 },
          { n: 5, title: 'Kijk waar je staat', text: 'Denk aan vier delen van je leven: werk, familie en vrienden, gezondheid, vrije tijd. Bij welk deel leef je je waarde al? Bij welk deel nog weinig?', seconds: 75 },
          { n: 6, title: 'Rond zachtjes af', text: 'Kijk om je heen. Wat je ook vond: je keek serieus naar je leven. Dat is knap.', seconds: 20 }
        ]
      },
      reflection: 'Deze oefening kan veel losmaken. Dankbaarheid, maar ook verdriet. Alles mag er zijn. Het eerlijk bekijken is al een stap.',
      assignment: 'Bewaar je drie woorden. Zet ze ergens waar je ze vaak ziet. Bijvoorbeeld op een briefje op de koelkast.',
      relatedSkillIds: [],
      flashcardIds: ['w07-l03-f1', 'w07-l03-f2', 'w07-l03-f3']
    },
    {
      id: 'w07-l04',
      weekId: 'w07',
      order: 4,
      kind: 'herhaling',
      title: 'Terugblik op je week',
      minutes: 4,
      tags: ['Terugblik'],
      intro: [
        'Deze week ontdekte je wat jou belangrijk is. Je keek naar waarden en doelen. En je maakte je eigen kompas.',
        'Even stilstaan helpt om het te bewaren. We blikken kort terug. Zonder cijfers, zonder oordeel.'
      ],
      exercise: {
        title: 'Terugblik in drie stappen',
        steps: [
          { n: 1, title: 'Denk aan je woorden', text: 'Welke waarden heb je deze week gevonden? Noem ze rustig voor jezelf.', seconds: 30 },
          { n: 2, title: 'Eén klein moment', text: 'Wanneer leefde je deze week al een beetje in die richting? Klein telt ook. Eén moment is genoeg.', seconds: 45 },
          { n: 3, title: 'Kies wat je meeneemt', text: 'Wat neem je mee naar volgende week? Je drie woorden? Het beeld van het kompas? Kies één ding.', seconds: 30 }
        ]
      },
      reflection: 'Elke blik op je kompas is oefenen. Je hoeft de richting niet perfect te volgen. Kijken is al genoeg.',
      assignment: 'Vertel deze week één persoon over één van je waarden. Alleen als dat goed voelt.',
      relatedSkillIds: [],
      flashcardIds: ['w07-l04-f1', 'w07-l04-f2']
    }
  ]
};

/** Flashcards voor week 7 (ids: w07-lMM-fK). */
export const week07Flashcards: Flashcard[] = [
  {
    id: 'w07-l01-f1',
    lessonId: 'w07-l01',
    front: 'Wat is een waarde?',
    back: 'Iets dat jij belangrijk vindt in je leven. Bijvoorbeeld: zorgen voor anderen, eerlijkheid, gezondheid. Waarden geven richting aan wat je doet.'
  },
  {
    id: 'w07-l01-f2',
    lessonId: 'w07-l01',
    front: 'Hoe vind je een waarde in je dagelijks leven?',
    back: 'Kijk naar momenten die goed of betekenisvol voelden. Vraag: wat zat daar in dat mij belangrijk is? Dat wijst naar een waarde.'
  },
  {
    id: 'w07-l02-f1',
    lessonId: 'w07-l02',
    front: 'Wat is het verschil tussen een waarde en een doel?',
    back: 'Een doel kun je afvinken, en dan is het klaar. Een waarde is nooit klaar. Het is een richting waar je elke dag voor kunt kiezen.'
  },
  {
    id: 'w07-l02-f2',
    lessonId: 'w07-l02',
    front: 'Waarom is "een waarde is een richting" goed nieuws?',
    back: 'Je hoeft nergens te komen. Je kunt vandaag al een stap in de richting zetten. Hoe klein ook.'
  },
  {
    id: 'w07-l03-f1',
    lessonId: 'w07-l03',
    front: 'Hoe werkt de tachtigste-verjaardag-oefening?',
    back: 'Je stelt je voor dat je tachtig bent en dat iemand over jou spreekt. Wat je die persoon hoort zeggen, laat zien wat jij echt belangrijk vindt.'
  },
  {
    id: 'w07-l03-f2',
    lessonId: 'w07-l03',
    front: 'Wat doe je na het kiezen van je waarden?',
    back: 'Je kijkt waar je nu staat. Hoe dicht leef je bij elke waarde? Eerlijk kijken, zonder oordeel. Daar begint verandering.'
  },
  {
    id: 'w07-l03-f3',
    lessonId: 'w07-l03',
    front: 'Wat als deze oefening verdriet oproept?',
    back: 'Dat is normaal, en het mag er zijn. Verdriet wijst vaak naar iets dat je echt belangrijk vindt. Wees zacht voor jezelf.'
  },
  {
    id: 'w07-l04-f1',
    lessonId: 'w07-l04',
    front: 'Wat was de kern van week 7?',
    back: 'Je ontdekte wat jou echt belangrijk is. Waarden zijn een richting, geen doel. Je kompas wijst de weg, elke dag opnieuw.'
  },
  {
    id: 'w07-l04-f2',
    lessonId: 'w07-l04',
    front: 'Wat neem je mee uit deze week?',
    back: 'Je eigen waarden in een paar woorden. En het besef: je kunt elke dag een kleine stap in die richting zetten.'
  }
];
