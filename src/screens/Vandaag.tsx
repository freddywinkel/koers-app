import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PanSelector from '../components/PanSelector';
import { PAN_LABELS } from '../components/PanIcon';
import StreakRing from '../components/StreakRing';
import {
  useDoneLessonIds,
  useRecentCheckins,
  useTodayCheckin,
  saveCheckin,
  startOfDay,
  useStreak,
  useSettings
} from '../db/hooks';
import { lessonCrumb } from '../content/helpers';
import { getSkill } from '../content/skills';
import type { PanValue } from '../content/types';
import { useNextCourseLesson } from '../lib/courseHooks';
import { getLocale } from '../i18n';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 6) return 'Goedenavond';
  if (h < 12) return 'Goedemorgen';
  if (h < 18) return 'Goedemiddag';
  return 'Goedenavond';
}

function dateLabel(): string {
  const s = new Intl.DateTimeFormat(getLocale(), { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const FEEDBACK: Record<PanValue, string> = {
  1: 'Mooi. Neem dit rustige gevoel even in je op.',
  2: 'Fijn dat je even voelt hoe het gaat.',
  3: 'Goed dat je het merkt. Je hoeft er nu niets mee.',
  4: 'Dat is veel. Wees extra lief voor jezelf vandaag.',
  5: 'Dat is echt veel. Kijk bij Steun als je direct iets nodig hebt — daar ben je nooit een last.'
};

const RECOMMENDED_SKILL_IDS: Record<PanValue, string> = {
  1: 'waarden-verhelderen',
  2: 'ademanker',
  3: 'gronden-54321',
  4: 'adem-vertragen',
  5: 'gronden-54321'
};

function checkinDateLabel(ts: number): string {
  const label = new Intl.DateTimeFormat(getLocale(), { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(ts));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export default function Vandaag() {
  const checkin = useTodayCheckin();
  const recentCheckins = useRecentCheckins(8);
  const streak = useStreak();
  const doneLessonIds = useDoneLessonIds();
  const { get } = useSettings();
  const next = useNextCourseLesson();
  const panCheckinUnlocked = doneLessonIds?.has('w01-l03') ?? false;

  const [note, setNote] = useState('');
  const [noteStatus, setNoteStatus] = useState<'idle' | 'pending' | 'saved' | 'error'>('idle');
  const noteRef = useRef('');
  const noteDirtyRef = useRef(false);
  const noteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkinRef = useRef(checkin);
  const panRef = useRef<PanValue | null>(checkin?.pan ?? null);
  const panLocallyAheadRef = useRef(false);
  const changeRevisionRef = useRef(0);
  const saveChainRef = useRef<Promise<void>>(Promise.resolve());
  const mountedRef = useRef(true);
  checkinRef.current = checkin;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (noteDirtyRef.current) return;
    const savedNote = checkin?.note ?? '';
    noteRef.current = savedNote;
    setNote(savedNote);
  }, [checkin?.id, checkin?.note]);

  useEffect(() => {
    if (!panLocallyAheadRef.current) panRef.current = checkin?.pan ?? null;
  }, [checkin?.id, checkin?.pan]);

  const queueNoteSave = useCallback((value: string, pan: PanValue, revision = changeRevisionRef.current) => {
    const write = saveChainRef.current
      .catch(() => undefined)
      .then(() => saveCheckin({ pan, note: value }));
    saveChainRef.current = write;
    void write.then(
      () => {
        if (revision === changeRevisionRef.current && panRef.current === pan && noteRef.current === value) {
          noteDirtyRef.current = false;
          panLocallyAheadRef.current = false;
          if (mountedRef.current) setNoteStatus('saved');
        }
      },
      () => {
        if (revision === changeRevisionRef.current && panRef.current === pan && noteRef.current === value) {
          noteDirtyRef.current = true;
          panLocallyAheadRef.current = false;
          panRef.current = checkinRef.current?.pan ?? null;
          if (mountedRef.current) setNoteStatus('error');
        }
      }
    );
    return write;
  }, []);

  const flushNote = useCallback(() => {
    const current = checkinRef.current;
    const pan = panRef.current ?? current?.pan;
    if (!pan || !noteDirtyRef.current) return;
    if (noteTimerRef.current) {
      clearTimeout(noteTimerRef.current);
      noteTimerRef.current = null;
    }
    void queueNoteSave(noteRef.current, pan, changeRevisionRef.current);
  }, [queueNoteSave]);

  useEffect(() => {
    if (!checkin || !noteDirtyRef.current) return;
    if (noteTimerRef.current) clearTimeout(noteTimerRef.current);
    noteTimerRef.current = setTimeout(() => {
      noteTimerRef.current = null;
      void queueNoteSave(noteRef.current, panRef.current ?? checkin.pan, changeRevisionRef.current);
    }, 650);
    return () => {
      if (noteTimerRef.current) clearTimeout(noteTimerRef.current);
    };
  }, [checkin?.id, checkin?.pan, note, queueNoteSave]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') flushNote();
    };
    window.addEventListener('pagehide', flushNote);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('pagehide', flushNote);
      document.removeEventListener('visibilitychange', handleVisibility);
      flushNote();
    };
  }, [flushNote]);

  const recommendation = checkin ? getSkill(RECOMMENDED_SKILL_IDS[checkin.pan]) : undefined;
  const previousCheckins = (recentCheckins ?? []).filter((row) => startOfDay(row.ts) < startOfDay(Date.now())).slice(0, 5);

  const naam = get('naam').trim();
  const initialen = naam
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);

  return (
    <div className="screen-stack">
      {/* Begroeting + profielsnelkoppeling */}
      <header className="flex min-w-0 items-start justify-between gap-3 px-1 pt-2">
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
        <Link
          to="/profiel"
          aria-label="Profiel openen"
          className="flex min-h-12 flex-none items-center gap-2 rounded-2xl border border-euca-deep/25 bg-eucatint px-3.5 text-euca-deep shadow-sm transition-transform active:scale-[0.98]"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-sand/70" aria-hidden="true">
            {initialen ? (
              <span className="text-[12px] font-extrabold">{initialen}</span>
            ) : (
              <svg
                width="19"
                height="19"
                viewBox="0 0 22 22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="7.4" r="3.4" />
                <path d="M4.6 18.6c.8-3.3 3.3-4.9 6.4-4.9s5.6 1.6 6.4 4.9" />
              </svg>
            )}
          </span>
          <span className="text-sm font-extrabold">Profiel</span>
        </Link>
      </header>

      {/* Check-in · pannetjesmodel */}
      <section className="card" aria-label="Dagelijkse check-in">
        <h2 className="card-title">Welke pan ben je nu?</h2>
        <p className="sub mt-1">
          {panCheckinUnlocked ? 'Tik op de pan die bij dit moment past.' : 'Het pannetjesmodel komt later in Week 1 aan bod.'}
        </p>
        <PanSelector
          value={checkin?.pan ?? null}
          disabled={!panCheckinUnlocked}
          onChange={(pan) => {
            if (noteTimerRef.current) {
              clearTimeout(noteTimerRef.current);
              noteTimerRef.current = null;
            }
            panRef.current = pan;
            panLocallyAheadRef.current = true;
            noteDirtyRef.current = true;
            changeRevisionRef.current += 1;
            setNoteStatus('pending');
            void queueNoteSave(noteRef.current, pan, changeRevisionRef.current);
          }}
        />
        {!panCheckinUnlocked && doneLessonIds !== undefined && (
          <div className="mt-3.5 rounded-2xl border border-line bg-dune px-4 py-3" role="status" aria-live="polite">
            <p className="text-sm font-extrabold text-ink">Nog vergrendeld</p>
            <p className="sub mt-1">Rond Week 1, Les 3 af om het pannetjesmodel te ontgrendelen.</p>
            <Link
              to={next.lesson ? `/les/${next.lesson.id}` : '/cursus/week/w01'}
              className="mt-2 inline-flex min-h-[44px] items-center font-extrabold text-euca-deep underline underline-offset-2"
            >
              {next.lesson?.weekId === 'w01' ? `Ga verder met Les ${next.lesson.order}` : 'Ga naar Week 1'}
            </Link>
          </div>
        )}
        {panCheckinUnlocked && checkin && (
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
                onChange={(e) => {
                  noteRef.current = e.target.value;
                  noteDirtyRef.current = true;
                  changeRevisionRef.current += 1;
                  setNoteStatus('pending');
                  setNote(e.target.value);
                }}
                onBlur={flushNote}
              />
              <span className="mt-1 block text-[12px] text-ink-soft" aria-live="polite">
                {noteStatus === 'pending'
                  ? 'Notitie wordt automatisch opgeslagen…'
                  : noteStatus === 'saved'
                    ? 'Notitie opgeslagen.'
                    : noteStatus === 'error'
                      ? 'Opslaan lukte niet. Je tekst blijft staan; probeer het opnieuw.'
                      : 'Je notitie wordt automatisch bewaard.'}
              </span>
            </label>
            {recommendation && (
              <div className="mt-3.5 rounded-2xl border border-euca/25 bg-eucatint px-4 py-3">
                <p className="text-sm font-extrabold text-ink">Past nu: {recommendation.name}</p>
                <p className="sub mt-1">{recommendation.summary}</p>
                <Link
                  to={`/oefenen/vaardigheden?pan=${checkin.pan}&skill=${encodeURIComponent(recommendation.id)}`}
                  className="mt-2 inline-flex min-h-[44px] items-center font-extrabold text-euca-deep underline underline-offset-2"
                >
                  Open deze vaardigheid
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      {panCheckinUnlocked && recentCheckins !== undefined && previousCheckins.length > 0 && (
        <section className="card !p-0" aria-labelledby="recente-checkins-heading">
          <div className="px-[18px] pb-2 pt-[18px]">
            <h2 id="recente-checkins-heading" className="card-title">Recente check-ins</h2>
            <p className="sub mt-1">Zo kun je rustig terugkijken naar de afgelopen dagen.</p>
          </div>
          <ul className="divide-y divide-line">
            {previousCheckins.map((row) => (
              <li key={row.id ?? row.ts} className="px-[18px] py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[13px] font-bold text-ink-soft">{checkinDateLabel(row.ts)}</span>
                  <span className="chip chip-warm">Pan {row.pan} · {PAN_LABELS[row.pan]}</span>
                </div>
                {row.note?.trim() && (
                  <p className="mt-1.5 whitespace-pre-wrap text-sm leading-body text-ink">{row.note}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

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
                  : 'Rustig ritme. Een gemiste dag maakt niets ongedaan — je begint gewoon opnieuw.'}
              </p>
            </>
          ) : (
            <>
              <h2 className="card-title">Een zachte start</h2>
              <p className="sub mt-[3px]">
                {panCheckinUnlocked
                  ? 'Check vandaag even in en begin aan een nieuwe reeks. Klein is genoeg.'
                  : 'Na Week 1, Les 3 kun je hier dagelijks inchecken en een reeks opbouwen.'}
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
