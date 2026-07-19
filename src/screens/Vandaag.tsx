import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PanSelector from '../components/PanSelector';
import SupportBar from '../components/SupportBar';
import { PAN_LABELS } from '../components/PanIcon';
import StreakRing from '../components/StreakRing';
import { useTodayCheckin, saveCheckin, useStreak, useSettings } from '../db/hooks';
import { lessonCrumb } from '../content/helpers';
import { useNextCourseLesson } from '../lib/courseHooks';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 6) return 'Goedenacht';
  if (h < 12) return 'Goedemorgen';
  if (h < 18) return 'Goedemiddag';
  return 'Goedenavond';
}

function dateLabel(): string {
  const s = new Intl.DateTimeFormat('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const FEEDBACK: Record<number, string> = {
  1: 'Mooi. Neem dit rustige gevoel even in je op.',
  2: 'Fijn dat je even voelt hoe het gaat.',
  3: 'Goed dat je het merkt. Je hoeft er nu niets mee.',
  4: 'Dat is veel. Wees extra lief voor jezelf vandaag.',
  5: 'Dat is echt veel. Kijk bij Steun nu als je direct iets nodig hebt — daar ben je nooit te veel.'
};

export default function Vandaag() {
  const checkin = useTodayCheckin();
  const streak = useStreak();
  const { get } = useSettings();
  const next = useNextCourseLesson();

  const [note, setNote] = useState('');
  useEffect(() => {
    setNote(checkin?.note ?? '');
  }, [checkin?.id, checkin?.note]);

  const naam = get('naam').trim();

  return (
    <div className="screen-stack">
      {/* Begroeting */}
      <header className="flex items-start justify-between px-1 pt-2">
        <div className="min-w-0 flex-1">
          <p className="eyebrow">{dateLabel()}</p>
          <h1 className="mt-1.5 font-display text-[29px] font-semibold leading-[1.16] tracking-[-0.01em]">
            {greeting()}
            {naam ? `,` : ''}
            {naam && (
              <>
                <br />
                {naam}
              </>
            )}
          </h1>
        </div>
        {naam && (
          <span className="grid h-11 w-11 flex-none place-items-center rounded-full border border-ap-border bg-apricot-soft text-base font-extrabold text-ap-deep">
            {naam.charAt(0).toUpperCase()}
          </span>
        )}
      </header>

      {/* Check-in · pannetjesmodel */}
      <section className="card" aria-label="Dagelijkse check-in">
        <h2 className="card-title">Welke pan ben je nu?</h2>
        <p className="sub mt-1">Tik op de pan die bij dit moment past.</p>
        <PanSelector
          value={checkin?.pan ?? null}
          onChange={(pan) => {
            void saveCheckin({ pan });
          }}
        />
        {checkin && (
          <>
            <p className="mt-3.5 flex items-start gap-2 text-[12.5px] font-semibold text-ink-soft">
              <span className="mt-[5px] h-2 w-2 flex-none rounded-full bg-euca" aria-hidden="true" />
              Gekozen: Pan {checkin.pan} · {PAN_LABELS[checkin.pan]}. {FEEDBACK[checkin.pan]}
            </p>
            <label className="mt-3 block">
              <span className="sub">Wil je er iets bij opschrijven? (niet verplicht)</span>
              <textarea
                className="input-soft mt-1.5 min-h-[44px] resize-y"
                rows={2}
                value={note}
                placeholder="Eén zin is genoeg."
                onChange={(e) => setNote(e.target.value)}
                onBlur={() => {
                  if (note !== (checkin.note ?? '')) void saveCheckin({ pan: checkin.pan, note });
                }}
              />
            </label>
          </>
        )}
      </section>

      {/* Volgende les — eerste onafgeronde les van de vroegste ontgrendelde week */}
      {next.ready &&
        (next.lesson ? (
          <section className="card" aria-label="Volgende les">
            <p className="eyebrow">{lessonCrumb(next.lesson)}</p>
            <h2 className="card-title mt-1">{next.lesson.title}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {next.lesson.minutes && <span className="chip">± {next.lesson.minutes} min</span>}
              {(next.lesson.tags ?? []).map((t) => (
                <span key={t} className="chip chip-warm">
                  {t}
                </span>
              ))}
            </div>
            <Link to={`/les/${next.lesson.id}`} className="btn-primary mt-3.5">
              {next.lesson.order === 1 && !next.allDone && next.week?.number === 1 ? 'Begin hier' : 'Ga verder'}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 9h12m-5-5 5 5-5 5" />
              </svg>
            </Link>
          </section>
        ) : (
          <section className="card" aria-label="Klaar voor vandaag">
            <h2 className="card-title">Klaar voor vandaag</h2>
            <p className="sub mt-1.5">
              {next.allDone
                ? 'Je hebt alle lessen van de cursus afgerond. Knap gedaan — oefenen blijft altijd open voor je.'
                : 'Alles wat open is, heb je gedaan. Rustig aan: zodra de volgende week opengaat, vind je hier je nieuwe les.'}
            </p>
          </section>
        ))}

      {/* Streak — vergevend */}
      <section className="card flex items-center gap-[15px]" aria-label="Dagen op rij">
        <StreakRing count={streak.count} />
        <div className="min-w-0 flex-1">
          {streak.count > 0 ? (
            <>
              <h2 className="card-title">
                {streak.count} {streak.count === 1 ? 'dag' : 'dagen'} op rij
              </h2>
              <p className="sub mt-[3px]">
                {streak.frozen
                  ? 'Vandaag nog niet ingecheckt — rustig aan, je reeks blijft staan.'
                  : 'Rustig ritme. Een gemiste dag wist niets — je begint gewoon opnieuw.'}
              </p>
            </>
          ) : (
            <>
              <h2 className="card-title">Een zachte start</h2>
              <p className="sub mt-[3px]">Check vandaag even in en begin aan een nieuwe reeks. Klein is genoeg.</p>
            </>
          )}
        </div>
      </section>

      {/* "Steun nu" — statisch onderdeel van deze homepagina:
          staat onderaan de content en scrollt gewoon mee (geen zwevende balk). */}
      <SupportBar />
    </div>
  );
}
