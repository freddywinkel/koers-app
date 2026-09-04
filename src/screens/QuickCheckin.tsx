import { useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router';
import QuickCheckinForm from '../components/QuickCheckinForm';
import { useDoneLessonIds } from '../db/hooks';
import { claimDailyCheckinPrompt } from '../lib/dailyCheckinPrompt';

/** Handmatige check-in; de kale startroute wordt door de dagelijkse popup overgenomen. */
export default function QuickCheckin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const doneLessonIds = useDoneLessonIds();
  const manualOpen = searchParams.get('manual') === '1';

  useEffect(() => {
    if (!manualOpen || doneLessonIds === undefined || !doneLessonIds.has('w01-l03')) return;
    // Een bewuste handmatige opening telt ook als gezien, maar wordt zelf nooit geblokkeerd.
    void claimDailyCheckinPrompt().catch(() => undefined);
  }, [doneLessonIds, manualOpen]);

  // Bestaande installaties starten op deze kale route. AppShell toont daarover
  // de dagelijkse popup en deze omleiding legt Vandaag eronder.
  if (!manualOpen) return <Navigate to="/" replace />;

  if (doneLessonIds === undefined) {
    return (
      <div className="screen-stack">
        <section className="card" role="status" aria-live="polite">
          <p className="sub">Snelle check-in wordt klaargelegd…</p>
        </section>
      </div>
    );
  }

  if (!doneLessonIds.has('w01-l03')) return <Navigate to="/" replace />;

  return (
    <div className="screen-stack">
      <header className="px-1 pt-2">
        <p className="eyebrow">Vandaag</p>
        <div className="mt-1.5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-[29px] font-semibold leading-[1.16] tracking-[-0.01em]">
              Snelle check-in
            </h1>
            <p className="sub mt-1.5">
              Kies je pan en schrijf eventueel één zin. Je moment krijgt automatisch de huidige tijd.
            </p>
          </div>
          <button type="button" className="btn-secondary flex-none" onClick={() => navigate('/', { replace: true })}>
            Sluiten
          </button>
        </div>
      </header>

      <section className="card" aria-label="Snelle check-in">
        <QuickCheckinForm onSaved={() => navigate('/', { replace: true })} />
      </section>
    </div>
  );
}
