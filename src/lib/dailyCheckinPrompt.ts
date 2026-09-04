import { db } from '../db/db';
import { addLocalDays, localDayKey, startOfLocalDay } from './calendar';

export const DAILY_CHECKIN_PROMPT_KEY = 'koers-daily-checkin-prompt-day';

/**
 * Claim de automatische start-check-in voor één lokale kalenderdag.
 * De transactie voorkomt dubbele vertoning door gelijktijdige appvensters.
 */
export async function claimDailyCheckinPrompt(now = Date.now()): Promise<boolean> {
  const dayStart = startOfLocalDay(now);
  const nextDay = addLocalDays(dayStart, 1);
  const dayKey = localDayKey(now);

  return db.transaction('rw', db.settings, db.checkins, async () => {
    const [shownDay, existingCheckin] = await Promise.all([
      db.settings.get(DAILY_CHECKIN_PROMPT_KEY),
      db.checkins.where('ts').between(dayStart, nextDay, true, false).first()
    ]);
    if (shownDay?.value === dayKey || existingCheckin) return false;

    await db.settings.put({ key: DAILY_CHECKIN_PROMPT_KEY, value: dayKey });
    return true;
  });
}
