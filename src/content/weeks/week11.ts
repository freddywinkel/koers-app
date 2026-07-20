import type { Flashcard, Week } from '../types';

/**
 * Week 11 — Crisis & veiligheid.
 * Signalen herkennen, het Emotiehanteringsplan (EHP) opbouwen,
 * en weten waar professionele hulp te vinden is (o.a. 113-route).
 * Toon: extra zacht en veilig. Alle teksten zijn origineel geschreven.
 */
export const week11: Week = {
  id: 'w11',
  number: 11,
  title: 'Crisis & veiligheid',
  tagline: 'Signalen herkennen en je eigen signaleringsplan maken.',
  lessons: [
    {
      id: 'w11-l01',
      weekId: 'w11',
      order: 1,
      kind: 'lesson',
      title: 'Signalen herkennen',
      minutes: 6,
      tags: ['Signalen', 'Pannetjesmodel'],
      intro: [
        'Niemand springt in één keer van pan 1 naar pan 5. Het lijkt soms wel zo. Maar er is bijna altijd een opbouw.',
        'Je lichaam en je gedrag waarschuwen je vaak als eerste. Misschien slaap je slechter. Of je trekt je terug. Of je wordt kortaf. Dat zijn signalen.',
        'In deze les ga je op zoek naar jouw eigen signalen. Niet om jezelf te controleren. Maar om eerder zacht voor jezelf te kunnen zijn.'
      ],
      metaphorCard: {
        title: 'Melk op het vuur',
        text: 'Melk kookt niet in één keer over. Eerst komt er stoom. Dan kleine belletjes aan de rand. Wie goed kijkt, ziet het aankomen. Zo is het ook met je gevoelens.',
        art: 'mist'
      },
      exercise: {
        title: 'Je signalen in beeld',
        steps: [
          { n: 1, title: 'Denk aan rust', text: 'Denk aan een periode in pan 1 of 2. Hoe merk je dat het goed gaat? Bijvoorbeeld: je slaapt lekker en je maakt grappen.', seconds: 60 },
          { n: 2, title: 'Denk aan Borrelt', text: 'Denk aan een moment in pan 3. Wat merkte je aan je lichaam? Welke gedachten had je? Piekeren is ook een signaal.', seconds: 90 },
          { n: 3, title: 'Kijk naar je gedrag', text: 'Wat doe jij als het pruttelt? Bijvoorbeeld: mijden, scrollen, nergens aan beginnen. Alles mag je opschrijven.', seconds: 90 },
          { n: 4, title: 'Kies je drie vroegste signalen', text: 'Schrijf ze op en bewaar ze goed. Je gebruikt ze straks in je eigen plan.', seconds: 60 }
        ]
      },
      reflection: 'Signalen herkennen leer je niet in één keer. Elke keer dat je iets opmerkt, oefen je. Ook als je het pas achteraf ziet.',
      assignment: 'Let deze week op je vroegste signaal. Schrijf elke avond één zin op: vandaag zat ik in pan … en dat merkte ik aan …',
      relatedSkillIds: ['afstand-observeren'],
      flashcardIds: ['w11-l01-f1', 'w11-l01-f2', 'w11-l01-f3']
    },
    {
      id: 'w11-l02',
      weekId: 'w11',
      order: 2,
      kind: 'oefening',
      title: 'Je Emotiehanteringsplan (EHP)',
      minutes: 12,
      tags: ['EHP', 'Veiligheid'],
      intro: [
        'Je hebt nu veel vaardigheden geleerd. Maar op een hevig moment denk je daar niet aan. Dan helpt een plan dat je op een rustige dag maakte.',
        'Dat plan heet het Emotiehanteringsplan, kortweg EHP. Per pan schrijf je op: hoe herken ik dit? Wat helpt mij? Wat kunnen anderen doen?',
        'Vandaag maak je de eerste versie. Hij hoeft niet af te zijn. Volgende week werk je hem verder uit.'
      ],
      metaphorCard: {
        title: 'Een gebruiksaanwijzing van jezelf',
        text: 'Je EHP is een gebruiksaanwijzing die je aan jezelf en aan anderen geeft. Op een moeilijke dag hoef je niet meer na te denken. Je pakt gewoon het plan erbij.',
        art: 'mist'
      },
      exercise: {
        title: 'Je EHP stap voor stap opbouwen',
        steps: [
          { n: 1, title: 'Verzamel je materiaal', text: 'Pak je notities van de vorige lessen erbij. Je signalen, je favoriete oefeningen en je steunpersonen.', seconds: 60 },
          { n: 2, title: 'Pan 1 en 2: Rustig en Rimpelt', text: 'Schrijf op wat je doet om zo te blijven. Bijvoorbeeld: slapen, bewegen, even ademen met aandacht.', seconds: 120 },
          { n: 3, title: 'Pan 3: Borrelt', text: 'Welke signalen horen hierbij? En welke oefening helpt jou hier? Bijvoorbeeld afstand nemen en observeren.', seconds: 120 },
          { n: 4, title: 'Pan 4: Pruttelt', text: 'Houd het nu simpel: kies één grondende oefening, zoals 5-4-3-2-1, en noteer wie je dan kunt bereiken.', seconds: 120 },
          { n: 5, title: 'Pan 5: Kookt over', text: 'Schrijf op: stop alles, grond je en bereik iemand. Leg scherpe of gevaarlijke dingen uit je buurt.', seconds: 120 },
          { n: 6, title: 'Professionele hulp erbij', text: 'Noteer waar je professionele hulp vindt. In de app vind je onder Steun de juiste nummers.', seconds: 60 },
          { n: 7, title: 'Deel je plan', text: 'Laat je plan zien aan iemand die je vertrouwt. Dan weet die persoon wat helpt, als jij het even niet meer weet.', seconds: 60 }
        ]
      },
      reflection: 'Een plan maken terwijl het rustig is, is de beste zorg voor moeilijke momenten. Je plan groeit met je mee. Het hoeft nooit perfect te zijn.',
      assignment: 'Bewaar je EHP op een plek die je snel vindt. Vertel deze week aan minstens één persoon die je vertrouwt dat je dit plan hebt.',
      relatedSkillIds: ['gronden-54321', 'ademanker'],
      flashcardIds: ['w11-l02-f1', 'w11-l02-f2', 'w11-l02-f3']
    },
    {
      id: 'w11-l03',
      weekId: 'w11',
      order: 3,
      kind: 'lesson',
      title: 'Steun vragen is sterk',
      minutes: 5,
      tags: ['Steun', 'Hulp vragen'],
      intro: [
        'Veel mensen vinden hulp vragen moeilijk. Alsof je dan tekortschiet of tot last bent. Maar steun vragen is een vaardigheid. En jij hebt die al geoefend.',
        'Soms is een vriend of familielid genoeg. Soms is professionele hulp nodig. Allebei is oké. Zware gevoelens hoef je niet alleen te dragen.',
        'Denk je weleens aan zelfbeschadiging of aan de dood? Ook dan geldt: je hoeft er niet alleen mee te zitten. Er zijn mensen die je willen helpen. Dag en nacht.'
      ],
      exercise: {
        title: 'Je steunnetwerk in beeld',
        steps: [
          { n: 1, title: 'Wie is er voor je?', text: 'Denk aan één of twee mensen bij wie je terechtkunt. Een groot of klein netwerk, dat maakt niet uit.', seconds: 60 },
          { n: 2, title: 'Oefen een eerste zin', text: 'Bijvoorbeeld: "Het gaat niet zo goed. Mag ik even met je praten?" Meer hoeft het niet te zijn.', seconds: 60 },
          { n: 3, title: 'Weet waar je professionele hulp vindt', text: 'Je huisarts helpt bij klachten die niet kunnen wachten. Bij gedachten aan zelfdoding is er 113 Zelfmoordpreventie. Bel 113 of 0800-0113, of chat op 113.nl. Gratis en anoniem.', seconds: 60 },
          { n: 4, title: 'Bij direct gevaar', text: 'Is er direct gevaar voor jou of iemand anders? Bel dan 112. Dat nummer is er voor noodgevallen.', seconds: 30 }
        ]
      },
      reflection: 'Hulp vragen voelt soms groter dan het is. De meeste mensen vinden het juist fijn als je ze vertrouwt. En professionals doen hun werk met aandacht en zorg.',
      assignment: 'Zet twee nummers in je telefoon: je huisarts en 113 (0800-0113). Dan hoef je niet te zoeken op een moeilijk moment.',
      relatedSkillIds: [],
      flashcardIds: ['w11-l03-f1', 'w11-l03-f2', 'w11-l03-f3']
    },
    {
      id: 'w11-l04',
      weekId: 'w11',
      order: 4,
      kind: 'herhaling',
      title: 'Terugblik op je week',
      minutes: 4,
      tags: ['Terugblik'],
      intro: [
        'Dit was een belangrijke week. Je verkende je signalen, je begon aan je signaleringsplan en je keek naar steun. Dat is serieus werk.',
        'Misschien voelde deze week zwaar. Dat is logisch. Je keek naar moeilijke dingen. Wees vandaag extra zacht voor jezelf.'
      ],
      exercise: {
        title: 'Zachte weekblik',
        steps: [
          { n: 1, title: 'Check je pan', text: 'In welke pan zit je nu? Gewoon benoemen is genoeg.', seconds: 30 },
          { n: 2, title: 'Kijk naar je plan', text: 'Je hebt een eerste versie van je EHP. Welk onderdeel vond je het lastigst? Dat mag er zijn.', seconds: 60 },
          { n: 3, title: 'Wat deed je goed?', text: 'Noem één ding dat je deze week voor jezelf deed. Hoe klein ook. Het telt.', seconds: 60 },
          { n: 4, title: 'Plan iets rustigs', text: 'Kies één rustig moment voor vandaag. Een wandeling, thee, je adem. Plan het nu.', seconds: 30 }
        ]
      },
      reflection: 'Je bent niet te veel en niet te gevoelig. Je leert gewoon een nieuwe taal: de taal van je eigen gevoelens.',
      assignment: 'Doe iets ontspannends dit weekend. En leg je EHP klaar voor volgende week. Dan maak je je plan af.',
      relatedSkillIds: [],
      flashcardIds: ['w11-l04-f1', 'w11-l04-f2']
    }
  ]
};

/** Flashcards bij week 11. */
export const week11Flashcards: Flashcard[] = [
  {
    id: 'w11-l01-f1',
    lessonId: 'w11-l01',
    front: 'Waarom is het handig om je signalen te kennen?',
    back: 'Emoties gaan bijna nooit in één keer van pan 1 naar pan 5. Zie je de opbouw op tijd, dan kun je eerder iets doen dat helpt.'
  },
  {
    id: 'w11-l01-f2',
    lessonId: 'w11-l01',
    front: 'Op welke drie plekken kun je signalen opmerken?',
    back: 'In je lichaam (slapen, spanning), in je gedachten (piekeren, somber zijn) en in je gedrag (je terugtrekken, kortaf zijn).'
  },
  {
    id: 'w11-l01-f3',
    lessonId: 'w11-l01',
    front: 'Wat als je een signaal pas achteraf opmerkt?',
    back: 'Ook dat is oefenen. Merk het vriendelijk op en schrijf het erbij. De volgende keer herken je het eerder.'
  },
  {
    id: 'w11-l02-f1',
    lessonId: 'w11-l02',
    front: 'Wat is een Emotiehanteringsplan (EHP)?',
    back: 'Je eigen gebruiksaanwijzing voor moeilijke momenten. Per pan staat er: hoe herken ik dit, wat helpt mij, en wat kunnen anderen doen.'
  },
  {
    id: 'w11-l02-f2',
    lessonId: 'w11-l02',
    front: 'Wanneer maak je een EHP?',
    back: 'Op een rustige dag. Op een hevig moment denk je niet helder. Dan pak je gewoon het plan erbij dat je eerder maakte.'
  },
  {
    id: 'w11-l02-f3',
    lessonId: 'w11-l02',
    skillId: 'gronden-54321',
    front: 'Wat hoort er bij pan 5 in je plan?',
    back: 'Stop alles en grond je, bijvoorbeeld met 5-4-3-2-1. Bereik iemand. En weet waar je professionele hulp vindt, zoals onder Steun in de app.'
  },
  {
    id: 'w11-l03-f1',
    lessonId: 'w11-l03',
    front: 'Waarom is steun vragen een vaardigheid?',
    back: 'Omdat je het kunt leren en oefenen, net als ademen met aandacht. De meeste mensen vinden het fijn als je ze vertrouwt.'
  },
  {
    id: 'w11-l03-f2',
    lessonId: 'w11-l03',
    front: 'Welke hulp is er bij gedachten aan zelfdoding?',
    back: '113 Zelfmoordpreventie: dag en nacht bereikbaar, gratis en anoniem. Bel 113 of 0800-0113, of chat op 113.nl. Bij direct gevaar bel je 112.'
  },
  {
    id: 'w11-l03-f3',
    lessonId: 'w11-l03',
    front: 'Wat is een goede eerste zin om hulp te vragen?',
    back: 'Iets kleins en eerlijks. Bijvoorbeeld: "Het gaat niet zo goed. Mag ik even met je praten?" Meer hoeft de eerste stap niet te zijn.'
  },
  {
    id: 'w11-l04-f1',
    lessonId: 'w11-l04',
    front: 'Wat doe je na een zware cursusweek?',
    back: 'Wees extra zacht voor jezelf. Kies iets ontspannends en kijk vriendelijk terug: wat deed je goed, hoe klein ook.'
  },
  {
    id: 'w11-l04-f2',
    lessonId: 'w11-l04',
    front: 'Hoe ziet een zachte weekblik eruit?',
    back: 'Check in welke pan je zit. Benoem wat je deed en wat je leerde. En plan iets rustigs. Vijf minuten is genoeg.'
  }
];
