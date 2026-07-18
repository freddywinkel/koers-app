/**
 * Koers — PWA-installatiehulp
 * --------------------------------------
 * - Vangt het 'beforeinstallprompt'-event op in een module-store (het event
 *   is eenmalig; zonder opslag is hij weg zodra hij gevuurd is).
 * - useCanInstall() geeft live terug of de native prompt beschikbaar is
 *   (Android/desktop Chrome, Edge). iOS/Safari kent dit event niet → daar
 *   toont de UI handmatige stappen (Deel → Zet op beginscherm).
 * - isIOS() detecteert iPhone/iPad via userAgent (+ iPadOS desktop-UA-truc).
 * - isStandalone() detecteert of de app al geïnstalleerd draait.
 */

import { useSyncExternalStore } from 'react';

/** Het niet-standaard beforeinstallprompt-event (Chromium). Niet in TS DOM-lib. */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((l) => l());
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // voorkom de standaard mini-infobar; wij sturen zelf de timing
    deferredPrompt = e as BeforeInstallPromptEvent;
    emit();
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    emit();
  });
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function snapshot(): boolean {
  return deferredPrompt !== null;
}

/** React-hook: true zolang een native installatieprompt beschikbaar is. */
export function useCanInstall(): boolean {
  return useSyncExternalStore(subscribe, snapshot, () => false);
}

/** Niet-react variant voor eenmalige checks. */
export function canInstall(): boolean {
  return snapshot();
}

export type InstallOutcome = 'accepted' | 'dismissed' | 'unavailable';

/**
 * Toont de native prompt. Alleen zinvol als canInstall() true is;
 * aanroepen vanuit een knop (user gesture).
 */
export async function promptInstall(): Promise<InstallOutcome> {
  if (!deferredPrompt) return 'unavailable';
  const event = deferredPrompt;
  deferredPrompt = null; // het event is eenmalig bruikbaar
  emit();
  await event.prompt();
  const choice = await event.userChoice;
  return choice.outcome;
}

/** iPhone / iPad (incl. iPadOS dat zich als Mac voordoet met touch). */
export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
}

/** Draait de app al geïnstalleerd (standalone / display-mode)? */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia('(display-mode: standalone)').matches || navigatorWithStandalone.standalone === true
  );
}
