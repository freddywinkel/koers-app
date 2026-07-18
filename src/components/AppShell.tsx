import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TabBar from './TabBar';

/** Scrollt bij elke routewissel terug naar boven. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/**
 * App-shell: mobiele kolom (max ~448px), content scrollt,
 * de tab bar blijft onderaan zichtbaar op elk scherm.
 * "Steun nu" zit alleen op het homescherm (Vandaag), niet app-breed.
 */
export default function AppShell() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-mist">
      <ScrollToTop />
      <main className="flex-1">
        <Outlet />
      </main>
      <div className="sticky bottom-0 mt-auto">
        <TabBar />
      </div>
    </div>
  );
}
