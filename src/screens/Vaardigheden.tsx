import { useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { skills } from '../content/skills';
import type { PanValue } from '../content/types';
import { PAN_LABELS } from '../components/PanIcon';

const PAN_OPTIONS: PanValue[] = [1, 2, 3, 4, 5];

/** Vaardighedenpagina: alle vaardigheden met pan-filter, bereikbaar via /oefenen/vaardigheden. */
export default function Vaardigheden() {
  const [searchParams, setSearchParams] = useSearchParams();
  /* Pan-filter: null = alles tonen. Een vaardigheid past als de gekozen pan
   * binnen diens panMin..panMax valt. */
  const requestedPan = Number(searchParams.get('pan'));
  const panFilter: PanValue | null =
    Number.isInteger(requestedPan) && requestedPan >= 1 && requestedPan <= 5
      ? (requestedPan as PanValue)
      : null;
  const selectedSkillId = searchParams.get('skill');
  const visibleSkills = useMemo(
    () => (panFilter === null ? skills : skills.filter((s) => s.panMin <= panFilter && panFilter <= s.panMax)),
    [panFilter]
  );

  const setPanFilter = (pan: PanValue | null) => {
    const next = new URLSearchParams(searchParams);
    if (pan === null) next.delete('pan');
    else next.set('pan', String(pan));
    next.delete('skill');
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    if (!selectedSkillId || !visibleSkills.some((skill) => skill.id === selectedSkillId)) return;
    const frame = window.requestAnimationFrame(() => {
      const details = document.getElementById(`skill-${selectedSkillId}`);
      if (!(details instanceof HTMLDetailsElement)) return;
      details.open = true;
      details.scrollIntoView({ behavior: 'smooth', block: 'center' });
      details.querySelector<HTMLElement>('summary')?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [selectedSkillId, visibleSkills]);

  return (
    <div className="screen-stack">
      <header className="px-1 pt-2">
        <Link
          to="/oefenen"
          className="inline-flex min-h-[44px] items-center text-[13px] font-bold text-euca-deep"
        >
          ← Terug naar Oefenen
        </Link>
        <p className="eyebrow mt-1">Oefenen</p>
        <h1 className="mt-1.5 font-display text-[29px] font-semibold leading-[1.16] tracking-[-0.01em]">
          Vaardigheden
        </h1>
        <p className="sub mt-1.5">Kies je pan, dan tonen we alleen wat nú past.</p>
      </header>

      {/* Vaardigheden met pan-filter */}
      <section className="flex flex-col gap-3">
        <div className="card !p-4">
          <p className="text-sm font-extrabold text-ink">Welke pan ben je?</p>
          <p className="sub mt-0.5">Kies je pan, dan tonen we alleen wat nú past.</p>
          <div className="mt-2.5 flex flex-wrap gap-2" role="group" aria-label="Filter vaardigheden op pan">
            <button
              type="button"
              aria-pressed={panFilter === null}
              onClick={() => setPanFilter(null)}
              className={[
                'min-h-[44px] rounded-2xl border px-3.5 text-[13px] font-extrabold',
                panFilter === null ? 'border-euca-deep bg-eucatint text-euca-deep' : 'border-line bg-dune text-ink'
              ].join(' ')}
            >
              Alles
            </button>
            {PAN_OPTIONS.map((pan) => {
              const active = panFilter === pan;
              return (
                <button
                  key={pan}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setPanFilter(active ? null : pan)}
                  className={[
                    'min-h-[44px] rounded-2xl border px-3.5 text-[13px] font-extrabold',
                    active ? 'border-euca-deep bg-eucatint text-euca-deep' : 'border-line bg-dune text-ink'
                  ].join(' ')}
                >
                  {pan} · {PAN_LABELS[pan]}
                </button>
              );
            })}
          </div>
        </div>

        {visibleSkills.length === 0 ? (
          <p className="card sub">Geen vaardigheden gevonden bij deze pan — kies een andere pan of &lsquo;Alles&rsquo;.</p>
        ) : (
          visibleSkills.map((skill) => (
            <details
              id={`skill-${skill.id}`}
              key={skill.id}
              className="card group scroll-mt-4"
            >
              <summary className="flex cursor-pointer list-none items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-euca-deep [&::-webkit-details-marker]:hidden">
                <span className="min-w-0 flex-1">
                  <span className="card-title block">{skill.name}</span>
                  <span className="sub mt-1 block">{skill.summary}</span>
                </span>
                <span className="chip chip-warm flex-none">
                  Pan {skill.panMin}–{skill.panMax}
                </span>
              </summary>
              <ol className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
                {skill.steps.map((step, i) => (
                  <li key={i} className="flex gap-2.5 text-[14.5px] leading-[1.55] text-ink">
                    <span className="grid h-6 w-6 flex-none place-items-center rounded-lg bg-eucatint text-xs font-extrabold text-euca-deep">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </details>
          ))
        )}
      </section>
    </div>
  );
}
