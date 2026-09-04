import { localDayKey } from './calendar';

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Datum en lokale tijd voor één bewaard check-inmoment. */
export function formatCheckinTime(ts: number, locale: 'nl-NL' | 'en-GB' = 'nl-NL'): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).format(new Date(ts));
}

export function formatCheckinMoment(
  ts: number,
  now = Date.now(),
  locale: 'nl-NL' | 'en-GB' = 'nl-NL'
): string {
  const time = formatCheckinTime(ts, locale);

  if (localDayKey(ts) === localDayKey(now)) {
    return `${locale === 'en-GB' ? 'Today' : 'Vandaag'} · ${time}`;
  }

  const date = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  }).format(new Date(ts));
  return `${capitalize(date)} · ${time}`;
}
