import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { audioSessions } from '../content/audio';
import {
  GuidedAudioPlayer,
  audioSupported,
  cacheAudio,
  isAudioCached,
  type PlayerState
} from '../lib/audioPlayer';
import NotFound from './NotFound';

type OfflineState = 'checking' | 'ready' | 'downloading' | 'saved' | 'error';

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const rounded = Math.floor(seconds);
  return `${Math.floor(rounded / 60)}:${String(rounded % 60).padStart(2, '0')}`;
}

/** Speler voor één vooraf gegenereerde mindfulness-opname. */
export default function AudioPlayer() {
  const { id } = useParams<{ id: string }>();
  const session = audioSessions.find((item) => item.id === id);
  const navigate = useNavigate();

  const [state, setState] = useState<PlayerState>({
    status: 'idle',
    currentTime: 0,
    duration: 0,
    supported: audioSupported()
  });
  const [offlineState, setOfflineState] = useState<OfflineState>('checking');
  const [downloadProgress, setDownloadProgress] = useState(0);

  const player = useMemo(() => (session ? new GuidedAudioPlayer(session, setState) : null), [session]);

  useEffect(() => {
    if (!player) return;
    setState(player.snapshot());
    return () => player.destroy();
  }, [player]);

  useEffect(() => {
    let active = true;
    if (!session) return;
    void isAudioCached(session)
      .then((cached) => {
        if (active) setOfflineState(cached ? 'saved' : 'ready');
      })
      .catch(() => {
        if (active) setOfflineState('ready');
      });
    return () => {
      active = false;
    };
  }, [session]);

  if (!session || !player) return <NotFound />;

  const active = state.status === 'playing' || state.status === 'loading';
  const displayDuration = state.duration || session.minutes * 60;
  const progressPct = state.status === 'done'
    ? 100
    : Math.min(100, Math.round((state.currentTime / displayDuration) * 100));

  const statusLine =
    state.status === 'idle'
      ? 'Klaar om te starten'
      : state.status === 'loading'
        ? 'Opname laden…'
        : state.status === 'done'
          ? 'Oefening afgerond'
          : state.status === 'paused'
            ? 'Gepauzeerd'
            : state.status === 'error'
              ? 'Afspelen niet gelukt'
              : 'De oefening wordt afgespeeld';

  const saveOffline = async (): Promise<void> => {
    setOfflineState('downloading');
    setDownloadProgress(0);
    try {
      await cacheAudio(session, setDownloadProgress);
      setOfflineState('saved');
    } catch {
      setOfflineState('error');
    }
  };

  const offlineLabel =
    offlineState === 'checking'
      ? 'Offline-status controleren…'
      : offlineState === 'downloading'
        ? `Bewaren… ${downloadProgress}%`
        : offlineState === 'saved'
          ? 'Offline beschikbaar'
          : offlineState === 'error'
            ? 'Bewaren opnieuw proberen'
            : 'Bewaar voor offline gebruik';

  return (
    <div className="screen-stack">
      <div className="flex items-center gap-3 px-0.5 pt-1">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Terug"
          className="grid h-10 w-10 flex-none place-items-center rounded-[14px] border border-line bg-sand text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 3.5 5.5 9 11 14.5" />
          </svg>
        </button>
        <span className="eyebrow !text-ink-soft">Geleide oefening</span>
      </div>

      <header className="px-1 pt-2">
        <h1 className="mt-1.5 font-display text-[29px] font-semibold leading-[1.16] tracking-[-0.01em]">{session.title}</h1>
        <p className="sub mt-1.5">{session.doel}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="chip chip-warm">± {session.minutes} min</span>
          <span className="chip">Rustige begeleiding</span>
        </div>
      </header>

      <section className="card" aria-label="Voortgang">
        <div className="flex items-baseline justify-between gap-3">
          <p className="min-w-0 text-sm font-extrabold text-ink">{statusLine}</p>
          <p className="sub flex-none">{formatTime(state.currentTime)} / {formatTime(displayDuration)}</p>
        </div>
        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-dune"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPct}
          aria-label="Voortgang van de oefening"
        >
          <div className="h-full rounded-full bg-euca-deep transition-[width] duration-500" style={{ width: `${progressPct}%` }} />
        </div>
        {state.error && (
          <p className="mt-3 border-t border-line pt-3 text-[13.5px] font-bold leading-body text-ap-deep" role="alert">
            {state.error}
          </p>
        )}
      </section>

      {state.status === 'idle' && (
        <button type="button" className="btn-primary" disabled={!state.supported} onClick={() => void player.start()}>
          Start de oefening
        </button>
      )}
      {active && (
        <div className="flex gap-2.5">
          <button type="button" className="btn-primary flex-1 !w-auto" onClick={() => player.pause()}>
            Pauzeer
          </button>
          <button type="button" className="btn-secondary flex-1" onClick={() => player.stop()}>
            Stop
          </button>
        </div>
      )}
      {state.status === 'paused' && (
        <div className="flex gap-2.5">
          <button type="button" className="btn-primary flex-1 !w-auto" onClick={() => void player.resume()}>
            Ga verder
          </button>
          <button type="button" className="btn-secondary flex-1" onClick={() => player.stop()}>
            Stop
          </button>
        </div>
      )}
      {state.status === 'error' && (
        <button type="button" className="btn-primary" onClick={() => void player.start()}>
          Probeer opnieuw
        </button>
      )}
      {state.status === 'done' && (
        <section className="card border-euca-deep/25 bg-eucatint">
          <h2 className="card-title">Mooi gedaan</h2>
          <p className="sub mt-1.5">
            Je hebt de oefening helemaal afgerond. Neem even een rustige ademhaling voordat je verder gaat.
          </p>
          <button type="button" className="btn-secondary mt-3.5 w-full" onClick={() => void player.start()}>
            Opnieuw beluisteren
          </button>
          <Link
            to="/oefenen/audio"
            className="sub mx-auto mt-3 block min-h-[44px] text-center font-bold leading-[44px] underline underline-offset-2"
          >
            Terug naar alle oefeningen
          </Link>
        </section>
      )}

      <button
        type="button"
        className="btn-secondary w-full"
        disabled={offlineState === 'checking' || offlineState === 'downloading' || offlineState === 'saved'}
        onClick={() => void saveOffline()}
      >
        {offlineLabel}
      </button>
      <p className="sub -mt-2 px-1 text-[12.5px]">
        De stem is met AI gegenereerd; het is geen opname van een echt mens. Bewaar de oefening vooraf als je zonder internet wilt luisteren.
      </p>

      {!state.supported && (
        <p className="rounded-2xl bg-apricot-soft px-4 py-3 text-[13.5px] font-bold leading-body text-ap-deep">
          Je browser kan de opname niet afspelen. Hieronder vind je de volledige tekst — lees hem rustig in je eigen tempo.
        </p>
      )}

      <details className="card group">
        <summary className="flex cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
          <span className="min-w-0 flex-1">
            <span className="card-title block">Lees de tekst</span>
            <span className="sub mt-1 block">De hele oefening, in je eigen tempo.</span>
          </span>
          <svg
            className="flex-none text-ink-soft transition-transform group-open:rotate-90"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6.5 3.5 11 9l-4.5 5.5" />
          </svg>
        </summary>
        <ol className="mt-3 flex flex-col gap-2.5 border-t border-line pt-3">
          {session.segments.map((segment, index) => (
            <li key={index} className="flex gap-2.5 text-[14.5px] leading-[1.6] text-ink">
              <span className="grid h-6 w-6 flex-none place-items-center rounded-lg bg-eucatint text-xs font-extrabold text-euca-deep">
                {index + 1}
              </span>
              <span>
                {segment.text}
                {segment.pauze ? <span className="sub"> · stilte {segment.pauze} sec</span> : null}
              </span>
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}
