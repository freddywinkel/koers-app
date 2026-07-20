/** Koers — speler voor vooraf gegenereerde geleide oefeningen. */

import type { AudioSession } from '../content/audio';

export type PlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'done' | 'error';

export interface PlayerState {
  status: PlayerStatus;
  currentTime: number;
  duration: number;
  supported: boolean;
  error?: string;
}

const AUDIO_CACHE = 'koers-audio';

export function audioSupported(): boolean {
  return typeof window !== 'undefined' && typeof window.Audio !== 'undefined';
}

export function audioUrl(session: AudioSession): string {
  return `${import.meta.env.BASE_URL}${session.audioSrc}`;
}

export async function isAudioCached(session: AudioSession): Promise<boolean> {
  if (typeof window === 'undefined' || !('caches' in window)) return false;
  const cache = await window.caches.open(AUDIO_CACHE);
  return Boolean(await cache.match(audioUrl(session)));
}

/** Download de volledige oefening naar dezelfde cache die de service worker gebruikt. */
export async function cacheAudio(session: AudioSession, onProgress?: (progress: number) => void): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    throw new Error('Deze browser kan de oefening niet offline bewaren.');
  }

  onProgress?.(10);
  const url = audioUrl(session);
  const response = await fetch(url, { cache: 'reload' });
  if (!response.ok) throw new Error('Het downloaden van de opname is mislukt. Probeer het later opnieuw.');
  onProgress?.(80);
  const cache = await window.caches.open(AUDIO_CACHE);
  await cache.put(url, response);
  onProgress?.(100);
}

export class GuidedAudioPlayer {
  private readonly audio: HTMLAudioElement | null;
  private onChange: (state: PlayerState) => void;
  private state: PlayerState;
  private destroyed = false;

  private readonly onLoadedMetadata = (): void => {
    if (!this.audio) return;
    this.emit({ duration: Number.isFinite(this.audio.duration) ? this.audio.duration : 0 });
  };

  private readonly onTimeUpdate = (): void => {
    if (!this.audio) return;
    this.emit({
      currentTime: this.audio.currentTime,
      duration: Number.isFinite(this.audio.duration) ? this.audio.duration : this.state.duration
    });
  };

  private readonly onPlaying = (): void => this.emit({ status: 'playing', error: undefined });
  private readonly onPause = (): void => {
    if (this.state.status === 'playing' || this.state.status === 'loading') this.emit({ status: 'paused' });
  };
  private readonly onEnded = (): void => {
    if (!this.audio) return;
    this.emit({ status: 'done', currentTime: this.audio.duration, duration: this.audio.duration });
  };
  private readonly onError = (): void => this.emit({
    status: 'error',
    error: 'De opname kon niet worden geladen. Controleer je verbinding of probeer de oefening opnieuw te downloaden.'
  });

  constructor(session: AudioSession, onChange: (state: PlayerState) => void) {
    const supported = audioSupported();
    this.onChange = onChange;
    this.state = { status: 'idle', currentTime: 0, duration: 0, supported };
    this.audio = supported ? new Audio(audioUrl(session)) : null;

    if (this.audio) {
      this.audio.preload = 'metadata';
      this.audio.addEventListener('loadedmetadata', this.onLoadedMetadata);
      this.audio.addEventListener('durationchange', this.onLoadedMetadata);
      this.audio.addEventListener('timeupdate', this.onTimeUpdate);
      this.audio.addEventListener('playing', this.onPlaying);
      this.audio.addEventListener('pause', this.onPause);
      this.audio.addEventListener('ended', this.onEnded);
      this.audio.addEventListener('error', this.onError);
    }
  }

  snapshot(): PlayerState {
    return { ...this.state };
  }

  async start(): Promise<void> {
    if (!this.audio || this.destroyed) return;
    this.audio.currentTime = 0;
    await this.play();
  }

  pause(): void {
    if (!this.audio || this.destroyed) return;
    this.audio.pause();
  }

  async resume(): Promise<void> {
    if (!this.audio || this.destroyed) return;
    await this.play();
  }

  stop(): void {
    if (!this.audio || this.destroyed) return;
    this.audio.pause();
    this.audio.currentTime = 0;
    this.emit({ status: 'idle', currentTime: 0, error: undefined });
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    if (this.audio) {
      this.audio.pause();
      this.audio.removeEventListener('loadedmetadata', this.onLoadedMetadata);
      this.audio.removeEventListener('durationchange', this.onLoadedMetadata);
      this.audio.removeEventListener('timeupdate', this.onTimeUpdate);
      this.audio.removeEventListener('playing', this.onPlaying);
      this.audio.removeEventListener('pause', this.onPause);
      this.audio.removeEventListener('ended', this.onEnded);
      this.audio.removeEventListener('error', this.onError);
      this.audio.removeAttribute('src');
      this.audio.load();
    }
    this.onChange = () => undefined;
  }

  private async play(): Promise<void> {
    if (!this.audio) return;
    this.emit({ status: 'loading', error: undefined });
    try {
      await this.audio.play();
    } catch {
      this.emit({ status: 'error', error: 'Afspelen lukte niet. Tik nogmaals op de afspeelknop.' });
    }
  }

  private emit(patch: Partial<PlayerState>): void {
    if (this.destroyed) return;
    this.state = { ...this.state, ...patch };
    this.onChange({ ...this.state });
  }
}
