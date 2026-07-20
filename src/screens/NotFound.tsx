import { Link } from 'react-router-dom';

/** Vriendelijke Nederlandse 404. */
export default function NotFound() {
  return (
    <div className="screen-stack pt-10">
      <section className="card text-center">
        <h1 className="font-display text-[26px] font-semibold tracking-[-0.01em]">Deze pagina is er niet (meer)</h1>
        <p className="sub mt-2">Geen probleem — dat gebeurt iedereen weleens. Ga rustig terug naar Vandaag.</p>
        <Link to="/" className="btn-primary mt-4">
          Terug naar Vandaag
        </Link>
      </section>
    </div>
  );
}
