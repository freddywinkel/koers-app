import type { MetaphorArtId } from '../content/types';

/** Houdt de bron relatief aan index.html, zodat lokaal en GitHub Pages hetzelfde werken. */
export function metaphorArtSrc(art: MetaphorArtId): string {
  const baseUrl = import.meta.env?.BASE_URL ?? './';
  return `${baseUrl}metaphors/${art}.webp`;
}

/** Taalvrije illustratie; de direct aansluitende kaarttekst draagt de betekenis. */
export default function MetaphorArt({ art }: { art: MetaphorArtId }) {
  return (
    <img
      src={metaphorArtSrc(art)}
      width="1062"
      height="444"
      loading="lazy"
      decoding="async"
      alt=""
      aria-hidden="true"
      draggable="false"
      className="metaphor-art block h-full w-full object-contain"
      data-metaphor-art={art}
    />
  );
}
