interface KoersCompassProps {
  className?: string;
}

/** Rustig, decoratief koerspunt voor de Kompas-interface. */
export default function KoersCompass({ className = '' }: KoersCompassProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="48" cy="48" r="42" fill="var(--raised)" fillOpacity=".76" />
      <circle cx="48" cy="48" r="34" stroke="var(--euca)" strokeOpacity=".38" strokeWidth="1.5" />
      <path d="M48 10v7M48 79v7M10 48h7M79 48h7" stroke="var(--euca-deep)" strokeWidth="2" strokeLinecap="round" />
      <path d="m60.8 34.1-8.5 19.2-17.1 8.6 8.5-19.2 17.1-8.6Z" fill="var(--euca-deep)" />
      <path d="m35.2 61.9 8.5-19.2 8.6 10.6-17.1 8.6Z" fill="var(--apricot)" />
      <circle cx="48" cy="48" r="3.8" fill="var(--raised)" stroke="var(--ink)" strokeWidth="1.4" />
    </svg>
  );
}
