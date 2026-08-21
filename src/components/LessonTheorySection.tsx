import type { TheorySection } from '../content/types';

interface LessonTheorySectionProps {
  section: TheorySection;
  headingId: string;
}

/** Compacte, toetsenbordbedienbare begrippenlijst voor verdiepende lestheorie. */
export default function LessonTheorySection({ section, headingId }: LessonTheorySectionProps) {
  return (
    <section className="card" aria-labelledby={headingId}>
      <p className="eyebrow">Theorie</p>
      <h2 id={headingId} className="card-title mt-1">{section.title}</h2>
      <div className="mt-2 flex flex-col gap-2">
        {section.intro.map((paragraph, index) => (
          <p key={index} className="text-sm leading-[1.55] text-ink-soft">{paragraph}</p>
        ))}
      </div>
      <p className="mt-3 text-[12.5px] font-bold text-euca-deep">Open een naam voor uitleg en een voorbeeld.</p>

      <ol className="mt-3 overflow-hidden rounded-2xl border border-line bg-raised">
        {section.items.map((item, index) => (
          <li key={item.id} className="border-b border-line last:border-b-0">
            <details className="group">
              <summary className="flex min-h-[52px] cursor-pointer list-none items-center gap-3 px-3.5 py-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-euca-deep [&::-webkit-details-marker]:hidden">
                <span className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-eucatint text-xs font-extrabold text-euca-deep" aria-hidden="true">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 text-[14.5px] font-extrabold leading-snug text-ink">{item.title}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="flex-none text-ink-soft transition-transform group-open:rotate-180"
                >
                  <path d="m4 6 4 4 4-4" />
                </svg>
              </summary>
              <div className="mx-3.5 border-t border-line pb-3.5 pt-3">
                {item.alsoCalled && (
                  <p className="text-[12.5px] leading-[1.5] text-ink-soft">
                    <span className="font-extrabold text-ink">Ook genoemd:</span> {item.alsoCalled}
                  </p>
                )}
                <p className={[item.alsoCalled ? 'mt-2' : '', 'text-sm leading-[1.55] text-ink'].join(' ')}>{item.text}</p>
                {item.example && (
                  <p className="mt-2.5 rounded-xl bg-dune px-3 py-2.5 text-[13.5px] leading-[1.5] text-ink">
                    <span className="font-extrabold">Voorbeeld:</span> “{item.example}”
                  </p>
                )}
              </div>
            </details>
          </li>
        ))}
      </ol>

      {section.takeaway && (
        <div className="mt-3.5 rounded-2xl bg-eucatint px-3.5 py-3">
          <p className="text-[12px] font-extrabold uppercase tracking-wide text-euca-deep">Onthoud dit</p>
          <p className="mt-1 text-sm leading-[1.55] text-ink">{section.takeaway}</p>
        </div>
      )}
      {section.caution && (
        <div className="mt-3 rounded-2xl border border-ap-border bg-apricot-soft px-3.5 py-3">
          <p className="text-[12px] font-extrabold uppercase tracking-wide text-ap-deep">Belangrijk</p>
          <p className="mt-1 text-sm leading-[1.55] text-ink">{section.caution}</p>
        </div>
      )}
      {section.source && <p className="mt-3 text-[11.5px] leading-[1.5] text-ink-soft">{section.source}</p>}
    </section>
  );
}
