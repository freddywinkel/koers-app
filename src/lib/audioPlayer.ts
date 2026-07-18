/**
 * Koers — geleide audio via de device-stem (SpeechSynthesis)
 * -------------------------------------------------------------------
 * Speelt een AudioSession af: elk segment wordt als aparte utterance
 * gesproken (lang 'nl-NL', rate 0.9) en de `pauze` van een segment is
 * stilte NA dat segment. Eén utterance per segment is bewust gekozen:
 * zo ontloopt de speler de bekende Chrome-bug waarbij hele lange
 * utterances na ±15 seconden afbreken.
 *
 * Eerlijke beperkingen (platform, geen bug in deze code):
 *  - iOS/Safari eist dat de eerste speak() binnen een user gesture valt —
 *    daarom start/hervat de UI alleen vanuit een knop.
 *  - pause()/resume() van speechSynthesis is op iOS onbetrouwbaar;
 *    pauzeren tijdens een stilte (pauze-timer) werkt overal wel.
 *  - Stemmen laden asynchroon (Chrome): we luisteren naar 'voiceschanged'
 *    en kiezen dan alsnog een Nederlandse stem.
 *  - cancel() bij unmount (destroy) voorkomt doorspoken na navigatie.
 *  - Een `generation`-teller laat verlate onend/onerror-callbacks van
 *    geannuleerde utterances stilletjes verlopen.
 */

import type { AudioSession } from '../content/audio';

export type PlayerStatus = 'idle' | 'speaking' | 'pauze' | 'paused' | 'done';

export interface PlayerState {
  status: PlayerStatus;
  /** 0-based index van het huidige segment. */
  segmentIndex: number;
  totalSegments: number;
  supported: boolean;
}

const LANG = 'nl-NL';
const RATE = 0.9;

/** Ondersteunt deze browser/context speechSynthesis? */
export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

export class GuidedAudioPlayer {
  private readonly session: AudioSession;
  private onChange: (state: PlayerState) => void;
  private state: PlayerState;
  /** Verhoogd bij start/stop/destroy — verlate callbacks verlopen dan stilletjes. */
  private generation = 0;
  private pauseTimer: number | undefined;
  private pauseEndsAt = 0;
  private pauseRemaining = 0;
  private pausedFrom: 'speaking' | 'pauze' | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private destroyed = false;

  private readonly onVoicesChanged = (): void => this.pickVoice();

  constructor(session: AudioSession, onChange: (state: PlayerState) => void) {
    this.session = session;
    this.onChange = onChange;
    this.state = {
      status: 'idle',
      segmentIndex: 0,
      totalSegments: session.segments.length,
      supported: speechSupported()
    };
    if (this.state.supported) {
      this.pickVoice();
      // Chrome levert stemmen pas later; kies opnieuw zodra ze binnen zijn.
      window.speechSynthesis.addEventListener('voiceschanged', this.onVoicesChanged);
    }
  }

  /** Momentopname van de staat (voor de eerste render). */
  snapshot(): PlayerState {
    return { ...this.state };
  }

  /**
   * Start (of herstart) de sessie vanaf segment 1.
   * Alleen aanroepen vanuit een user gesture (iOS eist dat voor spraak).
   */
  start(): void {
    if (!this.state.supported || this.destroyed) return;
    window.speechSynthesis.cancel(); // ruim hangende utterances op (iOS-quirk)
    this.generation += 1;
    this.clearPauseTimer();
    this.pausedFrom = null;
    this.pickVoice();
    this.speakSegment(0, this.generation);
  }

  /** Pauzeer het gesproken segment óf de lopende stilte. */
  pause(): void {
    if (this.destroyed) return;
    if (this.state.status === 'speaking') {
      window.speechSynthesis.pause();
      this.pausedFrom = 'speaking';
      this.emit({ status: 'paused' });
    } else if (this.state.status === 'pauze') {
      this.pauseRemaining = Math.max(0, this.pauseEndsAt - Date.now());
      this.clearPauseTimer();
      this.pausedFrom = 'pauze';
      this.emit({ status: 'paused' });
    }
  }

  /** Hervat na pauze. Alleen aanroepen vanuit een user gesture (iOS). */
  resume(): void {
    if (this.destroyed || this.state.status !== 'paused') return;
    if (this.pausedFrom === 'speaking') {
      window.speechSynthesis.resume();
      this.emit({ status: 'speaking' });
    } else if (this.pausedFrom === 'pauze') {
      this.emit({ status: 'pauze' });
      this.armPauseTimer(this.pauseRemaining, this.state.segmentIndex, this.generation);
    }
    this.pausedFrom = null;
  }

  /** Stop en zet de speler terug naar het begin (blijft op het scherm). */
  stop(): void {
    if (this.destroyed) return;
    this.generation += 1;
    this.clearPauseTimer();
    this.pausedFrom = null;
    if (this.state.supported) window.speechSynthesis.cancel();
    this.emit({ status: 'idle', segmentIndex: 0 });
  }

  /** Ruim op bij unmount: annuleer spraak, timers en listeners. */
  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.generation += 1;
    this.clearPauseTimer();
    if (this.state.supported) {
      window.speechSynthesis.removeEventListener('voiceschanged', this.onVoicesChanged);
      window.speechSynthesis.cancel();
    }
    this.onChange = () => undefined; // geen setState meer na unmount
  }

  /* ------------------------------- intern ------------------------------ */

  private emit(patch: Partial<PlayerState>): void {
    this.state = { ...this.state, ...patch };
    this.onChange({ ...this.state });
  }

  /** Kies bij voorkeur een nl-NL stem, anders eender welke Nederlandse. */
  private pickVoice(): void {
    if (!this.state.supported) return;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return;
    this.voice =
      voices.find((v) => v.lang.toLowerCase() === LANG) ??
      voices.find((v) => v.lang.toLowerCase().startsWith('nl')) ??
      null;
  }

  private speakSegment(index: number, generation: number): void {
    if (generation !== this.generation || this.destroyed) return;
    const segment = this.session.segments[index];
    if (!segment) {
      this.finish(generation);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(segment.text);
    utterance.lang = LANG;
    utterance.rate = RATE;
    if (this.voice) utterance.voice = this.voice;
    utterance.onend = () => {
      if (generation === this.generation && !this.destroyed) this.afterSegment(index, generation);
    };
    utterance.onerror = (event) => {
      if (generation !== this.generation || this.destroyed) return;
      // 'canceled'/'interrupted' horen bij stop()/cancel() — geen echte fout.
      if (event.error === 'canceled' || event.error === 'interrupted') return;
      // Liever rustig doorschakelen dan stil blijven hangen.
      this.afterSegment(index, generation);
    };
    this.emit({ status: 'speaking', segmentIndex: index });
    window.speechSynthesis.speak(utterance);
  }

  private afterSegment(index: number, generation: number): void {
    if (generation !== this.generation || this.destroyed) return;
    if (index >= this.session.segments.length - 1) {
      this.finish(generation);
      return;
    }
    const pauzeSeconds = this.session.segments[index]?.pauze ?? 0;
    if (pauzeSeconds > 0) {
      this.emit({ status: 'pauze' });
      this.armPauseTimer(pauzeSeconds * 1000, index, generation);
    } else {
      this.speakSegment(index + 1, generation);
    }
  }

  /** Stilte van `ms` milliseconden na segment `index`; daarna het volgende segment. */
  private armPauseTimer(ms: number, index: number, generation: number): void {
    this.clearPauseTimer();
    this.pauseRemaining = ms;
    this.pauseEndsAt = Date.now() + ms;
    this.pauseTimer = window.setTimeout(() => {
      this.pauseTimer = undefined;
      this.speakSegment(index + 1, generation);
    }, ms);
  }

  private clearPauseTimer(): void {
    if (this.pauseTimer !== undefined) {
      window.clearTimeout(this.pauseTimer);
      this.pauseTimer = undefined;
    }
  }

  private finish(generation: number): void {
    if (generation !== this.generation || this.destroyed) return;
    this.emit({ status: 'done', segmentIndex: this.session.segments.length - 1 });
  }
}
