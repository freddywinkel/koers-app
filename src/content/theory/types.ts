/** Handmatig geschreven tekst in beide talen; psychologische termen worden niet automatisch vertaald. */
export interface LocalizedText {
  nl: string;
  en: string;
}

export type TheoryFramework = 'ACT' | 'VERS' | 'gedeeld' | 'algemeen';
export type TheoryTier = 'kern' | 'ondersteunend' | 'verdieping';

export interface TheorySource {
  id: string;
  title: LocalizedText;
  organization: string;
  url: string;
  accessedAt: string;
  note: LocalizedText;
}

/** Eén canoniek begrip dat lessen, voorbeelden en de begrippenbibliotheek delen. */
export interface PsychologyConcept {
  id: string;
  frameworks: TheoryFramework[];
  tier: TheoryTier;
  formalName: LocalizedText;
  aliases: LocalizedText[];
  plainExplanation: LocalizedText;
  deeperExplanation: LocalizedText;
  example: LocalizedText;
  misconception: LocalizedText;
  safetyNote?: LocalizedText;
  sourceIds: string[];
  relatedConceptIds: string[];
  relatedSkillIds: string[];
  primaryTheoryLessonId: string;
  /** Broncontrole is geen klinische of professionele beoordeling. */
  reviewStatus: 'source-checked' | 'needs-source-check';
}

export interface TheoryBlock {
  id: string;
  heading: LocalizedText;
  paragraphs: LocalizedText[];
  bullets?: LocalizedText[];
}

/** Losse, niet-blokkerende theorieles naast de bestaande 51 oefenlessen. */
export interface TheoryLesson {
  id: string;
  weekId: string;
  order: number;
  /** Na welk bestaand lesnummer deze theorie in de weekroute verschijnt. */
  afterLessonOrder: number;
  title: LocalizedText;
  minutes: number;
  summary: LocalizedText;
  intro: LocalizedText[];
  blocks: TheoryBlock[];
  conceptIds: string[];
  takeaway: LocalizedText;
  reflectionPrompt: LocalizedText;
  relatedLessonIds: string[];
  relatedSkillIds: string[];
  sourceIds: string[];
}

export type CoursePathItem =
  | { kind: 'core'; id: string; order: number }
  | { kind: 'theory'; id: string; order: number };
