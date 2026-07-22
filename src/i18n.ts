import { AUDIO_ENGLISH_OVERRIDES } from './content/audioEnglish';

export type AppLanguage = 'nl' | 'en';

export const LANGUAGE_STORAGE_KEY = 'koers-language';

const TRANSLATABLE_ATTRIBUTES = ['aria-label', 'aria-description', 'placeholder', 'title', 'alt'] as const;
const SKIP_TEXT_WITHIN = 'script, style, textarea, [contenteditable="true"], [data-no-translate]';
let englishTranslations: Readonly<Record<string, string>> = {};
const MANUAL_TRANSLATIONS: Readonly<Record<string, string>> = {
  Instellingen: 'Settings',
  Oefenen: 'Practice',
  Oefening: 'Exercise',
  Vraag: 'Question',
  Signaleringsplan: 'Early warning plan',
  'G-schema': 'Thought record (5G)',
  'Het G-schema': 'The thought record (5G)',
  Vaardigheden: 'Skills',
  Herhaling: 'Review',
  'Echte stemmen': 'Human voices',
  'Emotionele-hulpplan': 'Emotional first aid plan',
  Pannetjesmodel: 'Pressure cooker model',
  Rimpelt: 'Rippling',
  Borrelt: 'Bubbling',
  Pruttelt: 'Simmering',
  'Kookt over': 'Boiling over',
  'Welke pan ben je nu?': 'Which pressure-cooker level are you at right now?',
  'Over jou & de app': 'About you & the app',
  'Versie & updates': 'Version & updates',
  'Wil je ze toch aan? Dat kan via de site-instellingen van je browser (meestal het slotje naast het webadres). Je herinneringstijd bewaren we alvast.':
    'Would you still like notifications? Enable them in your browser site settings (usually via the lock icon next to the address). We have already saved your reminder time.',
  'Tik op Deel (het vierkantje met pijl omhoog).': 'Tap Share (the square with an upward arrow).',
  Deel: 'Share',
  'Zet op beginscherm': 'Add to Home Screen',
  'Tik rechtsboven op het': 'In the top-right corner, tap the',
  'Scroll en tik op': 'Scroll down and tap',
  'Scroll en tik op Zet op beginscherm.': 'Scroll down and tap Add to Home Screen.',
  'Tik rechtsboven op het menu (drie puntjes).': 'Tap the menu in the top-right corner (three dots).',
  'Ik heb 5 dingen gezien': 'I saw 5 things',
  'Ik heb 4 dingen gevoeld': 'I felt 4 things',
  'Ik heb 3 dingen gehoord': 'I heard 3 things',
  'Ik heb 2 dingen geroken': 'I smelled 2 things',
  'Ik heb 1 ding geproefd': 'I tasted 1 thing',
  'Kies wat nu klopt': 'Choose what fits right now',
  'Bel nu 112': 'Call 112 now',
  'Huisarts of huisartsenpost': 'GP or out-of-hours GP service',
  'Heb je een psychische crisis of heb je snel een arts nodig, maar is er geen direct levensgevaar? Bel overdag op werkdagen je eigen huisarts. Bel in de avond, nacht, het weekend of op een feestdag de huisartsenpost.':
    'Are you in a mental health crisis or do you need a doctor quickly, but there is no immediate danger to life? Call your own GP during weekday daytime hours. In the evening, at night, on weekends or public holidays, call the out-of-hours GP service.',
  'Heb je een psychische crisis of snel een arts nodig, maar is er geen direct levensgevaar? Bel op werkdagen overdag je eigen huisarts. Bel ’s avonds, ’s nachts, in het weekend of op een feestdag de huisartsen-spoedpost.':
    'Are you in a mental health crisis or do you need a doctor quickly, but there is no immediate danger to life? Call your own GP during weekday daytime hours. In the evening, at night, on weekends or public holidays, call the out-of-hours GP service.',
  'Huisarts of huisartsen-spoedpost: bij een psychische crisis of als je snel een arts nodig hebt zonder direct levensgevaar. Bel op werkdagen overdag je eigen huisarts. Bel ’s avonds, ’s nachts, in het weekend of op een feestdag de huisartsen-spoedpost.':
    'GP or out-of-hours GP service: if you are in a mental health crisis or need a doctor quickly without immediate danger to life. Call your own GP during weekday daytime hours. In the evening, at night, on weekends or public holidays, call the out-of-hours GP service.'
};

function normalize(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function getLanguage(): AppLanguage {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'en' ? 'en' : 'nl';
  } catch {
    return 'nl';
  }
}

export function getLocale(): 'nl-NL' | 'en-GB' {
  return getLanguage() === 'en' ? 'en-GB' : 'nl-NL';
}

export function storeLanguage(language: AppLanguage): void {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // IndexedDB remains the source of truth if localStorage is blocked.
  }
}

function translateDynamic(value: string): string | undefined {
  let match = /^Week (\d+) (.+) — nog vergrendeld$/.exec(value);
  if (match) return `Week ${match[1]} ${translate(match[2])} — still locked`;
  match = /^Les (\d+), (.+) — nog vergrendeld(?:, rond eerst Les (\d+) af)?$/.exec(value);
  if (match) {
    const blocker = match[3] ? `, complete Lesson ${match[3]} first` : '';
    return `Lesson ${match[1]}, ${translate(match[2])} — still locked${blocker}`;
  }
  match = /^(\d+) van (\d+) lessen afgerond$/.exec(value);
  if (match) return `${match[1]} of ${match[2]} lessons completed`;
  match = /^(\d+) van (\d+)$/.exec(value);
  if (match) return `${match[1]} of ${match[2]}`;
  match = /^(\d+) lessen · (\d+) van (\d+) afgerond$/.exec(value);
  if (match) return `${match[1]} lessons · ${match[2]} of ${match[3]} completed`;
  match = /^(\d+) lessen · helemaal afgerond$/.exec(value);
  if (match) return `${match[1]} lessons · fully completed`;
  match = /^(\d+) lessen$/.exec(value);
  if (match) return `${match[1]} lessons`;
  match = /^Ga verder met Les (\d+)$/.exec(value);
  if (match) return `Continue with Lesson ${match[1]}`;
  match = /^± (\d+) min · eerst Les (\d+)$/.exec(value);
  if (match) return `± ${match[1]} min · complete Lesson ${match[2]} first`;
  match = /^· eerst Les (\d+)$/.exec(value);
  if (match) return `· complete Lesson ${match[1]} first`;
  if (value === '· afgerond') return '· completed';
  match = /^(.+) \(opent in een nieuw tabblad\)$/.exec(value);
  if (match) return `${translate(match[1])} (opens in a new tab)`;

  const replacements: Array<[RegExp, string]> = [
    [/^Week (\d+) · Les (\d+)$/, 'Week $1 · Lesson $2'],
    [/^Pagina: (.+)$/s, 'Page: $1'],
    [/^Week (\d+)$/, 'Week $1'],
    [/^Les (\d+)$/, 'Lesson $1'],
    [/^Stap (\d+) van (\d+)$/, 'Step $1 of $2'],
    [/^Bewaren… (\d+)%$/, 'Saving… $1%'],
    [/^(\d+) van (\d+) lessen$/, '$1 of $2 lessons'],
    [/^(\d+) (?:rij is|rijen zijn) veilig teruggezet\.$/, '$1 rows were restored safely.'],
    [/^(\d+) (?:rij is|rijen zijn) veilig samengevoegd\.$/, '$1 rows were merged safely.']
  ];
  for (const [pattern, replacement] of replacements) {
    if (pattern.test(value)) return value.replace(pattern, replacement);
  }
  return undefined;
}

/** Translate one complete UI/content string while keeping the app fully offline. */
export function translate(value: string): string {
  if (getLanguage() !== 'en') return value;
  const key = normalize(value);
  if (!key) return value;
  return MANUAL_TRANSLATIONS[key] ?? AUDIO_ENGLISH_OVERRIDES[key] ?? englishTranslations[key] ?? translateDynamic(key) ?? value;
}

function translateTextNode(node: Text): void {
  const parent = node.parentElement;
  if (!parent || parent.closest(SKIP_TEXT_WITHIN)) return;
  const source = node.data;
  const key = normalize(source);
  if (!key) return;
  const translated = translate(key);
  if (translated === key) return;
  const leading = source.match(/^\s*/)?.[0] ?? '';
  const trailing = source.match(/\s*$/)?.[0] ?? '';
  node.data = `${leading}${translated}${trailing}`;
}

function translateElement(element: Element): void {
  for (const attribute of TRANSLATABLE_ATTRIBUTES) {
    const source = element.getAttribute(attribute);
    if (!source) continue;
    const translated = translate(source);
    if (translated !== source) element.setAttribute(attribute, translated);
  }
}

export function translateSubtree(root: Node): void {
  if (getLanguage() !== 'en') return;
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text);
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
  if (root.nodeType === Node.ELEMENT_NODE) translateElement(root as Element);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  while (current) {
    if (current.nodeType === Node.TEXT_NODE) translateTextNode(current as Text);
    else translateElement(current as Element);
    current = walker.nextNode();
  }
}

/** Install the saved language before React mounts and watch lazy-loaded routes. */
export async function installLanguageRuntime(): Promise<() => void> {
  const language = getLanguage();
  document.documentElement.lang = language;
  document.documentElement.dataset.koersLanguage = language;
  if (language !== 'en') return () => undefined;

  englishTranslations = (await import('./i18n.generated')).ENGLISH_TRANSLATIONS;

  const originalConfirm = window.confirm.bind(window);
  const originalAlert = window.alert.bind(window);
  window.confirm = (message?: string) => originalConfirm(translate(String(message ?? '')));
  window.alert = (message?: string) => originalAlert(translate(String(message ?? '')));

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') translateSubtree(mutation.target);
      for (const node of mutation.addedNodes) translateSubtree(node);
      if (mutation.type === 'attributes') translateSubtree(mutation.target);
    }
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: [...TRANSLATABLE_ATTRIBUTES]
  });
  translateSubtree(document.documentElement);

  return () => {
    observer.disconnect();
    window.confirm = originalConfirm;
    window.alert = originalAlert;
  };
}
