/**
 * Koers — dagelijkse herinnering (check-in)
 * ---------------------------------------------------
 * Tweestaps-flow (privacy-vriendelijk):
 *   1. De UI toont eerst een uitlegkaart (wat en waarom, geen dark pattern).
 *   2. Pas als de gebruiker op de knop tikt, roepen we
 *      Notification.requestPermission() aan (browsers eisen een user gesture).
 *
 * Scheduling — eerlijke status:
 *   Deze module plant meldingen ZOLANG DE APP OPEN IS:
 *   - een setTimeout tot het eerstvolgende moment van 'HH:MM' vandaag/morgen;
 *   - een check bij app-focus/visibilitychange (timers in achtergrondtabs
 *     worden vertraagd, dus bij terugkeer kijken we of het moment passeerde).
 *   Echte achtergrond-push (app dicht, telefoon in standby) vraagt een
 *   pushserver + VAPID en komt in een latere versie. De meldingtekst is
 *   bewust generiek en privacy-veilig: er staat niets over trauma of stemming.
 *
 * Instelling: tijd staat in settings key 'herinnering-tijd' ('19:00').
 */

export const REMINDER_TITLE = 'Koers';
export const REMINDER_BODY = 'Tijd voor je dagelijkse check-in';
const DEFAULT_TIME = '19:00';

export type PermissionState = NotificationPermission | 'unsupported';

/** Zijn meldingen überhaupt beschikbaar in deze browser/context? */
export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getPermissionState(): PermissionState {
  if (!notificationsSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Stap 2 van de flow: alleen aanroepen vanuit een knop (user gesture).
 * Geeft de resulterende permissie terug.
 */
export async function requestNotificationPermission(): Promise<PermissionState> {
  if (!notificationsSupported()) return 'unsupported';
  try {
    return await Notification.requestPermission();
  } catch {
    // Oudere browsers: callback-API of weigering buiten gesture.
    return Notification.permission;
  }
}

/** 'HH:MM' → { h, m } of null bij ongeldige invoer. */
function parseTime(value: string): { h: number; m: number } | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h > 23 || m > 59) return null;
  return { h, m };
}

/** Milliseconden tot het eerstvolgende moment van 'HH:MM' (vandaag of morgen). */
function msUntilNext(time: string, now = new Date()): number | null {
  const parsed = parseTime(time);
  if (!parsed) return null;
  const next = new Date(now);
  next.setHours(parsed.h, parsed.m, 0, 0);
  if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 1);
  return next.getTime() - now.getTime();
}

/** Dag-sleutel 'YYYY-MM-DD' om max. 1 melding per dag te garanderen. */
function dayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Toon de melding: via de service worker als die er is (beter op mobiel), anders klassiek. */
async function showReminder(): Promise<void> {
  const options: NotificationOptions = {
    body: REMINDER_BODY,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'vv-dagelijkse-checkin', // vervangt een eerdere melding ipv stapelen
    silent: true
  };
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) {
      await reg.showNotification(REMINDER_TITLE, options);
      return;
    }
  } catch {
    // val terug op de klassieke Notification hieronder
  }
  try {
    new Notification(REMINDER_TITLE, options);
  } catch {
    // sommige mobiele browsers staan alleen SW-meldingen toe; dan laten we het rustig
  }
}

/**
 * Start de dagelijkse planner. Werkt zolang de app open is.
 * @param getTime leest de actuele 'HH:MM' (mag async, bv. uit Dexie settings).
 * @returns cleanup-functie (stopt timer + listeners).
 *
 * Gebruik in Profiel (tijdelijk, tot integratie):
 *   useEffect(() => startReminderScheduler(async () =>
 *     (await db.settings.get('herinnering-tijd'))?.value || '19:00'), []);
 * Integrator: verplaats deze eenmalige call naar App.tsx zodat hij app-breed loopt.
 */
export function startReminderScheduler(getTime: () => string | Promise<string>): () => void {
  let timer: number | undefined;
  let lastFiredDay = '';
  let stopped = false;

  async function currentTime(): Promise<string> {
    try {
      const value = await getTime();
      return parseTime(value) ? value : DEFAULT_TIME;
    } catch {
      return DEFAULT_TIME;
    }
  }

  async function fireAndReschedule(): Promise<void> {
    if (stopped) return;
    lastFiredDay = dayKey();
    await showReminder();
    void schedule();
  }

  async function schedule(): Promise<void> {
    if (stopped) return;
    if (timer !== undefined) window.clearTimeout(timer);
    timer = undefined;
    if (getPermissionState() !== 'granted') return;
    const delay = msUntilNext(await currentTime());
    if (delay === null) return;
    timer = window.setTimeout(() => void fireAndReschedule(), delay);
  }

  /** Bij focus: timers kunnen zijn vertraagd; vang een gemist moment zachtjes op. */
  async function checkOnFocus(): Promise<void> {
    if (stopped || getPermissionState() !== 'granted') return;
    const time = await currentTime();
    const now = new Date();
    const todayAt = parseTime(time);
    if (!todayAt) return;
    const scheduledToday = new Date(now);
    scheduledToday.setHours(todayAt.h, todayAt.m, 0, 0);
    const missed = now.getTime() >= scheduledToday.getTime() && lastFiredDay !== dayKey(now);
    if (missed) {
      await fireAndReschedule();
    } else {
      await schedule(); // herbereken (tijd kan ondertussen aangepast zijn)
    }
  }

  const onFocus = () => void checkOnFocus();
  const onVisibility = () => {
    if (document.visibilityState === 'visible') void checkOnFocus();
  };

  window.addEventListener('focus', onFocus);
  document.addEventListener('visibilitychange', onVisibility);
  void schedule();

  return () => {
    stopped = true;
    if (timer !== undefined) window.clearTimeout(timer);
    window.removeEventListener('focus', onFocus);
    document.removeEventListener('visibilitychange', onVisibility);
  };
}
