import type { SkillCard } from './types';
import { skillLibrary } from './skillLibrary';

/**
 * Vaardigheden voor de Oefenen-toolbox.
 * -------------------------------------
 * Volledige bibliotheek (24 vaardigheden) uit ./skillLibrary.ts, aangevuld
 * met de stage-1-voorbeelden die niet in de bibliotheek staan
 * ('ademanker', 'bladeren-op-de-stroom') — lessen verwijzen ernaar.
 * Bij dubbele ids ('afstand-observeren', 'gronden-54321') wint de
 * skillLibrary-versie.
 * panMin/panMax: bij welke pan (1–5) de vaardigheid passend is.
 */

/** Stage-1-voorbeelden die niet in skillLibrary voorkomen. */
const extraSkills: SkillCard[] = [
  {
    id: 'bladeren-op-de-stroom',
    name: 'Bladeren op de stroom',
    panMin: 1,
    panMax: 3,
    summary: 'Stel je een rustig stroompje voor met bladeren op het water. Elke gedachte leg je op een blaadje — en je kijkt hoe hij wegdrijft.',
    steps: [
      'Doe je ogen dicht of kijk zacht voor je uit.',
      'Stel je voor: een stroompje met bladeren op het water.',
      'Elke gedachte die opkomt, leg je op een blaadje.',
      'Kijk hoe het blaadje langzaam wegdrijft. Nieuwe gedachte? Nieuw blaadje.'
    ]
  },
  {
    id: 'ademanker',
    name: 'Ademanker',
    panMin: 2,
    panMax: 5,
    summary: 'Je adem kan als anker dienen. Twee minuten volgen kan helpen om weer wat meer grond onder je voeten te voelen.',
    steps: [
      'Leg één hand op je buik.',
      'Adem in door je neus en voel je buik omhoog gaan.',
      'Adem langzaam uit, iets langer dan je inademing.',
      'Dwaal je af? Dat is normaal. Kom zachtjes terug.'
    ]
  }
];

const libraryIds = new Set(skillLibrary.map((s) => s.id));
export const skills: SkillCard[] = [
  ...skillLibrary,
  ...extraSkills.filter((s) => !libraryIds.has(s.id))
];

/** Zoek een vaardigheid op id. */
export function getSkill(id: string): SkillCard | undefined {
  return skills.find((s) => s.id === id);
}
