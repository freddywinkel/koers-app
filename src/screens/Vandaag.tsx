import { Link } from 'react-router';
import KoersCompass from '../components/KoersCompass';
import PanSelector from '../components/PanSelector';
import { PAN_LABELS } from '../components/PanIcon';
import QuickCheckinForm from '../components/QuickCheckinForm';
import StreakRing from '../components/StreakRing';
import {
  useDoneLessonIds,
  useRecentCheckins,
  useStreak,
  useSettings
} from '../db/hooks';
import { courseProgress as getCourseProgress, lessonCrumb } from '../content/helpers';
import { getSkill } from '../content/skills';
import type { PanValue } from '../content/types';
import { formatCheckinMoment } from '../lib/checkins';
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

export default function Vandaag() {
  const recentCheckins = useRecentCheckins(5);
  const streak = useStreak();
  const doneLessonIds = useDoneLessonIds();
  const { get } = useSettings();
  const next = useNextCourseLesson();
  const panCheckinUnlocked = doneLessonIds?.has('w01-l03') ?? false;
  const coreProgress = getCourseProgress(doneLessonIds ?? new Set<string>());

  const latestCheckin = recentCheckins?.[0] ?? null;
  const recommendation = latestCheckin ? getSkill(RECOMMENDED_SKILL_IDS[latestCheckin.pan]) : undefined;

  const naam = get('naam').trim();
  const initialen = naam
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);

  const nextLessonCard = !next.ready ? null : next.lesson ? (
    <section className="card route-hero today-next" aria-label="Volgende les">
      <KoersCompass className="route-compass" />
      <div className="route-hero-copy">
        <p className="eyebrow">Volgende les</p>
        <p className="route-crumb mt-2">{lessonCrumb(next.lesson)}</p>
        <h2 className="card-title mt-1">{next.lesson.title}</h2>
      </div>
      <div className="route-progress">
        <div className="route-progress-label">
          <span>{coreProgress.done} van {coreProgress.total} lessen afgerond</span>
          <span>{coreProgress.percent}%</span>
        </div>
        <span
          className="route-progress-track"
          role="progressbar"
          aria-label="Voortgang"
          aria-valuemin={0}
          aria-valuemax={coreProgress.total}
          aria-valuenow={coreProgress.done}
        >
          <span style={{ width: `${coreProgress.percent}%` }} />
        </span>
      </div>
      <div className="route-meta mt-3 flex flex-wrap gap-2">
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
    <section className="card route-hero today-next" aria-label="Klaar voor vandaag">
      <KoersCompass className="route-compass" />
      <div className="route-hero-copy">
        <h2 className="card-title">Klaar voor vandaag</h2>
        <p className="sub mt-1.5">
          {next.allDone
            ? 'Je hebt alle lessen van de cursus afgerond. Knap gedaan — oefenen blijft altijd open voor je.'
            : 'Alles wat open is, heb je gedaan. Rustig aan: zodra de volgende week opengaat, vind je hier je nieuwe les.'}
        </p>
      </div>
    </section>
  );

  return (
    <div className="screen-stack today-screen">
      {/* Begroeting + profielsnelkoppeling */}
      <header className="today-heading flex min-w-0 items-start justify-between gap-3 px-1 pt-2">
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
          className="profile-shortcut flex min-h-12 flex-none items-center gap-2 rounded-2xl border border-euca-deep/25 bg-eucatint px-3.5 text-euca-deep shadow-sm transition-transform active:scale-[0.98]"
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
          <span className="profile-shortcut-label text-sm font-extrabold">Profiel</span>
        </Link>
      </header>

      {/* Duidelijke volgende stap — volgt ook in de DOM direct op de paginakop. */}
      {nextLessonCard}

      {/* Check-in · pannetjesmodel */}
      <section className="card today-checkin" aria-label="Dagelijkse check-in">
        {panCheckinUnlocked ? (
          <>
            <QuickCheckinForm titleId="today-checkin-heading" />
            {latestCheckin && recommendation && (
              <div className="mt-3.5 rounded-2xl border border-euca/25 bg-eucatint px-4 py-3">
                <p className="text-sm font-extrabold text-ink">
                  <span>Past bij je laatste check-in:</span> {recommendation.name}
                </p>
                <p className="sub mt-1">{FEEDBACK[latestCheckin.pan]} {recommendation.summary}</p>
                <Link
                  to={`/oefenen/vaardigheden?pan=${latestCheckin.pan}&skill=${encodeURIComponent(recommendation.id)}`}
                  className="mt-2 inline-flex min-h-[44px] items-center font-extrabold text-euca-deep underline underline-offset-2"
                >
                  Open deze vaardigheid
                </Link>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="card-title">Welke pan ben je nu?</h2>
            <p className="sub mt-1">Het pannetjesmodel komt later in Week 1 aan bod.</p>
            <PanSelector value={null} disabled onChange={() => undefined} />
            {doneLessonIds !== undefined && (
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
          </>
        )}
      </section>

      {/* Streak — vergevend */}
      <section className="card today-streak flex items-center gap-[15px]" aria-label="Dagen op rij">
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

      {panCheckinUnlocked && recentCheckins !== undefined && recentCheckins.length > 0 && (
        <section className="card today-recent !p-0" aria-labelledby="recente-checkins-heading">
          <div className="px-[18px] pb-2 pt-[18px]">
            <h2 id="recente-checkins-heading" className="card-title">Recente check-ins</h2>
            <p className="sub mt-1">Zo kun je rustig terugkijken naar je laatste momenten.</p>
          </div>
          <ul className="divide-y divide-line">
            {recentCheckins.map((row) => (
              <li key={row.id ?? row.ts} className="px-[18px] py-3">
                <div className="flex items-center justify-between gap-3">
                  <time className="text-[13px] font-bold text-ink-soft" dateTime={new Date(row.ts).toISOString()}>
                    {formatCheckinMoment(row.ts, Date.now(), getLocale())}
                  </time>
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

    </div>
  );
}
