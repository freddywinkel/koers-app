import type { Week, Flashcard } from '../types';

/**
 * Week 9 — Problemen aanpakken
 * -----------------------------
 * VERS-vaardigheid 5 (problemen aanpakken), verweven met ACT:
 * eerst rust (pan verlagen), dan de vraag "kan ik hier iets aan doen?"
 * (oplossen vs. accepteren), en het zevenstappenplan als kernoefening.
 * De integrator koppelt dit bestand aan curriculum.ts en flashcards.ts.
 */
export const week09: Week = {
  id: 'w09',
  number: 9,
  title: 'Problemen aanpakken',
  tagline: 'Van piekeren naar rustig oplossen, stap voor stap.',
  lessons: [
    {
      id: 'w09-l01',
      weekId: 'w09',
      order: 1,
      kind: 'lesson',
      title: 'Rustig kijken naar problemen',
      minutes: 6,
      tags: ['Problemen aanpakken'],
      intro: [
        'De afgelopen weken leerde je rustig kijken naar je gevoelens en gedachten. Deze week gebruik je die rust voor iets nieuws: problemen aanpakken.',
        'Veel problemen voelen groter dan ze zijn. Zeker als je pannetje hoog staat. Dan lijkt alles dringend en onmogelijk. Daarom geldt hier: eerst rust, dan pas kijken.',
        'Een probleem is trouwens iets anders dan een gevoel. Verdriet mag je voelen. Een kapotte wasmachine kun je oplossen. Die twee door elkaar halen, kost veel energie.'
      ],
      metaphorCard: {
        title: 'Heldere zee',
        text: 'Na storm is het water troebel. Pas als de golven zakken, wordt de zee weer helder. Zo is het ook met problemen: eerst rust, dan pas kijken.',
        art: 'golf'
      },
      exercise: {
        title: 'Eerst de pan, dan het probleem',
        steps: [
          { n: 1, title: 'Check je pannetje', text: 'Voel even: in welk pannetje zit je nu? Rustig, Rimpelt, Borrelt, Pruttelt of Kookt over.', seconds: 30 },
          { n: 2, title: 'Verlaag de warmte', text: 'Zit je bij pan 3 of hoger? Doe dan eerst je Ademanker of de 5-4-3-2-1. Daarna komt het oplossen wel.', seconds: 120 },
          { n: 3, title: 'Zet het probleem op papier', text: 'Schrijf het in één zin op. Klein en concreet. "Ik heb ruzie met mijn zus" werkt. "Alles gaat mis" niet.', seconds: 60 },
          { n: 4, title: 'Kijk er rustig naar', text: 'Lees je zin nog eens. Het probleem is er. En jij kijkt ernaar, zonder meteen te handelen. Dat is al een stap.', seconds: 30 }
        ]
      },
      reflection: 'Misschien werd het probleem kleiner zodra het op papier stond. Misschien niet. Allebei is oké. Rustig kijken is al een oefening op zich.',
      assignment: 'Deze week: als er een probleem opduikt, noem dan eerst je pannetje. Schrijf daarna het probleem in één zin op. Meer hoeft nog niet.',
      relatedSkillIds: ['ademanker', 'gronden-54321'],
      flashcardIds: ['w09-l01-f1', 'w09-l01-f2', 'w09-l01-f3']
    },
    {
      id: 'w09-l02',
      weekId: 'w09',
      order: 2,
      kind: 'lesson',
      title: 'Van piekeren naar oplossen',
      minutes: 6,
      tags: ['Piekeren', 'Problemen aanpakken'],
      intro: [
        'Piekeren voelt als bezig zijn met een probleem. Maar er gebeurt niets. Je hoofd draait dezelfde rondjes, steeds een beetje sneller.',
        'Oplossen is iets anders. Daar hoort een echte stap bij: kijken wat er is, en bedenken wat je kunt doen. Piekeren is malen. Oplossen is bewegen.',
        'De eerste vraag is altijd: kan ik hier iets aan doen? Zo ja, dan ga je aan de slag. Zo nee, dan past accepteren — dat oefende je in week 3. Beide antwoorden zijn goed. Alleen piekeren helpt niet.'
      ],
      metaphorCard: {
        title: 'Rondjes zwemmen of roeien',
        text: 'Piekeren is zwemmen in rondjes in de stroom: veel beweging, nergens heen. Oplossen is roeien naar de oever. Kleine slagen, één richting.',
        art: 'stroom'
      },
      exercise: {
        title: 'Piekeren of oplossen?',
        steps: [
          { n: 1, title: 'Kies één zorg', text: 'Denk aan iets waar je de laatste tijd over piekert. Schrijf het in één zin op.', seconds: 60 },
          { n: 2, title: 'Stel de ene vraag', text: 'Kan ik hier iets aan doen? Ja of nee. Eerlijk antwoorden is genoeg.', seconds: 30 },
          { n: 3, title: 'Ja: kies een eerste stap', text: 'Kun je er iets aan doen? Schrijf één kleine eerste stap op. Het zevenstappenplan uit de volgende les helpt je daarbij.', seconds: 60 },
          { n: 4, title: 'Nee: leg het neer', text: 'Kun je er niets aan doen? Leg de zorg dan op een blaadje op de stroom. Of zet hem op een later-lijstje.', seconds: 60 },
          { n: 5, title: 'Geef zorgen een plek', text: 'Komt de zorg vaak terug? Geef hem dan een vaste plek: vijftien minuten piekertijd per dag. Daarbuiten mag hij wachten.', seconds: 45 }
        ]
      },
      reflection: 'Alleen al merken dat je aan het piekeren was, is winst. Je hoeft nog niet alles op te lossen. Eerlijk kijken is genoeg.',
      assignment: 'Let deze week op je piekermomenten. Stel bij elke zorg de vraag: kan ik hier iets aan doen? Schrijf het antwoord er even bij.',
      relatedSkillIds: ['problemen-aanpakken', 'acceptatie-toestaan'],
      flashcardIds: ['w09-l02-f1', 'w09-l02-f2', 'w09-l02-f3']
    },
    {
      id: 'w09-l03',
      weekId: 'w09',
      order: 3,
      kind: 'oefening',
      title: 'Het zevenstappenplan',
      minutes: 10,
      tags: ['Stappenplan'],
      intro: [
        'Nu komt alles samen. Dit zevenstappenplan is de vijfde vaardigheid uit de VERS-training: problemen aanpakken. Het helpt je om rustig en in stappen te werken, ook bij lastige dingen.',
        'Je gebruikt hierbij wat je al kunt: je adem, je waarnemende blik en je kompas. Daarom komt deze les pas nu. De basis heb je al.',
        'Neem bij deze oefening een echt probleem. Klein is prima. Een onbeantwoorde mail of een afspraak verzetten is goed oefenmateriaal.'
      ],
      metaphorCard: {
        title: 'Een pad door de mist',
        text: 'Je hoeft de hele weg niet te zien. Alleen de volgende stap. Stap voor stap kom je door de mist heen.',
        art: 'mist'
      },
      exercise: {
        title: 'Het zevenstappenplan doorlopen',
        steps: [
          { n: 1, title: 'Word rustig', text: 'Check je pannetje. Zit je bij pan 3 of hoger? Doe dan eerst een minuut je Ademanker.', seconds: 60 },
          { n: 2, title: 'Benoem het probleem', text: 'Schrijf het probleem in één korte zin op. Concreet en klein.', seconds: 60 },
          { n: 3, title: 'Check je beeld', text: 'Kijk je misschien door een oude bril van vroeger? Vraag je af: is dit echt zo, of denk ik dat alleen omdat het vroeger zo was? Wat zou een lieve vriend of vriendin zeggen?', seconds: 90 },
          { n: 4, title: 'Kies: oplossen of accepteren', text: 'Kun je hier iets aan doen? Nee? Kies dan accepteren en gebruik je oefeningen uit week 3. Ja? Ga verder.', seconds: 60 },
          { n: 5, title: 'Bedenk oplossingen', text: 'Schrijf alles op wat je zou kunnen doen. Minstens drie dingen. Ook gekke ideeën tellen mee. Nog niet oordelen.', seconds: 120 },
          { n: 6, title: 'Kies wat past', text: 'Welke oplossing past bij jouw kompas? En welke is nu haalbaar? Kies er één.', seconds: 60 },
          { n: 7, title: 'Maak je plan', text: 'Wat is je eerste kleine stap? Wanneer zet je hem? Wie kan helpen? Kijk later vriendelijk terug: hoe ging het?', seconds: 60 }
        ]
      },
      reflection: 'De eerste keer voelt dit plan misschien onwennig. Dat hoort bij iets nieuws. Elke keer dat je het doorloopt, wordt het pad begaanbaarder.',
      assignment: 'Gebruik het zevenstappenplan deze week bij één echt probleem. Klein is prima. Schrijf je stappen op, zodat je ze kunt teruglezen.',
      relatedSkillIds: ['problemen-aanpakken'],
      flashcardIds: ['w09-l03-f1', 'w09-l03-f2', 'w09-l03-f3']
    },
    {
      id: 'w09-l04',
      weekId: 'w09',
      order: 4,
      kind: 'herhaling',
      title: 'Terugblik op je week',
      minutes: 4,
      tags: ['Terugblik'],
      intro: [
        'Deze week leerde je anders naar problemen kijken. Eerst rust. Dan één zin. Dan de vraag: kan ik hier iets aan doen?',
        'Soms was het antwoord ja en zette je een stap. Soms was het nee en koos je accepteren. Allebei is aanpakken. Allebei telt.'
      ],
      exercise: {
        title: 'Je week in drie vragen',
        steps: [
          { n: 1, title: 'Rustig bekeken', text: 'Welk probleem heb je deze week rustig bekeken, in plaats van meteen te reageren?', seconds: 45 },
          { n: 2, title: 'Opgelost of geaccepteerd', text: 'Wat heb je opgelost? En wat heb je bewust geaccepteerd? Allebei is een vorm van aanpakken.', seconds: 60 },
          { n: 3, title: 'Vooruit kijken', text: 'Welke stap van het plan was lastig? Wat helpt je om die stap de volgende keer makkelijker te maken?', seconds: 45 }
        ]
      },
      reflection: 'Trots mag. Je hebt geoefend met een vaardigheid die veel mensen nooit leren. Kleine oefening, echte verandering.',
      assignment: 'Bewaar je stappenplannen van deze week. Ze zijn het begin van jouw eigen handleiding voor lastige momenten.',
      relatedSkillIds: ['problemen-aanpakken'],
      flashcardIds: ['w09-l04-f1', 'w09-l04-f2']
    }
  ]
};

export const week09Flashcards: Flashcard[] = [
  {
    id: 'w09-l01-f1',
    lessonId: 'w09-l01',
    skillId: 'ademanker',
    front: 'Wat doe je eerst als je een probleem wilt aanpakken?',
    back: 'Eerst voel je in welk pannetje je zit. Bij pan 3 of hoger verlaag je eerst de warmte, bijvoorbeeld met je Ademanker. Daarna pas kijk je naar het probleem.'
  },
  {
    id: 'w09-l01-f2',
    lessonId: 'w09-l01',
    front: 'Waarom schrijf je een probleem in één zin op?',
    back: 'Zo wordt het klein en concreet. "Alles gaat mis" kun je niet oplossen. "Ik heb ruzie met mijn zus" wel.'
  },
  {
    id: 'w09-l01-f3',
    lessonId: 'w09-l01',
    front: 'In welke pannetjes kun je het beste nadenken over oplossingen?',
    back: 'In pan 1 of 2, soms 3. Bij pan 4 of 5 wil je hoofd alleen nog overleven. Dan geldt: eerst rust, dan pas oplossen.'
  },
  {
    id: 'w09-l02-f1',
    lessonId: 'w09-l02',
    front: 'Wat is het verschil tussen piekeren en oplossen?',
    back: 'Piekeren is malen: dezelfde rondjes, geen stap. Oplossen is bewegen: kijken wat er is en één stap bedenken.'
  },
  {
    id: 'w09-l02-f2',
    lessonId: 'w09-l02',
    skillId: 'afstand-observeren',
    front: 'Welke vraag stel je bij elke zorg?',
    back: '"Kan ik hier iets aan doen?" Ja: kies een kleine stap. Nee: kies accepteren, bijvoorbeeld met een blaadje op de stroom.'
  },
  {
    id: 'w09-l02-f3',
    lessonId: 'w09-l02',
    front: 'Wat doe je met een zorg die je niet kunt oplossen?',
    back: 'Dan past accepteren in plaats van vechten. Je legt de zorg neer of zet hem op een later-lijstje. Zo houd je energie over voor wat wel kan.'
  },
  {
    id: 'w09-l03-f1',
    lessonId: 'w09-l03',
    front: 'Wat zijn de zeven stappen van het zevenstappenplan?',
    back: '1. Word rustig. 2. Benoem het probleem. 3. Check je beeld. 4. Kies: oplossen of accepteren. 5. Bedenk oplossingen. 6. Kies wat past. 7. Maak je plan.'
  },
  {
    id: 'w09-l03-f2',
    lessonId: 'w09-l03',
    skillId: 'afstand-observeren',
    front: 'Wat doe je bij stap 3, "check je beeld"?',
    back: 'Je kijkt of een oud patroon je zicht vertroebelt. Vraag je af: is dit echt zo? Wat zou een lieve vriend of vriendin hierover zeggen?'
  },
  {
    id: 'w09-l03-f3',
    lessonId: 'w09-l03',
    front: 'Wat doe je als je maar één oplossing kunt bedenken?',
    back: 'Probeer er toch minstens drie op te schrijven, ook rare. Daarna kies je wat past bij je kompas en bij wat nu kan.'
  },
  {
    id: 'w09-l04-f1',
    lessonId: 'w09-l04',
    front: 'Waarom is accepteren soms de beste aanpak?',
    back: 'Sommige dingen kun je niet veranderen, zoals het verleden of de gevoelens van anderen. Vechten kost daar alleen maar energie. Accepteren geeft die energie terug.'
  },
  {
    id: 'w09-l04-f2',
    lessonId: 'w09-l04',
    front: 'Hoe merk je dat het zevenstappenplan begint te werken?',
    back: 'Je kijkt rustiger naar problemen. Je stelt eerder de vraag: kan ik hier iets aan doen? En je zet kleinere, echte stappen.'
  }
];
