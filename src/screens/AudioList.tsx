import { Link, useNavigate } from 'react-router-dom';
import { audioSessions } from '../content/audio';
import { navigateBackOr } from '../lib/navigation';

/** Overzicht van alle geleide audio-oefeningen. */
export default function AudioList() {
  const navigate = useNavigate();

  return (
    <div className="screen-stack">
      <div className="flex items-center gap-3 px-0.5 pt-1">
        <button
          type="button"
          onClick={() => navigateBackOr(navigate, '/oefenen')}
          aria-label="Terug"
          className="grid h-10 w-10 flex-none place-items-center rounded-[14px] border border-line bg-sand text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 3.5 5.5 9 11 14.5" />
          </svg>
        </button>
        <span className="eyebrow !text-ink-soft">Oefenen · Geleide oefeningen</span>
      </div>

      <header className="px-1 pt-2">
        <h1 className="mt-1.5 font-display text-[29px] font-semibold leading-[1.16] tracking-[-0.01em]">Geleide oefeningen</h1>
        <p className="sub mt-1.5">
          Rustige oefeningen om te beluisteren, stap voor stap. Ze werken ook los van de cursus — kies wat nu past.
        </p>
      </header>

      <section className="flex flex-col gap-3" aria-label="Audiosessies">
        {audioSessions.map((session) => (
          <Link key={session.id} to={`/oefenen/audio/${session.id}`} className="card flex items-start gap-3.5">
            <span className="grid h-11 w-11 flex-none place-items-center rounded-[14px] bg-eucatint text-euca-deep" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5 6.5 8.5H3.5v7h3L11 19V5Z" />
                <path d="M15 9.5a4 4 0 0 1 0 5" />
                <path d="M17.5 7a7.5 7.5 0 0 1 0 10" />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold text-ink">{session.title}</span>
              <span className="sub mt-1 block">{session.doel}</span>
              <span className="chip chip-warm mt-2.5">± {session.minutes} min</span>
            </span>
            <svg className="mt-1 flex-none text-ink-soft" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6.5 3.5 11 9l-4.5 5.5" />
            </svg>
          </Link>
        ))}
      </section>

      <p className="sub px-1 text-[12.5px]">
        De oefeningen worden voorgelezen door een rustige, met AI gegenereerde stem.
      </p>
    </div>
  );
}
