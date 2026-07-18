import type { Flashcard, Week } from '../types';

/**
 * Week 5 — Het waarnemende zelf (self-as-context).
 * Bronnen: research/act-deep-dive.md §2.4 (schaakbord, hemel-weer, observer exercise).
 * Alle teksten origineel, B1, je-vorm. Schrijfrichtlijnen: src/content/README.md.
 */
export const week05: Week = {
  id: 'w05',
  number: 5,
  title: 'Het waarnemende zelf',
  tagline: 'Ontdekken dat jij meer bent dan je gedachten en gevoelens.',
  lessons: [
    {
      id: 'w05-l01',
      weekId: 'w05',
      order: 1,
      kind: 'lesson',
      title: 'Wie kijkt er mee?',
      minutes: 6,
      tags: ['Waarnemend zelf'],
      intro: [
        'Op één dag heb je veel rollen. Je bent vriend, collega, ouder of kind. Die rollen wisselen steeds.',
        'Ook je gedachten en gevoelens veranderen de hele dag. Maar er is iets dat al die verandering ziet. Er is een deel van jou dat rustig meekijkt.',
        'Dat deel noemen we het waarnemende zelf. Het is er al je hele leven. Het was er toen je klein was, en het is er nu nog.'
      ],
      metaphorCard: {
        title: 'Het schaakbord',
        text: 'Op een schaakbord vechten witte en zwarte stukken. Jouw gedachten en gevoelens zijn die stukken. Jij bent het bord: je voelt alles, maar geen stuk kan het bord breken.',
        art: 'stroom'
      },
      exercise: {
        title: 'Even meekijken',
        steps: [
          { n: 1, title: 'Ga rustig zitten', text: 'Zit ergens comfortabel. Je ogen mogen open of dicht.', seconds: 30 },
          { n: 2, title: 'Merk je lichaam op', text: 'Voel de stoel onder je. Voel je voeten op de grond. Wie of wat merkt dat allemaal op?', seconds: 45 },
          { n: 3, title: 'Merk een gedachte op', text: 'Er komt vast een gedachte langs. Kijk er even naar. Jij ziet de gedachte, dus jij bent meer dan die gedachte.', seconds: 60 },
          { n: 4, title: 'Merk een gevoel op', text: 'Misschien voel je rust, of juist onrust. Ook dat gevoel wordt opgemerkt. Door het deel van jou dat meekijkt.', seconds: 60 },
          { n: 5, title: 'Kom rustig terug', text: 'Kijk om je heen. Dat deel van jou dat meekijkt, is er altijd. Ook op drukke dagen.', seconds: 20 }
        ]
      },
      reflection: 'Misschien voelde dit rustig, misschien vreemd of lastig. Allebei is normaal. Het idee van een meekijkend zelf went langzaam.',
      assignment: 'Kies deze week één vast moment per dag. Vraag dan even: "Wie merkt dit nu op?" Meer hoeft niet.',
      relatedSkillIds: ['afstand-observeren'],
      flashcardIds: ['fc-w05-l01-a', 'fc-w05-l01-b', 'fc-w05-l01-c']
    },
    {
      id: 'w05-l02',
      weekId: 'w05',
      order: 2,
      kind: 'lesson',
      title: 'De hemel en het weer',
      minutes: 5,
      tags: ['Waarnemend zelf'],
      intro: [
        'Boosheid of somberheid kan zo groot voelen dat je denkt: zo ben ik. Maar je hébt een gevoel. Je bent het gevoel niet.',
        'Denk aan de lucht. Er is weer: regen, wind, soms een storm. Maar boven het weer is altijd de rustige hemel.',
        'Jij bent als die hemel. Je gevoelens zijn het weer. Weer verandert altijd. De hemel blijft er, onbeschadigd.'
      ],
      metaphorCard: {
        title: 'De hemel en het weer',
        text: 'Weer komt en gaat: bewolking, regen, zon. De hemel gaat nooit kapot van een storm. Zo ben jij ook: je gevoelens trekken voorbij, jij blijft.',
        art: 'mist'
      },
      exercise: {
        title: 'Van "ik ben" naar "ik voel"',
        steps: [
          { n: 1, title: 'Kies een gevoel', text: 'Denk aan een gevoel dat je de laatste tijd vaak hebt. Bijvoorbeeld boosheid of spanning.', seconds: 30 },
          { n: 2, title: 'Zeg het anders', text: 'Zeg in jezelf niet "ik ben boos", maar "ik voel boosheid". Of: "ik merk dat er boosheid is."', seconds: 45 },
          { n: 3, title: 'Kijk naar het verschil', text: 'Wat verandert er als je het zo zegt? Het gevoel wordt iets dat je hébt, niet iets dat je bént.', seconds: 60 },
          { n: 4, title: 'Adem er ruimte omheen', text: 'Adem rustig door. Stel je voor: het gevoel is weer, en jij bent de wijde hemel eromheen.', seconds: 60 }
        ]
      },
      reflection: 'Het kan gek voelen om anders over je gevoel te praten. Dat is oké. Nieuwe woorden maken langzaam ruimte tussen jou en het gevoel.',
      assignment: 'Let deze week op één "ik ben"-zin over je gevoel. Schrijf hem om naar "ik voel" of "ik merk dat".',
      relatedSkillIds: ['afstand-observeren'],
      flashcardIds: ['fc-w05-l02-a', 'fc-w05-l02-b', 'fc-w05-l02-c']
    },
    {
      id: 'w05-l03',
      weekId: 'w05',
      order: 3,
      kind: 'oefening',
      title: 'De waarnemer oefenen',
      minutes: 8,
      tags: ['Waarnemend zelf'],
      intro: [
        'In deze oefening kijk je bewust met het deel van jou dat meekijkt. Je hoeft niets te veranderen of op te lossen.',
        'Je kijkt steeds naar iets: je lichaam, je adem, je gedachten, je gevoelens. En elke keer vraag je: wie merkt dit op?'
      ],
      exercise: {
        title: 'De waarnemer in 6 stappen',
        steps: [
          { n: 1, title: 'Land in je stoel', text: 'Zit rustig, met je voeten op de grond. Doe je ogen dicht als dat prettig voelt. Anders kijk je zacht voor je uit.', seconds: 30 },
          { n: 2, title: 'Voel je lichaam', text: 'Voel je handen, je benen, de stoel. Je lichaam verandert door de jaren. Maar er is iets dat het nu voelt.', seconds: 60 },
          { n: 3, title: 'Volg je adem', text: 'Volg een paar ademhalingen. Je hoeft niet dieper te ademen. Merk gewoon op dat je ademt.', seconds: 60 },
          { n: 4, title: 'Kijk naar gedachten', text: 'Er komen gedachten voorbij. Dat is prima. Stel je voor dat je ze ziet zoals auto’s langs een weg.', seconds: 90 },
          { n: 5, title: 'Kijk naar gevoelens', text: 'Wat voel je nu? Rust, spanning, vermoeidheid? Benoem het zachtjes. En merk: íemand kijkt ernaar.', seconds: 90 },
          { n: 6, title: 'Vraag: wie kijkt er?', text: 'Dat deel dat alles opmerkt, is er al je hele leven. Als kind, als tiener, en nu. Dat ben jij, diep vanbinnen.', seconds: 60 }
        ]
      },
      reflection: 'Deze oefening kan vreemd of juist heel vertrouwd voelen. Er is geen goede uitkomst. Alleen kijken is al genoeg.',
      assignment: 'Herhaal deze oefening deze week twee keer, bijvoorbeeld voor het slapen. Kort mag ook: drie minuten is prima.',
      relatedSkillIds: ['afstand-observeren'],
      flashcardIds: ['fc-w05-l03-a', 'fc-w05-l03-b']
    },
    {
      id: 'w05-l04',
      weekId: 'w05',
      order: 4,
      kind: 'herhaling',
      title: 'Terugblik op je week',
      minutes: 4,
      intro: [
        'Deze week ontdekte je het waarnemende zelf: het deel van jou dat rustig meekijkt. Tijd voor een korte terugblik.',
        'Terugblikken is geen toets. Je kijkt gewoon wat je deze week opviel, zonder oordeel over goed of fout.'
      ],
      exercise: {
        title: 'Terugblik in 4 stappen',
        steps: [
          { n: 1, title: 'Denk aan je oefeningen', text: 'Welke oefening deed je deze week? De schaakbord, de hemel, of de waarnemer?', seconds: 45 },
          { n: 2, title: 'Kies één moment', text: 'Kies een moment waarop je merkte: ik ben meer dan dit gevoel. Groot of klein, alles telt.', seconds: 60 },
          { n: 3, title: 'Benoem wat hielp', text: 'Wat hielp jou het meest? De metafoor, de woorden "ik voel", of de oefening zelf?', seconds: 60 },
          { n: 4, title: 'Neem het mee', text: 'Kies één ding dat je volgende week blijft gebruiken. Klein is goed.', seconds: 30 }
        ]
      },
      reflection: 'Het is prima als het waarnemende zelf nog vaag voelt. Het is een stil idee. Het groeit door herhaling, niet door forceren.',
      assignment: 'Gebruik volgende week één keer per dag de zin "ik merk dat ..." als er een sterk gevoel is.',
      relatedSkillIds: ['afstand-observeren'],
      flashcardIds: ['fc-w05-l04-a', 'fc-w05-l04-b']
    }
  ]
};

export const week05Flashcards: Flashcard[] = [
  {
    id: 'fc-w05-l01-a',
    lessonId: 'w05-l01',
    skillId: 'afstand-observeren',
    front: 'Wat is het waarnemende zelf?',
    back: 'Het deel van jou dat alles opmerkt: je gedachten, gevoelens en lichaam. Het verandert niet mee met wat je voelt. Het is er altijd, rustig op de achtergrond.'
  },
  {
    id: 'fc-w05-l01-b',
    lessonId: 'w05-l01',
    front: 'Hoe werkt de schaakbord-metafoor?',
    back: 'Je gedachten en gevoelens zijn de schaakstukken die vechten. Jij bent het bord zelf. Het bord voelt alles, maar geen stuk kan het bord kapotmaken.'
  },
  {
    id: 'fc-w05-l01-c',
    lessonId: 'w05-l01',
    front: 'Wat helpt als een gevoel heel groot lijkt?',
    back: 'Kijk naar het deel van jou dat het gevoel opmerkt. Jij hebt het gevoel, maar je bént het niet. Zo wordt het iets dat langskomt, niet alles wat er is.'
  },
  {
    id: 'fc-w05-l02-a',
    lessonId: 'w05-l02',
    front: 'Wat betekent de metafoor van de hemel en het weer?',
    back: 'Jij bent de hemel, je gevoelens zijn het weer. Weer verandert steeds en gaat weer weg. De hemel blijft altijd heel en aanwezig.'
  },
  {
    id: 'fc-w05-l02-b',
    lessonId: 'w05-l02',
    front: 'Wat zeg je in plaats van "ik ben boos"?',
    back: 'Bijvoorbeeld: "ik voel boosheid" of "ik merk dat er boosheid is". Zo zie je: je hébt het gevoel, je bent het niet.'
  },
  {
    id: 'fc-w05-l02-c',
    lessonId: 'w05-l02',
    front: 'Waarom helpt het om je gevoel anders te benoemen?',
    back: 'Het maakt afstand tussen jou en het gevoel. Het gevoel mag er zijn, zonder dat het jou helemaal overneemt.'
  },
  {
    id: 'fc-w05-l03-a',
    lessonId: 'w05-l03',
    front: 'Wat doe je bij de waarnemer-oefening?',
    back: 'Je kijkt achter elkaar naar je lichaam, je adem, je gedachten en je gevoelens. Bij elk stukje vraag je: wie merkt dit op?'
  },
  {
    id: 'fc-w05-l03-b',
    lessonId: 'w05-l03',
    front: 'Wat blijft er hetzelfde door je hele leven heen?',
    back: 'Het deel van jou dat opmerkt. Je lichaam, gedachten en rollen veranderen steeds. De waarnemer erachter is er altijd geweest.'
  },
  {
    id: 'fc-w05-l04-a',
    lessonId: 'w05-l04',
    front: 'Noem de twee beelden van deze week.',
    back: 'Het schaakbord: jij bent het bord, niet de vechtende stukken. En de hemel: jij bent de lucht, je gevoelens zijn het weer.'
  },
  {
    id: 'fc-w05-l04-b',
    lessonId: 'w05-l04',
    front: 'Wat vraag je jezelf als je in een sterk gevoel zit?',
    back: '"Wie merkt dit op?" Die vraag brengt je naar het deel van jou dat meekijkt. Dat deel is rustiger dan het gevoel zelf.'
  }
];
