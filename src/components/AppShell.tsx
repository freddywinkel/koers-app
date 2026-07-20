import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TabBar from './TabBar';

/**
 * App-shell: mobiele kolom (max ~448px), content scrollt,
 * de tab bar blijft onderaan zichtbaar op elk scherm.
 * "Steun" zit als tab in de tab bar en is daardoor app-breed bereikbaar.
 */
export default function AppShell() {
  const mainRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="mx-auto flex h-screen w-full max-w-md flex-col bg-mist supports-[height:100dvh]:h-dvh">
      <main
        ref={mainRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain pt-[env(safe-area-inset-top)]"
      >
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
}
