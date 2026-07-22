import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

interface TabDef {
  to: string;
  label: string;
  /** Route-prefixen waarbij deze tab actief oplicht. */
  prefixes: string[];
  icon: ReactNode;
}

const ICON_PROPS = {
  width: 21,
  height: 21,
  viewBox: '0 0 22 22',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
} as const;

const TABS: TabDef[] = [
  {
    to: '/',
    label: 'Vandaag',
    prefixes: ['/'],
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <path d="M3.5 10.3 11 4l7.5 6.3M5.8 9.2V18h10.4V9.2" />
      </svg>
    )
  },
  {
    to: '/cursus',
    label: 'Cursus',
    prefixes: ['/cursus', '/les'],
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H18v15.5H6.5A2.5 2.5 0 0 0 4 21Z" />
        <path d="M4 18.5V5.5M18 15H6.5A2.5 2.5 0 0 0 4 17.5" />
      </svg>
    )
  },
  {
    to: '/oefenen',
    label: 'Oefenen',
    prefixes: ['/oefenen'],
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <path d="M3 8.5h8.5a2.6 2.6 0 1 0-2.6-2.6M3 12.5h12.5a2.6 2.6 0 1 1-2.6 2.6M3 16.5h6.5a2.2 2.2 0 1 1-2.2 2.2" />
      </svg>
    )
  },
  {
    to: '/steun',
    label: 'Steun',
    prefixes: ['/steun', '/crisis'],
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <path
          transform="translate(1 1)"
          d="M10 16.8S3.4 12.9 3.4 8.4A3.6 3.6 0 0 1 10 6.2a3.6 3.6 0 0 1 6.6 2.2c0 4.5-6.6 8.4-6.6 8.4Z"
        />
      </svg>
    )
  }
];

/** Tab bar: 76px, zandwit, 4 tabs; actief = pill-tint + eucalyptus-diep. */
export default function TabBar() {
  const { pathname } = useLocation();
  return (
    <nav
      className="grid min-h-[76px] grid-cols-4 border-t border-line bg-sand px-2.5 pt-2 md:px-12"
      style={{ paddingBottom: 'max(15px, env(safe-area-inset-bottom))' }}
      aria-label="Hoofdnavigatie"
    >
      {TABS.map((tab) => {
        const active = tab.to === '/' ? pathname === '/' : tab.prefixes.some((p) => pathname.startsWith(p));
        return (
          <Link
            key={tab.to}
            to={tab.to}
            aria-current={active ? 'page' : undefined}
            className={[
              'min-w-0 flex flex-col items-center gap-[3px] text-[11px] font-extrabold',
              active ? 'text-euca-deep' : 'text-ink-soft'
            ].join(' ')}
          >
            <span
              className={[
                'grid h-[29px] w-[46px] place-items-center rounded-full',
                active ? 'bg-eucatint text-euca-deep' : 'text-ink-soft'
              ].join(' ')}
            >
              {tab.icon}
            </span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
