import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  englishHumanVoiceSessions,
  humanVoiceSessions,
  meditationsForMentalHealthSpotifyUrl,
  mindfulMinuutSpotifyUrl,
  spotifyEmbedUrl,
  spotifyEpisodeUrl
} from '../content/humanVoices';
import { getLanguage } from '../i18n';
import { navigateBackOr } from '../lib/navigation';

/** Menselijk ingesproken mindfulnesssessies die via de officiële Spotify-player afspelen. */
export default function HumanVoices() {
  const navigate = useNavigate();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const isEnglish = getLanguage() === 'en';
  const sessions = isEnglish ? englishHumanVoiceSessions : humanVoiceSessions;
  const creator = isEnglish ? 'Victoria Mlynko' : 'Marjolein van der Aar';
  const show = isEnglish ? 'Meditations for Mental Health' : 'Mindful Minuut';
  const showUrl = isEnglish ? meditationsForMentalHealthSpotifyUrl : mindfulMinuutSpotifyUrl;

  return (
    <div className="screen-stack">
      <div className="flex items-center gap-3 px-0.5 pt-1">
        <button
          type="button"
          onClick={() => navigateBackOr(navigate, '/oefenen')}
          aria-label={isEnglish ? 'Back to exercises' : 'Terug naar oefenen'}
          className="grid h-10 w-10 flex-none place-items-center rounded-[14px] border border-line bg-sand text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 3.5 5.5 9 11 14.5" />
          </svg>
        </button>
        <span className="eyebrow !text-ink-soft">{isEnglish ? 'Exercises · Human voices' : 'Oefenen · Echte stemmen'}</span>
      </div>

      <header className="px-1 pt-2">
        <p className="eyebrow">{isEnglish ? 'Mindfulness from real people' : 'Mindfulness van echte mensen'}</p>
        <h1 className="mt-1.5 font-display text-[29px] font-semibold leading-[1.16] tracking-[-0.01em]">
          {isEnglish ? 'Human voices' : 'Echte stemmen'}
        </h1>
        <p className="sub mt-1.5">
          {isEnglish
            ? 'Meditations by Victoria Mlynko, Registered Psychotherapist and host of Meditations for Mental Health — spoken by a person, not AI.'
            : 'Meditaties van Marjolein van der Aar, mindfulnesstrainer en maker van Mindful Minuut — ingesproken door een mens, niet door AI.'}
        </p>
      </header>

      <section className="card !p-4" aria-label={isEnglish ? 'About Meditations for Mental Health' : 'Over Mindful Minuut'}>
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 flex-none place-items-center rounded-[14px] bg-[#1ed760]/15 text-[#16883c] dark:text-[#55df80]" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M5 9.2c4.8-1.4 9.9-.9 14 1.1" />
              <path d="M6 13c4-1 8.2-.6 11.7 1" />
              <path d="M7 16.5c3.1-.7 6.3-.4 9 .8" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-extrabold text-ink">{creator}</span>
            <span className="sub mt-0.5 block">{show} · {isEnglish ? 'English' : 'Nederlandstalig'}</span>
          </span>
        </div>
        <a
          href={showUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={isEnglish
            ? 'View Meditations for Mental Health on Spotify (opens in a new window)'
            : 'Bekijk Mindful Minuut op Spotify (opent in een nieuw venster)'}
          className="btn-secondary mt-3 w-full"
        >
          {isEnglish ? 'View Meditations for Mental Health on Spotify' : 'Bekijk Mindful Minuut op Spotify'}
          <span aria-hidden="true">↗</span>
        </a>
      </section>

      <section className="flex flex-col gap-3" aria-label={isEnglish ? 'Meditations by Victoria Mlynko' : 'Meditaties van Marjolein van der Aar'}>
        {sessions.map((session) => {
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
                    title={isEnglish
                      ? `${session.title} by ${session.creator} on Spotify`
                      : `${session.title} van ${session.creator} op Spotify`}
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
                  aria-label={isEnglish
                    ? (isActive ? `Close the player for ${session.title}` : `Listen to ${session.title} here`)
                    : (isActive ? `Sluit de speler voor ${session.title}` : `Luister hier naar ${session.title}`)}
                  onClick={() => setActiveSessionId(isActive ? null : session.id)}
                  className="btn-primary !min-h-[44px] !py-2.5"
                >
                  {isEnglish ? (isActive ? 'Close player' : 'Listen here') : (isActive ? 'Sluit speler' : 'Luister hier')}
                </button>
                <a
                  href={spotifyEpisodeUrl(session.spotifyEpisodeId)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={isEnglish
                    ? `Listen to ${session.title} on Spotify (opens in a new window)`
                    : `Beluister ${session.title} in Spotify (opent in een nieuw venster)`}
                  className="btn-secondary w-full"
                >
                  {isEnglish ? 'Listen on Spotify' : 'Beluister in Spotify'} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          );
        })}
      </section>

      <p className="sub px-1 text-[12.5px]">
        {isEnglish
          ? 'These external sessions are provided and played by Spotify. They require an internet connection and cannot be saved offline in Koers. Koers is not affiliated with Spotify or Meditations for Mental Health.'
          : 'Deze externe sessies worden aangeboden en afgespeeld door Spotify. Ze hebben internet nodig en kunnen niet via Koers offline worden bewaard. Koers hoort niet bij Spotify of Mindful Minuut.'}
      </p>
    </div>
  );
}
