/**
 * Content voor het crisisscherm (/crisis).
 * Kalm en concreet; nooit alarmistisch, geen rode accenten.
 * De hulplijnen zijn feitelijk; de rest is B1 en bemoedigend.
 */

/** Korte, kalme inleiding bovenaan het scherm. */
export const crisisIntro: string =
  'Je bent hier omdat het nu te veel is. Dat is oké. Dit scherm helpt je stap voor stap. Ga rustig, in je eigen tempo.';

/** Zachte grondingsstappen voor bovenaan het scherm. */
export const groundingSteps: string[] = [
  'Zet je voeten plat op de grond. Duw zachtjes naar beneden en voel de vloer.',
  'Adem in door je neus … en adem langzaam weer uit, alsof je door een rietje blaast.',
  'Noem in je hoofd 5 dingen die je nu kunt zien.',
  'Leg één hand op je buik. Voel hoe je hand meebeweegt met je adem.',
  'Noem 3 geluiden die je nu kunt horen. Dichtbij of ver weg, alles telt.',
  'Zeg tegen jezelf: dit gevoel is hevig, en het gaat weer voorbij.'
];

/** Wat nu helpt, afgestemd op de pan-intensiteit (pannetjesmodel). */
export interface PanHulp {
  pan: 4 | 5;
  label: string;
  tips: string[];
}

export const watHelptNu: PanHulp[] = [
  {
    pan: 4,
    label: 'Pruttelt',
    tips: [
      'Maak je uitademing langer dan je inademing. Dat helpt je lijf rustiger te worden.',
      'Doe een korte oefening uit Oefenen, zoals het Ademanker.',
      'Zeg hardop of in je hoofd wat je voelt: ik voel boosheid, of ik voel angst.',
      'Beweeg drie minuten. Loop even naar buiten, of rek je uit. Je lijf mag de spanning loslaten.',
      'Bel of app iemand die je vertrouwt. Je hoeft het niet alleen te dragen.'
    ]
  },
  {
    pan: 5,
    label: 'Kookt over',
    tips: [
      'Doe eerst de grondingsstappen hierboven. Langzaam, stap voor stap.',
      'Maak je handen nat met koud water, of houd iets kouds vast. Dat helpt je om weer te landen.',
      'Zet je voeten stevig op de grond en duw zachtjes. Voel: de grond draagt je.',
      'Stuur niets weg. Zeg: dit is hevig, en het gaat weer voorbij.',
      'Voelt het onveilig of te groot? Bel 113. Zij zijn er dag en nacht.'
    ]
  }
];

export interface CrisisAction {
  label: string;
  href: string;
  kind: 'tel' | 'link';
}

export interface CrisisContact {
  id: string;
  title: string;
  text: string;
  actions: CrisisAction[];
}

export const crisisContacts: CrisisContact[] = [
  {
    id: '113',
    title: '113 Zelfmoordpreventie',
    text: 'Dag en nacht bereikbaar, gratis en anoniem. Ook als je je zorgen maakt om iemand anders. Chatten kan via 113.nl.',
    actions: [
      { label: 'Bel 113', href: 'tel:113', kind: 'tel' },
      { label: 'Bel 0800-0113', href: 'tel:08000113', kind: 'tel' },
      { label: 'Chat op 113.nl', href: 'https://www.113.nl', kind: 'link' }
    ]
  },
  {
    id: 'huisarts',
    title: 'Huisarts of huisartsenpost',
    text: 'Voor klachten die niet kunnen wachten. Bel overdag je eigen huisarts; ’s avonds en in het weekend de huisartsenpost in je regio.',
    actions: []
  },
  {
    id: '112',
    title: 'Bij direct gevaar',
    text: 'Ben jij of is iemand anders in direct levensgevaar? Bel dan 112.',
    actions: [{ label: 'Bel 112', href: 'tel:112', kind: 'tel' }]
  }
];

/** Steunende afsluiting onderaan het scherm. */
export const steunendeAfsluiting: string =
  'Wat je ook voelt: je bent niet alleen en je hoeft dit niet alleen te doen. Hevige golven zakken altijd weer, ook als dat nu niet zo voelt. Wees zacht voor jezelf. Jij doet al genoeg.';
