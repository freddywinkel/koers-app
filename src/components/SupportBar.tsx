import { Link } from 'react-router-dom';

/**
 * "Steun nu" — persistente, kalme crisis-toegang direct boven de tab bar.
 * Abrikoos-zacht vlak, dunne abrikoos rand, hart-icoon, chevron rechts.
 * Nooit rood, geen alarm, geen animatie (spec §3 "Steun nu").
 */
export default function SupportBar() {
  return (
    <Link
      to="/crisis"
      className="mx-[18px] mb-2.5 flex min-h-[62px] items-center gap-3 rounded-[18px] border border-ap-border bg-apricot-soft px-3.5 py-3"
    >
      <span className="grid h-[38px] w-[38px] flex-none place-items-center rounded-[13px] bg-white/55 text-ap-deep dark:bg-apricot/15">
        <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10 16.8S3.4 12.9 3.4 8.4A3.6 3.6 0 0 1 10 6.2a3.6 3.6 0 0 1 6.6 2.2c0 4.5-6.6 8.4-6.6 8.4Z" />
        </svg>
      </span>
      <span className="text-left">
        <b className="block text-[14.5px] font-extrabold text-ink">Steun nu</b>
        <span className="mt-px block text-xs font-semibold text-ap-deep">Direct rust, contact of een luisterend oor</span>
      </span>
      <svg className="ml-auto flex-none text-ap-deep" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6.5 3.5 11 9l-4.5 5.5" />
      </svg>
    </Link>
  );
}
