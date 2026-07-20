import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { skills } from '../content/skills';
import { audioSessions } from '../content/audio';
import { flashcards } from '../content/flashcards';

/** Klein icoon-tje voor de link-kaarten (eucatint tegel, stroke currentColor). */
function CardIcon({ children }: { children: ReactNode }) {
  return (
    <span className="grid h-11 w-11 flex-none place-items-center rounded-[14px] bg-eucatint text-euca-deep" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </span>
  );
}

/** Chevron rechts op een link-kaart. */
function Chevron() {
  return (
    <svg className="flex-none text-ink-soft" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.5 3.5 11 9l-4.5 5.5" />
    </svg>
  );
}

/** Oefenen-menu: compacte ingangen naar audio, echte stemmen, vaardigheden, oefeningen en flashcards. */
export default function Oefenen() {
  return (
    <div className="screen-stack">
      <header className="px-1 pt-2">
        <p className="eyebrow">Oefenen</p>
        <h1 className="mt-1.5 font-display text-[29px] font-semibold leading-[1.16] tracking-[-0.01em]">Je gereedschapskist</h1>
        <p className="sub mt-1.5">Alles om te oefenen, wanneer je maar wilt. Ook los van de cursus.</p>
      </header>

      {/* Mindfulness - Geleide oefeningen */}
      <section className="flex flex-col gap-3">
        <p className="eyebrow px-0.5">Mindfulness - Geleide oefeningen</p>

        <Link to="/oefenen/audio" className="card flex items-center gap-3.5">
          <span className="grid h-11 w-11 flex-none place-items-center rounded-[14px] bg-eucatint text-euca-deep" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6.5 8.5H3.5v7h3L11 19V5Z" />
              <path d="M15 9.5a4 4 0 0 1 0 5" />
              <path d="M17.5 7a7.5 7.5 0 0 1 0 10" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold text-ink">Offline audio-oefeningen</span>
            <span className="sub mt-0.5 block">
              {audioSessions.length} sessies om te beluisteren — gedownload, dus ook zonder internet.
            </span>
          </span>
          <Chevron />
        </Link>

        <Link to="/oefenen/echte-stemmen" className="card flex items-center gap-3.5">
          <span className="grid h-11 w-11 flex-none place-items-center rounded-[14px] bg-[#1ed760]/15 text-[#16883c] dark:text-[#55df80]" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M5 9.2c4.8-1.4 9.9-.9 14 1.1" />
              <path d="M6 13c4-1 8.2-.6 11.7 1" />
              <path d="M7 16.5c3.1-.7 6.3-.4 9 .8" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold text-ink">Mindfulness door mensen</span>
            <span className="sub mt-0.5 block">
              Luister via Spotify naar Marjolein van der Aar van Mindful Minuut.
            </span>
          </span>
          <Chevron />
        </Link>
      </section>

      {/* Overzichten: vaardigheden, oefeningen en flashcards */}
      <section className="flex flex-col gap-3">
        <Link to="/oefenen/vaardigheden" className="card flex items-center gap-3.5">
          <CardIcon>
            <path d="M12 3.5l2.1 5.4 5.4 2.1-5.4 2.1L12 18.5l-2.1-5.4-5.4-2.1 5.4-2.1L12 3.5Z" />
          </CardIcon>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold text-ink">Vaardigheden</span>
            <span className="sub mt-0.5 block">
              {skills.length} vaardigheden — filter op je pan en oefen wat nu past.
            </span>
          </span>
          <Chevron />
        </Link>

        <Link to="/oefenen/oefeningen" className="card flex items-center gap-3.5">
          <CardIcon>
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h10" />
          </CardIcon>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold text-ink">Oefeningen</span>
            <span className="sub mt-0.5 block">
              Alle oefeningen uit de cursuslessen op een rij.
            </span>
          </span>
          <Chevron />
        </Link>

        <Link to="/oefenen/flashcards-overzicht" className="card flex items-center gap-3.5">
          <CardIcon>
            <rect x="8" y="3.5" width="11" height="14" rx="2.5" />
            <path d="M5 6.5v11A2.5 2.5 0 0 0 7.5 20H16" />
          </CardIcon>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold text-ink">Flashcards</span>
            <span className="sub mt-0.5 block">
              {flashcards.length} kaarten — herhaal kort en houd het vers, gegroepeerd per week.
            </span>
          </span>
          <Chevron />
        </Link>
      </section>
    </div>
  );
}
