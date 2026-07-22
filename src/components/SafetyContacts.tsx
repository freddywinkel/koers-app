import { crisisContacts } from '../content/crisis';

interface SafetyContactsProps {
  /** Compacte variant voor het openbare deel van het pincode-scherm. */
  compact?: boolean;
}

/**
 * Openbare, statische hulproutes. Deze component leest bewust geen instellingen,
 * plannen of andere lokale gegevens en kan daarom veilig vóór de pincode-gate
 * worden getoond.
 */
export default function SafetyContacts({ compact = false }: SafetyContactsProps) {
  return (
    <section
      className={compact ? 'rounded-2xl border border-ap-border bg-apricot-soft p-4' : 'card border-ap-border'}
      aria-label="Directe hulp en contact"
    >
      <p className="eyebrow !text-ap-deep">Direct hulp nodig?</p>
      <h2 className={[compact ? 'text-[18px]' : 'card-title', 'mt-1 font-display font-semibold text-ink'].join(' ')}>
        Kies wat nu klopt
      </h2>
      <p className="sub mt-1.5">
        Je hoeft niet eerst de oefening af te maken. Bellen of chatten mag meteen.
      </p>

      <div className="mt-3 flex flex-col gap-2.5">
        {crisisContacts.map((contact) => {
          const directDanger = contact.id === '112';
          return (
            <article
              key={contact.id}
              className={[
                'rounded-2xl border p-3.5',
                directDanger ? 'border-ap-border bg-raised' : 'border-line bg-sand'
              ].join(' ')}
            >
              <h3 className="text-[14.5px] font-extrabold text-ink">{contact.title}</h3>
              <p className="sub mt-1">{contact.text}</p>
              <div className={['mt-3 grid gap-2', contact.actions.length > 1 ? 'sm:grid-cols-3' : 'grid-cols-1'].join(' ')}>
                {contact.actions.map((action) => {
                  const external = action.kind === 'link';
                  return (
                    <a
                      key={action.label}
                      href={action.href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noreferrer' : undefined}
                      aria-label={external ? `${action.label} (opent in een nieuw tabblad)` : undefined}
                      className={directDanger ? 'btn-primary !min-h-[46px] !py-2.5' : 'btn-secondary w-full'}
                    >
                      {action.label}
                      {external && <span aria-hidden="true">↗</span>}
                    </a>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
