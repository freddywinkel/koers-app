import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  humanVoiceSessions,
  mindfulMinuutSpotifyUrl,
  spotifyEmbedUrl,
  spotifyEpisodeUrl
} from '../content/humanVoices';

/** Menselijk ingesproken mindfulnesssessies die via de officiële Spotify-player afspelen. */
export default function HumanVoices() {
  const navigate = useNavigate();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

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
        <span className="eyebrow !text-ink-soft">Oefenen · Echte stemmen</span>
      </div>

      <header className="px-1 pt-2">
        <p className="eyebrow">Mindfulness door mensen</p>
        <h1 className="mt-1.5 font-display text-[29px] font-semibold leading-[1.16] tracking-[-0.01em]">Echte stemmen</h1>
        <p className="sub mt-1.5">
          Menselijk ingesproken meditaties van Marjolein van der Aar, mindfulnesstrainer en maker van Mindful Minuut.
        </p>
      </header>

      <section className="card !p-4" aria-label="Over Mindful Minuut">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 flex-none place-items-center rounded-[14px] bg-[#1ed760]/15 text-[#16883c] dark:text-[#55df80]" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M5 9.2c4.8-1.4 9.9-.9 14 1.1" />
              <path d="M6 13c4-1 8.2-.6 11.7 1" />
              <path d="M7 16.5c3.1-.7 6.3-.4 9 .8" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-extrabold text-ink">Marjolein van der Aar</span>
            <span className="sub mt-0.5 block">Mindful Minuut · Nederlandstalig</span>
          </span>
        </div>
        <a
          href={mindfulMinuutSpotifyUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-secondary mt-3 w-full"
        >
          Bekijk Mindful Minuut op Spotify
          <span aria-hidden="true">↗</span>
        </a>
      </section>

      <section className="flex flex-col gap-3" aria-label="Meditaties van Marjolein van der Aar">
        {humanVoiceSessions.map((session) => {
          const isActive = activeSessionId === session.id;

          return (
            <article key={session.id} className="card !p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-[15px] font-extrabold leading-snug text-ink">{session.title}</h2>
                  <p className="sub mt-1">{session.description}</p>
                </div>
                <span className="chip chip-warm flex-none">± {session.minutes} min</span>
              </div>

              {isActive ? (
                <div className="mt-3 overflow-hidden rounded-[12px] bg-dune">
                  <iframe
                    title={`${session.title} van ${session.creator} op Spotify`}
                    src={spotifyEmbedUrl(session.spotifyEpisodeId)}
                    width="100%"
                    height="152"
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    className="block border-0"
                  />
                </div>
              ) : null}

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  aria-expanded={isActive}
                  onClick={() => setActiveSessionId(isActive ? null : session.id)}
                  className="btn-primary !min-h-[44px] !py-2.5"
                >
                  {isActive ? 'Sluit speler' : 'Luister hier'}
                </button>
                <a
                  href={spotifyEpisodeUrl(session.spotifyEpisodeId)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary w-full"
                >
                  Open in Spotify <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          );
        })}
      </section>

      <p className="sub px-1 text-[12.5px]">
        Deze externe sessies worden aangeboden en afgespeeld door Spotify. Ze hebben internet nodig en kunnen niet via Koers offline worden bewaard. Koers is niet verbonden aan Spotify of Mindful Minuut.
      </p>
    </div>
  );
}
