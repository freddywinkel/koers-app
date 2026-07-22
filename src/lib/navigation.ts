import type { NavigateFunction } from 'react-router-dom';

/**
 * Ga terug binnen de app. Een rechtstreeks geopende deep link heeft geen
 * bruikbare app-historie; stuur dan naar een veilige bovenliggende route in
 * plaats van de geïnstalleerde PWA of browser te sluiten.
 */
export function navigateBackOr(navigate: NavigateFunction, fallback: string): void {
  const historyIndex = (window.history.state as { idx?: unknown } | null)?.idx;
  if (typeof historyIndex === 'number' && historyIndex > 0) navigate(-1);
  else navigate(fallback, { replace: true });
}
