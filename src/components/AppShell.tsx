import { Suspense, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TabBar from './TabBar';

/**
 * App-shell: vult telefoons en tablets, met een rustige maximale breedte in
 * tablet-landschap. De shell blijft vastgepind aan het viewport (fixed inset-0).
 * Alleen <main> scrollt; de tab bar staat daardoor
 * gegarandeerd statisch onderaan — ook als de browser-chrome van iOS
 * tijdens het scrollen in- of uitklapt (100vh/100dvh-gevoeligheid).
 * "Steun" zit als tab in de tab bar en is daardoor app-breed bereikbaar.
 */
export default function AppShell() {
  const mainRef = useRef<HTMLElement>(null);
  const lastHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const { pathname } = useLocation();
  const [routeAnnouncement, setRouteAnnouncement] = useState('');

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    main.scrollTo(0, 0);

    let observer: MutationObserver | null = null;
    let focusFrame: number | undefined;
    let fallbackTimer: number | undefined;
    let stopped = false;

    const announceHeading = (): boolean => {
      const heading = main.querySelector<HTMLHeadingElement>('h1');
      const title = heading?.textContent?.trim();
      // Een lazy route kan het vorige scherm kort zichtbaar houden. Kondig
      // pas een nieuwe h1-node aan, anders blijft titel/focus op de oude route.
      if (!heading || !title || heading === lastHeadingRef.current) return false;
      observer?.disconnect();
      lastHeadingRef.current = heading;
      if (fallbackTimer !== undefined) {
        window.clearTimeout(fallbackTimer);
        fallbackTimer = undefined;
      }
      document.title = title === 'Koers' ? 'Koers' : `${title} · Koers`;
      setRouteAnnouncement(`Pagina: ${title}`);
      heading.tabIndex = -1;
      focusFrame = window.requestAnimationFrame(() => {
        if (!stopped) heading.focus({ preventScroll: true });
      });
      return true;
    };

    // Bij lazy routes staat de nieuwe h1 nog niet direct in de DOM. Wacht op
    // de inhoud in plaats van per ongeluk de kop van de vorige route te pakken.
    if (!announceHeading()) {
      observer = new MutationObserver(() => announceHeading());
      observer.observe(main, { childList: true, subtree: true });
      fallbackTimer = window.setTimeout(() => {
        observer?.disconnect();
        document.title = 'Koers';
        setRouteAnnouncement('Nieuwe Koers-pagina geopend');
      }, 4_000);
    }

    return () => {
      stopped = true;
      observer?.disconnect();
      if (focusFrame !== undefined) window.cancelAnimationFrame(focusFrame);
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
    };
  }, [pathname]);

  return (
    <div className="fixed inset-0 mx-auto flex w-full max-w-5xl flex-col bg-mist">
      <main
        ref={mainRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain pt-[env(safe-area-inset-top)]"
      >
        <Suspense
          fallback={
            <div className="screen-stack" role="status" aria-live="polite">
              <p className="card sub">Pagina wordt klaargelegd…</p>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {routeAnnouncement}
      </p>
      <TabBar />
    </div>
  );
}
