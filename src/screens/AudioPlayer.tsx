import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { audioSessions } from '../content/audio';
import { GuidedAudioPlayer, speechSupported, type PlayerState } from '../lib/audioPlayer';
import NotFound from './NotFound';

/**
 * Speler voor één geleide audiosessie (device SpeechSynthesis).
 * Logica zit in lib/audioPlayer.ts (GuidedAudioPlayer); dit scherm is alleen UI.
 * Start/hervat gaat altijd via een knop (user gesture — vereiste van iOS).
 * Bij unmount destroy()'t de speler en wordt spraak geannuleerd.
 */
export default function AudioPlayer() {
  const { id } = useParams<{ id: string }>();
  const session = audioSessions.find((s) => s.id === id);
  const navigate = useNavigate();

  const [state, setState] = useState<PlayerState>({
    status: 'idle',
    segmentIndex: 0,
    totalSegments: session?.segments.length ?? 0,
    supported: speechSupported()
  });

  // Eén speler per sessie; setState is stabiel dus veilig als callback.
  const player = useMemo(() => (session ? new GuidedAudioPlayer(session, setState) : null), [session]);

  useEffect(() => {
    if (!player) return;
    setState(player.snapshot());
    return () => player.destroy(); // annuleert spraak + timers bij unmount
  }, [player]);

  if (!session || !player) return <NotFound />;

  const total = state.totalSegments;
  const active = state.status === 'speaking' || state.status === 'pauze';
  const currentSegment = session.segments[Math.min(state.segmentIndex, total - 1)];
  const progressNow = state.status === 'done' ? total : state.segmentIndex + 1;
  const progressPct = Math.round((progressNow / total) * 100);

  const statusLine =
    state.status === 'idle'
      ? 'Klaar om te starten'
      : state.status === 'done'
        ? 'Oefening afgerond'
        : state.status === 'pauze'
          ? `Even stilte … (stap ${state.segmentIndex + 1} van ${total})`
          : state.status === 'paused'
            ? `Gepauzeerd bij stap ${state.segmentIndex + 1} van ${total}`
            : `Stap ${state.segmentIndex + 1} van ${total}`;

  return (
    <div className="screen-stack">
      {/* Kruimel + terug */}
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
          <span className="chip">{total} stappen</span>
        </div>
      </header>

      {/* Voortgang + huidige stap */}
      <section className="card" aria-label="Voortgang">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-extrabold text-ink">{statusLine}</p>
          <p className="sub flex-none">± {session.minutes} min</p>
        </div>
        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-dune"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={progressNow}
          aria-label="Voortgang van de oefening"
        >
          <div className="h-full rounded-full bg-euca-deep transition-[width] duration-500" style={{ width: `${progressPct}%` }} />
        </div>
        {(active || state.status === 'paused') && currentSegment && (
          <p className="mt-3 border-t border-line pt-3 text-[14.5px] leading-[1.6] text-ink" aria-live="polite">
            {currentSegment.text}
          </p>
        )}
      </section>

      {/* Knoppen */}
      {state.status === 'idle' && (
        <button type="button" className="btn-primary" disabled={!state.supported} onClick={() => player.start()}>
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
          <button type="button" className="btn-primary flex-1 !w-auto" onClick={() => player.resume()}>
            Ga verder
          </button>
          <button type="button" className="btn-secondary flex-1" onClick={() => player.stop()}>
            Stop
          </button>
        </div>
      )}
      {state.status === 'done' && (
        <section className="card border-euca-deep/25 bg-eucatint">
          <h2 className="card-title">Mooi gedaan</h2>
          <p className="sub mt-1.5">
            Je hebt de oefening helemaal afgerond. Neem even een rustige ademhaling voordat je verder gaat.
          </p>
          <button type="button" className="btn-secondary mt-3.5 w-full" onClick={() => player.start()}>
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

      {!state.supported && (
        <p className="rounded-2xl bg-apricot-soft px-4 py-3 text-[13.5px] font-bold leading-body text-ap-deep">
          Je browser kan niet voorlezen. Hieronder vind je de volledige tekst — lees hem rustig in je eigen tempo.
        </p>
      )}

      <p className="sub px-1 text-[12.5px]">
        Ingeluisterd door de stem van je telefoon — later vervangen door echte opnames.
      </p>

      {/* Volledige tekst (ook fijn zonder geluid) */}
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
          {session.segments.map((segment, i) => (
            <li key={i} className="flex gap-2.5 text-[14.5px] leading-[1.6] text-ink">
              <span className="grid h-6 w-6 flex-none place-items-center rounded-lg bg-eucatint text-xs font-extrabold text-euca-deep">
                {i + 1}
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
