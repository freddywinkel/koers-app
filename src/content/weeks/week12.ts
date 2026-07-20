import type { Flashcard, Week } from '../types';

/**
 * Week 12 — Vooruit & volhouden.
 * Terugkijken op de hele cursus, terugvalpreventie (dip is geen stap terug),
 * het EHP afronden, een onderhoudsplan met ritme, en zacht afsluiten.
 * De flashcards van deze week vlechten herhaling van de hele cursus erdoorheen.
 * Alle teksten zijn origineel geschreven.
 */
export const week12: Week = {
  id: 'w12',
  number: 12,
  title: 'Vooruit & volhouden',
  tagline: 'Terugkijken, vooruitplannen en zelf verder.',
  lessons: [
    {
      id: 'w12-l01',
      weekId: 'w12',
      order: 1,
      kind: 'herhaling',
      title: 'Terugkijken op je reis',
      minutes: 6,
      tags: ['Terugblik'],
      intro: [
        'Twaalf weken geleden begon je bij het pannetjesmodel. Kijk eens hoeveel je sindsdien hebt geleerd.',
        'Je leerde kijken zonder te oordelen. Ruimte maken voor gevoelens. Afstand nemen van gedachten. En je ontdekte dat jij meer bent dan wat er in je hoofd gebeurt.',
        'Ook vond je jouw kompas: wat jij belangrijk vindt en hoe je daar met kleine stappen naartoe komt. Daar komt je plan voor moeilijke momenten bij. Dat is een hele gereedschapskist.'
      ],
      exercise: {
        title: 'Je reis in kaart',
        steps: [
          { n: 1, title: 'Blader door de weken', text: 'Loop de weektitels van week 1 tot en met 11 in gedachten na. Welke week is je het meest bijgebleven?', seconds: 60 },
          { n: 2, title: 'Kies je drie beste vaardigheden', text: 'Welke oefeningen gebruik je echt in je leven? Dat zijn je top drie. Schrijf ze op.', seconds: 90 },
          { n: 3, title: 'Kijk naar je pannetjes', text: 'Denk aan je check-ins van de afgelopen weken. Zie je verandering sinds week 1? Elke verandering telt, ook een kleine.', seconds: 90 },
          { n: 4, title: 'Één zin voor jezelf', text: 'Maak deze zin af: "Het belangrijkste dat ik leerde, is …"', seconds: 60 }
        ]
      },
      reflection: 'Vooruitgang is zelden een rechte lijn. Misschien ging het met vallen en opstaan. Dat is precies hoe leren werkt.',
      assignment: 'Vertel deze week aan iemand wat je hebt geleerd. Hardop benoemen maakt het sterker.',
      relatedSkillIds: [],
      flashcardIds: ['w12-l01-f1', 'w12-l01-f2', 'w12-l01-f3', 'w12-l01-f4']
    },
    {
      id: 'w12-l02',
      weekId: 'w12',
      order: 2,
      kind: 'lesson',
      title: 'Moeilijke momenten voorbereiden',
      minutes: 6,
      tags: ['Terugvalpreventie'],
      intro: [
        'Er komen weer moeilijke periodes. Dat is geen stap terug. Zo is het leven nu eenmaal. Oude patronen duiken op als je moe bent of onder druk staat.',
        'Een dip betekent niet dat je terug bij af bent. Een dip is een dip. De vaardigheden die je leerde, blijven van je. Je begint nooit meer helemaal opnieuw.',
        'Wie moeilijke momenten voorbereidt op een rustige dag, hoeft op een stormachtige dag minder na te denken. Dat doe je in deze les.'
      ],
      metaphorCard: {
        title: 'De jas hangt klaar',
        text: 'Je kunt slecht weer niet verbieden. Maar je kunt wel een jas klaarhangen. Voorbereiden betekent niet dat je regen verwacht. Het betekent dat je weet waar je jas hangt.',
        art: 'mist'
      },
      exercise: {
        title: 'Je als-dan-plannen',
        steps: [
          { n: 1, title: 'Kies een risicomoment', text: 'Denk aan een situatie die voor jou lastig is. Bijvoorbeeld: ruzie, een eenzame zondag, of druk op je werk.', seconds: 60 },
          { n: 2, title: 'Maak er een als-dan-zin van', text: 'Bijvoorbeeld: "Als ik merk dat ik me terugtrek, dan bel ik dezelfde dag nog iemand."', seconds: 90 },
          { n: 3, title: 'Koppel je vroegste signaal', text: 'Welk signaal uit week 11 past bij dit moment? Dat wordt je alarmbel.', seconds: 60 },
          { n: 4, title: 'Kies de oefening die je als eerste pakt', text: 'Welke oefening pak je erbij? Kies er één die past bij die pan.', seconds: 60 }
        ]
      },
      reflection: 'Voorbereiden is geen negativiteit. Het is juist vriendelijk voor de jij van later. Die hoeft dan alleen het plan te volgen.',
      assignment: 'Schrijf deze week drie als-dan-zinnen op en voeg ze toe aan je EHP.',
      relatedSkillIds: ['afstand-observeren'],
      flashcardIds: ['w12-l02-f1', 'w12-l02-f2', 'w12-l02-f3']
    },
    {
      id: 'w12-l03',
      weekId: 'w12',
      order: 3,
      kind: 'oefening',
      title: 'Jouw plan voor later',
      minutes: 10,
      tags: ['EHP', 'Vooruit'],
      intro: [
        'Nu zet je alles op zijn plek. Je maakt je Emotiehanteringsplan af. En je maakt een klein onderhoudsplan voor na de cursus.',
        'Oefenen blijft belangrijk, maar het mag klein. Een dagelijkse check-in van een halve minuut houdt je aandacht wakker. Een wekelijkse blik op je plan houdt het vers.'
      ],
      exercise: {
        title: 'Je plan afronden',
        steps: [
          { n: 1, title: 'Werk je EHP bij', text: 'Neem je plan uit week 11 erbij. Voeg je als-dan-zinnen toe. En vul aan wat nog mist.', seconds: 180 },
          { n: 2, title: 'Controleer pan 4 en 5', text: 'Staat daar wat je doet, wie je bereikt en welke professionele hulp er is? Dan is je plan compleet.', seconds: 90 },
          { n: 3, title: 'Kies je dagelijkse minuut', text: 'Kies een vast moment voor je check-in. Bijvoorbeeld bij je koffie. Of vlak voor het slapen.', seconds: 60 },
          { n: 4, title: 'Kies je weekmoment', text: 'Kies één moment per week om je pannetjes en je plan te bekijken. Tien minuten is genoeg.', seconds: 60 },
          { n: 5, title: 'Plan je terugkommoment', text: 'Zet over vier tot zes weken een moment in je agenda. Dan kijk je hoe het gaat en blader je door de lessen.', seconds: 60 },
          { n: 6, title: 'Deel je plan opnieuw', text: 'Geef de nieuwe versie aan je steunpersoon. Zo weet die persoon hoe het er nu uitziet.', seconds: 60 }
        ]
      },
      reflection: 'Je hebt nu iets kostbaars: een handleiding over jezelf, gemaakt door jezelf. Die mag je blijven aanpassen. Hij is van jou.',
      assignment: 'Leg je plan op een vaste plek. En zet je dagelijkse en wekelijkse momenten echt in je agenda of telefoon.',
      relatedSkillIds: ['ademanker', 'gronden-54321'],
      flashcardIds: ['w12-l03-f1', 'w12-l03-f2', 'w12-l03-f3']
    },
    {
      id: 'w12-l04',
      weekId: 'w12',
      order: 4,
      kind: 'lesson',
      title: 'Afsluiten en door',
      minutes: 5,
      tags: ['Afsluiting'],
      intro: [
        'Dit is de laatste les van Koers. Twaalf weken lang heb je geoefend, geschreven en gevoeld. Dat verdient een zachte landing.',
        'Afscheid nemen van de cursus is geen afscheid van je vaardigheden. Die neem je mee. De app en je plan blijven gewoon bij je.',
        'Groeien gaat met pieken en dalen. Soms zul je teruggrijpen op deze lessen. Dat is geen stap terug. Dat is precies waar ze voor zijn.'
      ],
      metaphorCard: {
        title: 'Een vaardige reiziger',
        text: 'Je bent niet klaar met reizen. Je hebt nu een kaart, een kompas en een jas. Waar je ook gaat: je gereedschap reist mee.',
        art: 'stroom'
      },
      exercise: {
        title: 'Zacht afsluiten',
        steps: [
          { n: 1, title: 'Bedank jezelf', text: 'Zeg in gedachten: ik heb dit gedaan. Het klinkt simpel. En het is groot.', seconds: 30 },
          { n: 2, title: 'Doe je favoriete oefening', text: 'Doe nu, in deze laatste les, nog één keer de oefening die jij het fijnst vond.', seconds: 120 },
          { n: 3, title: 'Schrijf een briefje aan later', text: 'Schrijf één of twee zinnen aan jezelf voor een moeilijke dag. Bewaar ze bij je plan.', seconds: 90 },
          { n: 4, title: 'Kijk vooruit', text: 'Wat is de eerste kleine stap die je deze week zet? Helemaal voor jezelf.', seconds: 60 }
        ]
      },
      reflection: 'Je bent dezelfde persoon als twaalf weken geleden. Maar nu met meer taal, meer ruimte en een plan. Dank je wel dat je dit werk deed.',
      assignment: 'Vier het op jouw manier. Klein of groot. En kom over vier tot zes weken terug voor je terugkommoment.',
      relatedSkillIds: [],
      flashcardIds: ['w12-l04-f1', 'w12-l04-f2']
    }
  ]
};

/** Flashcards bij week 12 — met herhalingskaarten van de hele cursus. */
export const week12Flashcards: Flashcard[] = [
  {
    id: 'w12-l01-f1',
    lessonId: 'w12-l01',
    front: 'Hoe heet het model met de vijf pannen?',
    back: 'Het pannetjesmodel. Pan 1 Rustig, pan 2 Rimpelt, pan 3 Borrelt, pan 4 Pruttelt, pan 5 Kookt over. Het helpt je emoties in fasen te zien.'
  },
  {
    id: 'w12-l01-f2',
    lessonId: 'w12-l01',
    skillId: 'bladeren-op-de-stroom',
    front: 'Wat betekent afstand nemen van gedachten?',
    back: 'Je kijkt naar gedachten alsof het bladeren op een stroom zijn. Ze mogen er zijn, zonder dat je erin meegaat.'
  },
  {
    id: 'w12-l01-f3',
    lessonId: 'w12-l01',
    front: 'Wat is het verschil tussen vechten en ruimte maken?',
    back: 'Vechten tegen een gevoel kost energie en werkt zelden. Ruimte maken betekent: het gevoel mag er zijn, terwijl jij doet wat voor jou belangrijk is.'
  },
  {
    id: 'w12-l01-f4',
    lessonId: 'w12-l01',
    skillId: 'ademanker',
    front: 'Welke vaardigheid kun je altijd en overal gebruiken?',
    back: 'Het Ademanker. Je adem is altijd bij je. Twee minuten volgen is genoeg om weer grond onder je voeten te voelen.'
  },
  {
    id: 'w12-l02-f1',
    lessonId: 'w12-l02',
    front: 'Wat is het verschil tussen een dip en terug bij af zijn?',
    back: 'Een dip is een moeilijke periode. Die hoort erbij. Je vaardigheden blijven van je. Je begint dus nooit meer helemaal opnieuw.'
  },
  {
    id: 'w12-l02-f2',
    lessonId: 'w12-l02',
    front: 'Wat is een als-dan-plan?',
    back: 'Een kant-en-klare zin voor moeilijke momenten. Bijvoorbeeld: "Als ik merk dat ik pieker, dan doe ik eerst twee minuten met aandacht ademen."'
  },
  {
    id: 'w12-l02-f3',
    lessonId: 'w12-l02',
    front: 'Wanneer bereid je moeilijke momenten voor?',
    back: 'Op een rustige dag. Voorbereiden is geen negativiteit. Het is vriendelijk voor de jij van later.'
  },
  {
    id: 'w12-l03-f1',
    lessonId: 'w12-l03',
    front: 'Wat staat er in een compleet EHP?',
    back: 'Per pan: je signalen, wat jij zelf kunt doen en wat anderen kunnen doen. Bij pan 4 en 5 ook: wie je bereikt en welke professionele hulp er is.'
  },
  {
    id: 'w12-l03-f2',
    lessonId: 'w12-l03',
    front: 'Hoe houd je je vaardigheden vers na de cursus?',
    back: 'Klein en vast: een dagelijkse check-in van een halve minuut en een weekmoment van tien minuten. Plus een terugkommoment na vier tot zes weken.'
  },
  {
    id: 'w12-l03-f3',
    lessonId: 'w12-l03',
    front: 'Mag je je plan later nog aanpassen?',
    back: 'Ja, juist wel. Je plan is van jou en groeit met je mee. Klopt iets niet meer, dan pas je het aan.'
  },
  {
    id: 'w12-l04-f1',
    lessonId: 'w12-l04',
    front: 'Is terugkeren naar de lessen een stap terug?',
    back: 'Nee. De lessen en je plan blijven van je. Terugbladeren op een moeilijke dag is precies waar ze voor zijn.'
  },
  {
    id: 'w12-l04-f2',
    lessonId: 'w12-l04',
    front: 'Hoe sluit je de cursus goed af?',
    back: 'Bedank jezelf en doe nog één keer je favoriete oefening. Schrijf een briefje aan jezelf voor later. En vier het, klein of groot.'
  }
];
