import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useLocation } from 'react-router';
import { useDoneLessonIds, useSettings } from '../db/hooks';
import { claimDailyCheckinPrompt } from '../lib/dailyCheckinPrompt';
import QuickCheckinForm from './QuickCheckinForm';

interface PromptContext {
  ready: boolean;
  onboardingDone: boolean;
  unlocked: boolean;
  blockedRoute: boolean;
}

function canShowPrompt(context: PromptContext): boolean {
  return (
    context.ready &&
    context.onboardingDone &&
    context.unlocked &&
    !context.blockedRoute
  );
}

function isSafetyRoute(pathname: string): boolean {
  return pathname === '/crisis' || pathname === '/steun' || pathname.startsWith('/steun/');
}

function trapDialogFocus(event: KeyboardEvent<HTMLDivElement>, dialog: HTMLDivElement | null): void {
  if (event.key !== 'Tab' || !dialog) return;
  const focusable = [
    ...dialog.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [href]')
  ];
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first || !last) {
    event.preventDefault();
    dialog.focus();
    return;
  }
  const active = document.activeElement;
  if (event.shiftKey && (active === first || active === dialog || !dialog.contains(active))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
    event.preventDefault();
    first.focus();
  }
}

/** Dagelijkse start-popup; handmatig openen via /check-in?manual=1 blijft altijd mogelijk. */
export default function DailyQuickCheckinPrompt({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  const { pathname, search } = useLocation();
  const { ready, get } = useSettings();
  const doneLessonIds = useDoneLessonIds();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusFrameRef = useRef<number | null>(null);
  const contextRef = useRef<PromptContext>({
    ready: false,
    onboardingDone: false,
    unlocked: false,
    blockedRoute: false
  });
  const openRef = useRef(false);
  const claimInFlightRef = useRef<Promise<boolean> | null>(null);
  const initialAttemptedRef = useRef(false);
  const startedOnManualRouteRef = useRef(
    pathname === '/check-in' && new URLSearchParams(search).get('manual') === '1'
  );

  const manualRoute = pathname === '/check-in' && new URLSearchParams(search).get('manual') === '1';
  const blockedRoute = manualRoute || isSafetyRoute(pathname);
  const context: PromptContext = {
    ready,
    onboardingDone: ready && get('onboarding-done') === 'ja',
    unlocked: doneLessonIds?.has('w01-l03') ?? false,
    blockedRoute
  };
  contextRef.current = context;
  openRef.current = open;

  const tryOpenPrompt = useCallback(() => {
    if (typeof document === 'undefined' || document.visibilityState === 'hidden') return;
    if (openRef.current || !canShowPrompt(contextRef.current) || claimInFlightRef.current) return;

    const claim = claimDailyCheckinPrompt();
    claimInFlightRef.current = claim;
    void claim.then(
      (showPrompt) => {
        if (claimInFlightRef.current === claim) claimInFlightRef.current = null;
        if (showPrompt && !openRef.current && canShowPrompt(contextRef.current)) setOpen(true);
      },
      () => {
        if (claimInFlightRef.current === claim) claimInFlightRef.current = null;
      }
    );
  }, []);

  // Eén poging zodra de appgegevens na openen beschikbaar zijn. Niet alsnog
  // midden in een sessie tonen als Les 3 pas daarna wordt afgerond.
  useEffect(() => {
    if (initialAttemptedRef.current || !ready || doneLessonIds === undefined) return;
    initialAttemptedRef.current = true;
    if (!startedOnManualRouteRef.current) tryOpenPrompt();
  }, [doneLessonIds, ready, tryOpenPrompt]);

  // Een geïnstalleerde iPhone-PWA kan uit de achtergrond hervatten zonder reload.
  useEffect(() => {
    const handleFocus = () => tryOpenPrompt();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') tryOpenPrompt();
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [tryOpenPrompt]);

  // Een bewuste handmatige check-in of directe steunroute krijgt altijd voorrang.
  useEffect(() => {
    if (blockedRoute) setOpen(false);
  }, [blockedRoute]);

  useEffect(() => {
    if (!open) return;
    if (restoreFocusFrameRef.current !== null) {
      window.cancelAnimationFrame(restoreFocusFrameRef.current);
      restoreFocusFrameRef.current = null;
    }
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    let focusFrame = window.requestAnimationFrame(() => {
      focusFrame = window.requestAnimationFrame(() => dialogRef.current?.focus({ preventScroll: true }));
    });
    return () => {
      window.cancelAnimationFrame(focusFrame);
      restoreFocusFrameRef.current = window.requestAnimationFrame(() => {
        restoreFocusFrameRef.current = null;
        const previousFocusIsUseful =
          previousFocus?.isConnected && previousFocus !== document.body && previousFocus !== document.documentElement;
        const focusTarget = previousFocusIsUseful
          ? previousFocus
          : document.querySelector<HTMLElement>('main h1');
        if (!focusTarget) return;
        if (focusTarget.tagName === 'H1') focusTarget.tabIndex = -1;
        focusTarget.focus({ preventScroll: true });
      });
    };
  }, [open]);

  useEffect(
    () => () => {
      if (restoreFocusFrameRef.current !== null) window.cancelAnimationFrame(restoreFocusFrameRef.current);
    },
    []
  );

  // Meld modaliteit vóór de browser schildert, zodat de achtergrond meteen inert
  // is en een eventueel wachtende updatemelding niet tegelijk toegankelijk is.
  useLayoutEffect(() => {
    onOpenChange?.(open);
    return () => {
      if (open) onOpenChange?.(false);
    };
  }, [onOpenChange, open]);

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/35 px-[18px] pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="daily-checkin-title"
      aria-describedby="daily-checkin-description"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          setOpen(false);
          return;
        }
        trapDialogFocus(event, dialogRef.current);
      }}
    >
      <section className="card my-auto w-full max-w-xl shadow-lift">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow">Dagelijkse check-in</p>
            <p id="daily-checkin-description" className="sub mt-1.5">
              Eén rustig moment om te voelen hoe het nu met je gaat.
            </p>
          </div>
          <button type="button" className="btn-secondary flex-none" onClick={() => setOpen(false)}>
            Sluiten
          </button>
        </div>
        <div className="mt-4">
          <QuickCheckinForm checkin={null} onSaved={() => setOpen(false)} titleId="daily-checkin-title" />
        </div>
      </section>
    </div>
  );
}
