import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Koers — PWA-configuratie
// Offline-first: de hele app-shell + fonts + content worden geprecached (Workbox generateSW).
// base '/koers-app/' alleen voor de GitHub Pages-build (mode gh-pages); lokaal blijft '/'.
export default defineConfig(({ mode }) => ({
  base: mode === 'gh-pages' ? '/koers-app/' : '/',
  define: {
    // Build-tijdstip als versielabel (zichtbaar in Profiel → Versie & updates).
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      manifest: {
        name: 'Koers',
        short_name: 'Koers',
        description: 'Een rustige cursus van 12 weken voor meer grip op je gevoelens.',
        lang: 'nl',
        dir: 'ltr',
        display: 'standalone',
        start_url: './',
        scope: './',
        theme_color: '#F2F4F1', // Noordzeemist · Mist
        background_color: '#F2F4F1', // Noordzeemist · Mist (splash)
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        // Precache app-shell, fonts (woff2 via @fontsource) en alle statische assets.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // De drie manifest-iconen worden door vite-plugin-pwa zelf toegevoegd;
        // sluit ze uit van de glob zodat Workbox elke URL maar één keer krijgt.
        globIgnores: ['**/icons/icon-192.png', '**/icons/icon-512.png', '**/icons/icon-maskable-512.png'],
        // Open een bestaande of nieuwe Koers-client wanneer iemand op een
        // dagelijkse herinnering tikt. Het script wordt vanuit public/ gekopieerd.
        importScripts: ['notification-handler.js'],
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            // Geleide oefeningen worden na de eerste download offline bewaard.
            urlPattern: ({ request }) => request.destination === 'audio',
            handler: 'CacheFirst',
            options: {
              cacheName: 'koers-audio',
              expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 90 }
            }
          }
        ]
      }
    })
  ]
}));
