/**
 * Content voor het crisisscherm (/crisis).
 * Kalm en concreet; nooit alarmistisch, geen rode accenten.
 * De hulplijnen zijn feitelijk; de rest is B1 en bemoedigend.
 */

/** Korte, kalme inleiding bovenaan het scherm. */
export const crisisIntro: string =
  'Je bent hier omdat het nu te veel is. Dat is oké. Dit scherm helpt je stap voor stap. Ga rustig, in je eigen tempo.';

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
    id: '112',
    title: 'Direct gevaar: bel 112',
    text: 'Ben jij of is iemand anders nu in direct gevaar, of denk je dat er levensgevaar is? Bel meteen 112.',
    actions: [{ label: 'Bel nu 112', href: 'tel:112', kind: 'tel' }]
  },
  {
    id: '113',
    title: '113 Zelfmoordpreventie',
    text: 'Denk je aan zelfdoding, of maak je je zorgen om iemand? Bel of chat dag en nacht gratis en anoniem met 113. Bij direct gevaar bel je 112.',
    actions: [
      { label: 'Bel 113', href: 'tel:113', kind: 'tel' },
      { label: 'Bel 0800-0113', href: 'tel:08000113', kind: 'tel' },
      { label: 'Chat op 113.nl', href: 'https://www.113.nl/chat', kind: 'link' }
    ]
  },
  {
    id: 'huisarts',
    title: 'Huisarts of huisartsenpost',
    text: 'Heb je een psychische crisis of snel een arts nodig, maar is er geen direct levensgevaar? Bel op werkdagen overdag je eigen huisarts. Bel ’s avonds, ’s nachts, in het weekend of op een feestdag de huisartsen-spoedpost.',
    actions: [
      {
        label: 'Bekijk wie je moet bellen',
        href: 'https://www.thuisarts.nl/spoed-wie-bel-je',
        kind: 'link'
      }
    ]
  }
];

/** Steunende afsluiting onderaan het scherm. */
export const steunendeAfsluiting: string =
  'Wat je ook voelt: je bent niet alleen en je hoeft dit niet alleen te doen. Hevige golven kunnen weer zakken, ook als dat nu nog niet zo voelt. Wees zacht voor jezelf. Jij doet al genoeg.';
