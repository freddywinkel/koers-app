import { useEffect, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import { PinGate } from './components/PinLock';
import Vandaag from './screens/Vandaag';
import Cursus from './screens/Cursus';
import Week from './screens/Week';
import Les from './screens/Les';
import Oefenen from './screens/Oefenen';
import AudioList from './screens/AudioList';
import AudioPlayer from './screens/AudioPlayer';
import HumanVoices from './screens/HumanVoices';
import FlashcardDeck from './components/FlashcardDeck';
import Profiel from './screens/Profiel';
import Crisis from './screens/Crisis';
import Onboarding from './screens/Onboarding';
import NotFound from './screens/NotFound';
import UpdatePrompt from './components/UpdatePrompt';
import { db } from './db/db';
import { useApplyTheme, useSettings } from './db/hooks';
import { useApplyDesign } from './lib/design';
import { startReminderScheduler } from './lib/reminders';

/**
 * Eerste-launch-omleiding: stuurt '/' naar /onboarding zolang de gebruiker de
 * welkomstflow niet heeft afgerond (settings key 'onboarding-done' !== 'ja').
 * Bewust alleen op '/' gelegd — deep links zoals /crisis of /les/... blijven
 * direct bereikbaar.
 */
function RequireOnboarding({ children }: { children: ReactNode }) {
  const { ready, get } = useSettings();
  if (!ready) return null; // settings laden nog: niets tonen (voorkomt flits)
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
          <Route path="/onboarding" element={<Onboarding />} />
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
            <Route path="/oefenen/flashcards" element={<FlashcardDeck />} />
            <Route path="/profiel" element={<Profiel />} />
            <Route path="/crisis" element={<Crisis />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </PinGate>
      {/* Updatemelding: ook zichtbaar op het pin-scherm, app-breed eenmalig gemount. */}
      <UpdatePrompt />
    </>
  );
}
