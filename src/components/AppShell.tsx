import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TabBar from './TabBar';

/**
 * App-shell: mobiele kolom (max ~448px), vastgepind aan het viewport
 * (fixed inset-0). Alleen <main> scrollt; de tab bar staat daardoor
 * gegarandeerd statisch onderaan — ook als de browser-chrome van iOS
 * tijdens het scrollen in- of uitklapt (100vh/100dvh-gevoeligheid).
 * "Steun" zit als tab in de tab bar en is daardoor app-breed bereikbaar.
 */
export default function AppShell() {
  const mainRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="fixed inset-0 mx-auto flex w-full max-w-md flex-col bg-mist">
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
