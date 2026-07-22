const DAY_MS = 24 * 60 * 60 * 1000;

/** Begin van de lokale kalenderdag voor een timestamp. */
export function startOfLocalDay(ts: number): number {
  const date = new Date(ts);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

/**
 * Tel lokale kalenderdagen op zonder aan te nemen dat iedere dag 24 uur duurt.
 * Dit blijft daardoor correct bij de overgang naar zomer- en wintertijd.
 */
export function addLocalDays(ts: number, amount: number): number {
  const date = new Date(startOfLocalDay(ts));
  date.setDate(date.getDate() + amount);
  return date.getTime();
}

/** Verschil in lokale kalenderdagen, onafhankelijk van DST-dagen van 23/25 uur. */
export function differenceInCalendarDays(later: number, earlier: number): number {
  const laterDate = new Date(later);
  const earlierDate = new Date(earlier);
  const laterDay = Date.UTC(laterDate.getFullYear(), laterDate.getMonth(), laterDate.getDate());
  const earlierDay = Date.UTC(earlierDate.getFullYear(), earlierDate.getMonth(), earlierDate.getDate());
  return Math.round((laterDay - earlierDay) / DAY_MS);
}

/** Stabiele sleutel voor één lokale kalenderdag. */
export function localDayKey(ts: number): string {
  const date = new Date(ts);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
