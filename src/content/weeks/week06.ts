import type { Flashcard, Week } from '../types';

/**
 * Week 6 — Aandacht & herhaling.
 * Les 1 is de VERS-vaardigheid "aandacht verplaatsen / helemaal meedoen"
 * (research/vers-deep-dive.md §6.1, vaardigheid 4), geframed als bewuste
 * downshift — niet als vermijding. De rest van de week is herhaling van
 * de concepten uit week 1–5 (pannetjesmodel, observeren, acceptatie,
 * defusie, waarnemende zelf). Alle teksten origineel, B1, je-vorm.
 */
export const week06: Week = {
  id: 'w06',
  number: 6,
  title: 'Aandacht & herhaling',
  tagline: 'Halverwege: verstevigen wat je al kunt.',
  lessons: [
    {
      id: 'w06-l01',
      weekId: 'w06',
      order: 1,
      kind: 'lesson',
      title: 'Aandacht versterken',
      minutes: 8,
      tags: ['Aandacht verplaatsen'],
      intro: [
        'Je aandacht is als een lamp. Je kunt kiezen waar je hem op richt. Dat is een echte vaardigheid, en hij wordt sterker met oefenen.',
        'Soms is het slim om je aandacht bewust te verplaatsen. Bijvoorbeeld naar iets aangenaams of nuttigs, als je hoofd vol zit.',
        'Belangrijk: dit is geen weglopen. Je vlucht niet weg bij het gevoel. Je kiest er bewust voor even ergens anders te kijken. Later kun je terugkeren.'
      ],
      metaphorCard: {
        title: 'De lamp van je aandacht',
        text: 'Je aandacht is een lamp met een richtknop. Je kunt hem richten op wat piekt, of bewust op iets rustigs. Jij houdt de knop vast.',
        art: 'stroom'
      },
      exercise: {
        title: 'Je aandachtsmenu maken',
        steps: [
          { n: 1, title: 'Kies je moment', text: 'Denk aan een moment waarop je hoofd vaak vol zit. Bijvoorbeeld piekeren in bed.', seconds: 30 },
          { n: 2, title: 'Verzamel activiteiten', text: 'Noteer drie dingen die je aandacht vangen: muziek, wandelen, puzzelen, koken. Gewoon dingen die jij fijn vindt.', seconds: 90 },
          { n: 3, title: 'Kies er één', text: 'Kies één activiteit voor als het borrelt (pan 3). Eentje die je echt kunt doen, ook als je moe bent.', seconds: 60 },
          { n: 4, title: 'Doe het helemaal', text: 'Probeer die activiteit vandaag vijf minuten. Doe hem met volle aandacht: ruik, kijk, voel. Dat heet helemaal meedoen.', seconds: 300 }
        ]
      },
      reflection: 'Aandacht verplaatsen werkt niet altijd meteen. Dat zegt niets over jou. Het is een spier: langzaam sterker, niet in één dag.',
      assignment: 'Oefen deze week drie keer met je aandachtsmenu. Kies bewust: nu kijk ik even ergens anders naar.',
      relatedSkillIds: ['ademanker'],
      flashcardIds: ['fc-w06-l01-a', 'fc-w06-l01-b', 'fc-w06-l01-c']
    },
    {
      id: 'w06-l02',
      weekId: 'w06',
      order: 2,
      kind: 'herhaling',
      title: 'Alles opnieuw bekijken',
      minutes: 6,
      tags: ['Herhaling'],
      intro: [
        'Je bent halverwege de cursus. Je kent nu vijf grote ideeën: het pannetjesmodel, observeren, acceptatie, defusie en het waarnemende zelf.',
        'Deze les is een quiz tegen jezelf. Niet om punten te scoren. Juist door te proberen te herinneren, blijft het beter hangen.'
      ],
      exercise: {
        title: 'Quiz: test jezelf in 4 stappen',
        steps: [
          { n: 1, title: 'Week 1 en 2', text: 'Wat zeggen de vijf pannetjes over je gevoel? En wat doe je bij observeren zonder oordeel?', seconds: 90 },
          { n: 2, title: 'Week 3', text: 'Wat is acceptatie? Waarom kost vechten tegen gevoelens zoveel energie?', seconds: 90 },
          { n: 3, title: 'Week 4', text: 'Wat is defusie? Hoe neem je afstand van een gedachte als "ik kan niets"?', seconds: 90 },
          { n: 4, title: 'Week 5', text: 'Wat is het waarnemende zelf? Noem één beeld dat je bijhoudt: schaakbord of hemel.', seconds: 90 }
        ]
      },
      reflection: 'Wist je niet alles meer? Heel normaal. Herhaling hoort bij leren. De flashcards van deze week helpen je verder.',
      assignment: 'Draai deze week elke dag een paar flashcards om in de app. Twee minuten is genoeg.',
      relatedSkillIds: [],
      flashcardIds: ['fc-w06-l02-a', 'fc-w06-l02-b', 'fc-w06-l02-c', 'fc-w06-l02-d']
    },
    {
      id: 'w06-l03',
      weekId: 'w06',
      order: 3,
      kind: 'oefening',
      title: 'Je favoriete oefeningen',
      minutes: 8,
      tags: ['Herhaling'],
      intro: [
        'In vijf weken heb je veel oefeningen geprobeerd. Sommige pasten goed bij jou, andere minder. Dat is precies de bedoeling.',
        'Vandaag kies je jouw favorieten en oefen je ze opnieuw. Herhaling maakt ze sterker. Straks heb je ze paraat als het moeilijk wordt.'
      ],
      exercise: {
        title: 'Jouw top twee trainen',
        steps: [
          { n: 1, title: 'Kijk terug', text: 'Blader door de lessen van week 1 tot en met 5. Welke oefeningen gaven jou iets?', seconds: 60 },
          { n: 2, title: 'Kies twee favorieten', text: 'Kies er twee: bijvoorbeeld ademhalen met aandacht, gronden, ruimte maken of bladeren op de stroom.', seconds: 45 },
          { n: 3, title: 'Oefen de eerste', text: 'Doe je eerste favoriet nu, rustig. Gebruik de stappen uit die les.', seconds: 180 },
          { n: 4, title: 'Oefen de tweede', text: 'Doe daarna je tweede favoriet. Merk op: het gaat al makkelijker dan de eerste keer.', seconds: 180 },
          { n: 5, title: 'Noteer je keuze', text: 'Schrijf je twee favorieten ergens op. Bijvoorbeeld in je notities of op een briefje op de koelkast.', seconds: 60 }
        ]
      },
      reflection: 'Favorieten mogen veranderen. Wat nu werkt, hoeft niet voor altijd te werken. Jij mag steeds opnieuw kiezen.',
      assignment: 'Doe deze week elke dag één van je twee favorieten. Ook op rustige dagen, want dan train je voor de drukke dagen.',
      relatedSkillIds: ['ademanker', 'bladeren-op-de-stroom', 'gronden-54321'],
      flashcardIds: ['fc-w06-l03-a', 'fc-w06-l03-b']
    },
    {
      id: 'w06-l04',
      weekId: 'w06',
      order: 4,
      kind: 'herhaling',
      title: 'Halverwege: wat helpt jou?',
      minutes: 5,
      intro: [
        'Je staat halverwege. Dat is een echt moment om stil te staan. Niet om te beoordelen, maar om te kijken wat jou tot nu toe helpt.',
        'Misschien gaat het oefenen elke dag goed. Misschien lukte het minder vaak. Beide zeggen iets waardevols over wat jij nodig hebt.'
      ],
      exercise: {
        title: 'Halverwege in 4 stappen',
        steps: [
          { n: 1, title: 'Kijk naar je week', text: 'Hoe vaak heb je geoefend of een les gedaan? Schat rustig, zonder oordeel.', seconds: 60 },
          { n: 2, title: 'Noem wat helpt', text: 'Wat hielp jou het meest tot nu toe? Een beeld, een oefening, een zin. Schrijf er één op.', seconds: 90 },
          { n: 3, title: 'Noem wat lastig was', text: 'Wat was lastig? Tijd vinden, concentreren, iets anders? Ook dat mag er zijn.', seconds: 60 },
          { n: 4, title: 'Kies je volgende stap', text: 'Kies één klein ding voor de komende weken. Bijvoorbeeld: oefenen aan een vast moment koppelen.', seconds: 60 }
        ]
      },
      reflection: 'Halverwege kijken is al iets om trots op te zijn. Of je nu veel of weinig oefende: je bent er nog, en dat telt.',
      assignment: 'Vertel deze week aan iemand die je vertrouwt één ding dat je hebt geleerd. Hardop zeggen helpt het beklijven.',
      relatedSkillIds: [],
      flashcardIds: ['fc-w06-l04-a', 'fc-w06-l04-b']
    }
  ]
};

/**
 * Herhaal- en quizkaarten. De kaarten van w06-l02 doorlopen de concepten
 * van week 1–5 (interleaved): pannetjesmodel, observeren, acceptatie,
 * defusie. Het waarnemende zelf zit in week 5 en komt terug bij w06-l04.
 */
export const week06Flashcards: Flashcard[] = [
  {
    id: 'fc-w06-l01-a',
    lessonId: 'w06-l01',
    front: 'Wat is aandacht verplaatsen?',
    back: 'Bewust kiezen waar je aandacht heen gaat, bijvoorbeeld naar een fijne of nuttige activiteit. Jij richt de lamp, niet je hoofd.'
  },
  {
    id: 'fc-w06-l01-b',
    lessonId: 'w06-l01',
    front: 'Wat is het verschil tussen verplaatsen en vermijden?',
    back: 'Bij vermijden vlucht je en kom je nooit terug. Bij verplaatsen kíes je even voor rust, en je kunt later terugkijken. De keuze is van jou.'
  },
  {
    id: 'fc-w06-l01-c',
    lessonId: 'w06-l01',
    front: 'Wat betekent helemaal meedoen?',
    back: 'Een activiteit helemaal doen, met al je aandacht. Je ruikt, kijkt en voelt echt. Half meedoen geeft je hoofd weer ruimte om te piekeren.'
  },
  {
    id: 'fc-w06-l02-a',
    lessonId: 'w06-l02',
    front: 'Wat betekent pan 4 (Pruttelt) in het pannetjesmodel?',
    back: 'Je voelt je echt niet lekker en je controle wordt kleiner. Tijd voor stevige vaardigheden, zoals gronden met je zintuigen.'
  },
  {
    id: 'fc-w06-l02-b',
    lessonId: 'w06-l02',
    front: 'Wat is observeren zonder oordeel?',
    back: 'Kijken naar wat er is, zonder meteen te vinden dat het goed of fout is. Je benoemt het gewoon: "ik merk spanning."'
  },
  {
    id: 'fc-w06-l02-c',
    lessonId: 'w06-l02',
    front: 'Wat is acceptatie?',
    back: 'Ruimte maken voor een gevoel in plaats van ertegen te vechten. Het gevoel mag er even zijn. Vechten kost meer energie dan het gevoel zelf.'
  },
  {
    id: 'fc-w06-l02-d',
    lessonId: 'w06-l02',
    front: 'Wat is defusie?',
    back: 'Afstand nemen van je gedachten. Een gedachte is een gedachte, geen feit. Bijvoorbeeld: "ik merk de gedachte dat ik niets kan."'
  },
  {
    id: 'fc-w06-l03-a',
    lessonId: 'w06-l03',
    front: 'Waarom herhaal je oefeningen die al lukken?',
    back: 'Herhaling maakt een vaardigheid sterker en sneller beschikbaar. Je traint op rustige momenten, zodat het ook werkt als het stormt.'
  },
  {
    id: 'fc-w06-l03-b',
    lessonId: 'w06-l03',
    front: 'Hoeveel favoriete oefeningen kies je?',
    back: 'Twee is genoeg. Klein houden helpt: twee dingen die je echt doet, werken beter dan tien die je vergeet.'
  },
  {
    id: 'fc-w06-l04-a',
    lessonId: 'w06-l04',
    front: 'Wat is het waarnemende zelf ook alweer?',
    back: 'Het deel van jou dat meekijkt en alles opmerkt. Je gedachten en gevoelens veranderen, de waarnemer blijft. Jij bent het schaakbord, niet de stukken.'
  },
  {
    id: 'fc-w06-l04-b',
    lessonId: 'w06-l04',
    front: 'Wat doe je als oefenen een tijdje niet lukte?',
    back: 'Zacht opnieuw beginnen, kleiner dan je denkt. Twee minuten telt ook. Terugkeren mag altijd, ook na een rustige week.'
  }
];
