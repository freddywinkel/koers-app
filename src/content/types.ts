/**
 * Koers — contentmodel
 * -----------------------------
 * Dit bestand definieert het complete schema dat stage 2 (schrijvers) vult.
 * Lees ook src/content/README.md voor schrijfrichtlijnen (B1, toon, lengte).
 */

/** Soort les: uitlegles, actieve oefening, of terugblik/herhaling. */
export type LessonKind = 'lesson' | 'oefening' | 'herhaling';

/** Pannetjesmodel: intensiteit 1 (Rustig) t/m 5 (Kookt over). */
export type PanValue = 1 | 2 | 3 | 4 | 5;

/** Eén stap binnen een geleide oefening. */
export interface ExerciseStep {
  /** Volgnummer, beginnend bij 1. */
  n: number;
  /** Korte kop van 2–5 woorden. */
  title: string;
  /** Uitleg in 1–3 korte B1-zinnen. */
  text: string;
  /** Optioneel: indicatie in seconden (wordt getoond als chip). */
  seconds?: number;
}

/**
 * Beeldkaart ("beeld om te onthouden") — een metafoor die de kern van de les
 * samenvat. `art` verwijst naar een ingebouwde illustratie-variant.
 */
export interface MetaphorCard {
  title: string;
  /** 1–3 korte zinnen. */
  text: string;
  /** Illustratie-variant; standaard 'mist'. */
  art?: 'mist' | 'golf' | 'stroom';
}

/** Geleide oefening binnen een les. */
export interface Exercise {
  title: string;
  steps: ExerciseStep[];
}

/**
 * Eén les binnen een week.
 * Stub-lessen hebben alleen id/weekId/order/kind/title (+ eventueel minutes/tags);
 * de tekstvelden blijven dan leeg (intro = []) tot stage 2 ze vult.
 */
export interface Lesson {
  /** Uniek id, conventie: `w{week:00}-l{order:00}` — bijv. 'w02-l03'. */
  id: string;
  /** Verwijzing naar Week.id, conventie: `w{week:00}` — bijv. 'w02'. */
  weekId: string;
  /** Positie binnen de week (1-based). */
  order: number;
  kind: LessonKind;
  title: string;
  /** Indicatie in minuten (chip "± 7 min"). */
  minutes?: number;
  /** Korte labels voor warme chips, bijv. ['Adem & aandacht']. */
  tags?: string[];
  /** Inleiding: losse alinea's, elk 1–3 zinnen. Leeg bij stubs. */
  intro: string[];
  metaphorCard?: MetaphorCard;
  exercise?: Exercise;
  /** Nabespreking: normaliserend, zonder oordeel. 1–3 zinnen. */
  reflection?: string;
  /** Huiswerk/toepassing in het dagelijks leven. 1–2 zinnen. */
  assignment?: string;
  /** Verwijzingen naar SkillCard.id in skills.ts. */
  relatedSkillIds: string[];
  /** Verwijzingen naar Flashcard.id in flashcards.ts. */
  flashcardIds: string[];
}

/** Eén week van de cursus, met 4–6 lessen. */
export interface Week {
  /** Conventie: `w{number:00}` — bijv. 'w07'. */
  id: string;
  /** Weeknummer 1–12. */
  number: number;
  title: string;
  /** Één zin die de week samenvat (optioneel). */
  tagline?: string;
  lessons: Lesson[];
}

/**
 * Vaardigheid in de Oefenen-toolbox.
 * panMin/panMax geven aan bij welke pan-intensiteit de vaardigheid bruikbaar is.
 */
export interface SkillCard {
  id: string;
  name: string;
  panMin: PanValue;
  panMax: PanValue;
  /** 1–2 zinnen: wat het is en wanneer je het gebruikt. */
  summary: string;
  /** Korte stappen in gewone taal. */
  steps: string[];
}

/** Flashcard voor actieve recall (spaced repetition in stage 3). */
export interface Flashcard {
  id: string;
  /** Vraag of prompt (voorkant). */
  front: string;
  /** Antwoord in 1–3 zinnen (achterkant). */
  back: string;
  /** Optioneel: les waar de kaart bij hoort. */
  lessonId?: string;
  /** Optioneel: vaardigheid waar de kaart bij hoort. */
  skillId?: string;
}
