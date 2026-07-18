/** @type {import('tailwindcss').Config} */
// Noordzeemist design tokens — gekoppeld aan CSS-variabelen in src/index.css,
// zodat licht/donker (class-based) volledig via de spec-mapping loopt.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mist: 'var(--mist)', // app-achtergrond
        dune: 'var(--dune)', // tintvlakken, chips, ring-track
        sand: 'var(--sand)', // kaartvlak, tab bar
        raised: 'var(--raised)', // verhoogd vlak (geselecteerde pan-tile)
        ink: 'var(--ink)', // primaire tekst (denneninkt)
        'ink-soft': 'var(--ink-soft)', // secundaire tekst
        euca: 'var(--euca)', // primair accent (eucalyptus)
        'euca-deep': 'var(--euca-deep)', // knoppen, actieve tab, eyebrows
        eucatint: 'var(--euca-tint)', // actieve tab-pill, zachte tintvlakken
        apricot: 'var(--apricot)', // warm accent
        'apricot-soft': 'var(--apricot-soft)', // warme achtergrond (Steun nu)
        'ap-deep': 'var(--ap-deep)', // tekst/iconen op apricot-soft
        'ap-border': 'var(--apricot-border)', // dunne warme rand
        line: 'var(--line)', // haarlijnen
        btn: 'var(--btn-bg)', // primaire knopvulling
        'btn-ink': 'var(--btn-ink)', // tekst op primaire knop
        pantile: 'var(--pan-tile)', // pan-selector tegel
        steamwarm: 'var(--steam-warm)', // stoomlijnen pan 4-5 (nooit rood)
        pan1: '#DCE7DF',
        pan2: '#B9CFC0',
        pan3: '#93B7A3',
        pan4: '#E6C6AC',
        pan5: '#D9A88B'
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Nunito Sans"', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        card: '22px'
      },
      boxShadow: {
        card: 'var(--shadow)',
        lift: 'var(--lift-shadow)',
        btn: '0 6px 14px -6px rgba(73, 107, 95, .45)'
      },
      lineHeight: {
        body: '1.5'
      }
    }
  },
  plugins: []
};
