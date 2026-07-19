import { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';

export type DesignSetting = 'noordzeemist' | 'zand-salie' | 'terracotta-linnen';

export interface DesignOption {
  value: DesignSetting;
  label: string;
  sub: string;
  swatches: [string, string, string, string];
  themeColor: { light: string; dark: string };
}

export const DESIGNS: DesignOption[] = [
  {
    value: 'noordzeemist',
    label: 'Noordzeemist',
    sub: 'Rustig groen & zacht',
    swatches: ['#f2f4f1', '#fcfcfa', '#5e8577', '#d9a88b'],
    themeColor: { light: '#F2F4F1', dark: '#202826' }
  },
  {
    value: 'zand-salie',
    label: 'Zand & Salie',
    sub: 'Warm, aards, spa-kalm',
    swatches: ['#f7f3ec', '#fdfbf7', '#7d9285', '#c08a6d'],
    themeColor: { light: '#F7F3EC', dark: '#26211C' }
  },
  {
    value: 'terracotta-linnen',
    label: 'Terracotta & Linnen',
    sub: 'Mediterraan & zongebakken',
    swatches: ['#faf5ee', '#fffdf8', '#b96a4b', '#d9b36a'],
    themeColor: { light: '#FAF5EE', dark: '#2B221C' }
  }
];

/** Past het opgeslagen ontwerp live toe en synchroniseert de PWA-statusbalk. */
export function useApplyDesign(): void {
  const row = useLiveQuery(() => db.settings.get('design'), []);

  useEffect(() => {
    const value = (row?.value ?? 'noordzeemist') as DesignSetting;
    const design = DESIGNS.find((option) => option.value === value) ?? DESIGNS[0];
    const root = document.documentElement;
    root.dataset.theme = design.value;

    const syncThemeColor = () => {
      const content = root.classList.contains('dark') ? design.themeColor.dark : design.themeColor.light;
      const metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');
      if (metas.length === 0) {
        const meta = document.createElement('meta');
        meta.name = 'theme-color';
        meta.content = content;
        document.head.appendChild(meta);
      } else {
        metas.forEach((meta) => {
          meta.content = content;
        });
      }
    };

    syncThemeColor();
    const observer = new MutationObserver(syncThemeColor);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [row?.value]);
}
