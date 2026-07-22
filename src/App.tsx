import { Component, lazy, Suspense, useEffect, type ErrorInfo, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import { PinGate } from './components/PinLock';
import UpdatePrompt from './components/UpdatePrompt';
import { db } from './db/db';
import { useApplyTheme, useSettings } from './db/hooks';
import { useApplyDesign } from './lib/design';
import { startReminderScheduler } from './lib/reminders';

// Schermen worden pas geladen als de route ze nodig heeft. Dat houdt de eerste
// download klein, terwijl de service worker ze daarna gewoon offline bewaart.
const Vandaag = lazy(() => import('./screens/Vandaag'));
const Cursus = lazy(() => import('./screens/Cursus'));
const Week = lazy(() => import('./screens/Week'));
const Les = lazy(() => import('./screens/Les'));
const Oefenen = lazy(() => import('./screens/Oefenen'));
const AudioList = lazy(() => import('./screens/AudioList'));
const AudioPlayer = lazy(() => import('./screens/AudioPlayer'));
const HumanVoices = lazy(() => import('./screens/HumanVoices'));
const Vaardigheden = lazy(() => import('./screens/Vaardigheden'));
const OefeningenLijst = lazy(() => import('./screens/OefeningenLijst'));
const FlashcardsOverzicht = lazy(() => import('./screens/FlashcardsOverzicht'));
const FlashcardDeck = lazy(() => import('./components/FlashcardDeck'));
const Profiel = lazy(() => import('./screens/Profiel'));
const Crisis = lazy(() => import('./screens/Crisis'));
const Signaleringsplan = lazy(() => import('./screens/Signaleringsplan'));
const GSchema = lazy(() => import('./screens/GSchema'));
const Onboarding = lazy(() => import('./screens/Onboarding'));
const NotFound = lazy(() => import('./screens/NotFound'));

function RouteLoader() {
  return (
    <div className="screen-stack" role="status" aria-live="polite">
      <p className="card sub">Koers wordt klaargelegd…</p>
    </div>
  );
}

/** Vang onverwachte render-/opslagfouten op met een bruikbare herstelroute. */
export class AppErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Koers kon niet verder laden.', error, info);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="mx-auto flex min-h-[100dvh] w-full max-w-xl items-center px-[18px] py-8 pt-[max(2rem,env(safe-area-inset-top))]">
        <section className="card w-full" role="alert">
          <p className="eyebrow">Er ging iets mis</p>
          <h1 className="mt-1.5 font-display text-[26px] font-semibold leading-tight text-ink">Koers kon niet verder laden</h1>
          <p className="sub mt-2">
            Je lokale gegevens zijn niet verwijderd. Probeer de app opnieuw te laden. Blijft dit gebeuren, exporteer
            je gegevens zodra Profiel weer opent voordat je browsergegevens wist.
          </p>
          <button type="button" className="btn-primary mt-4" onClick={() => window.location.reload()}>
            Opnieuw laden
          </button>
        </section>
      </main>
    );
  }
}

/**
 * Eerste-launch-omleiding: stuurt '/' naar /onboarding zolang de gebruiker de
 * welkomstflow niet heeft afgerond (settings key 'onboarding-done' !== 'ja').
 * Bewust alleen op '/' gelegd — deep links zoals /crisis of /les/... blijven
 * direct bereikbaar.
 */
function RequireOnboarding({ children }: { children: ReactNode }) {
  const { ready, get } = useSettings();
  if (!ready) return <RouteLoader />;
  if (get('onboarding-done') !== 'ja') return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

export default function App() {
  useApplyTheme();
  useApplyDesign();

  // Dagelijkse herinnerings-planner: eenmalig app-breed starten.
  // (Loopt zolang de app open is; zie lib/reminders.ts voor de eerlijke status.)
  useEffect(
    () => startReminderScheduler(async () => (await db.settings.get('herinnering-tijd'))?.value || '19:00'),
    []
  );

  return (
    <>
      <PinGate>
        <Routes>
          {/* Onboarding staat buiten de AppShell: geen tab bar, geen afleiding. */}
          <Route
            path="/onboarding"
            element={
              <Suspense fallback={<RouteLoader />}>
                <Onboarding />
              </Suspense>
            }
          />
          <Route element={<AppShell />}>
            <Route
              path="/"
              element={
                <RequireOnboarding>
                  <Vandaag />
                </RequireOnboarding>
              }
            />
            <Route path="/cursus" element={<Cursus />} />
            <Route path="/cursus/week/:weekId" element={<Week />} />
            <Route path="/les/:lessonId" element={<Les />} />
            <Route path="/oefenen" element={<Oefenen />} />
            <Route path="/oefenen/audio" element={<AudioList />} />
            <Route path="/oefenen/audio/:id" element={<AudioPlayer />} />
            <Route path="/oefenen/echte-stemmen" element={<HumanVoices />} />
            <Route path="/oefenen/vaardigheden" element={<Vaardigheden />} />
            <Route path="/oefenen/oefeningen" element={<OefeningenLijst />} />
            <Route path="/oefenen/flashcards-overzicht" element={<FlashcardsOverzicht />} />
            <Route path="/oefenen/flashcards" element={<FlashcardDeck />} />
            <Route path="/profiel" element={<Profiel />} />
            <Route path="/steun" element={<Crisis />} />
            <Route path="/steun/signaleringsplan" element={<Signaleringsplan />} />
            <Route path="/steun/g-schema" element={<GSchema />} />
            <Route path="/crisis" element={<Navigate to="/steun" replace />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </PinGate>
      {/* Updatemelding: ook zichtbaar op het pin-scherm, app-breed eenmalig gemount. */}
      <UpdatePrompt />
    </>
  );
}
