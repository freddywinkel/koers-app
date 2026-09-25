import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router';
import App, { AppErrorBoundary } from './App';
import './index.css';
import './themes.css';
import { installLanguageRuntime, storeLanguage } from './i18n';
import { db } from './db/db';

// Gebundelde fonts (offline, geen CDN): Fraunces voor koppen, Nunito Sans voor body.
import '@fontsource/fraunces/latin-500.css';
import '@fontsource/fraunces/latin-600.css';
import '@fontsource/nunito-sans/latin-400.css';
import '@fontsource/nunito-sans/latin-600.css';
import '@fontsource/nunito-sans/latin-700.css';
import '@fontsource/nunito-sans/latin-800.css';
import '@fontsource/atkinson-hyperlegible/latin-400.css';
import '@fontsource/atkinson-hyperlegible/latin-700.css';

// Service worker-registratie + updatemelding zit in components/UpdatePrompt.tsx
// (useRegisterSW, registerType 'prompt'). HashRouter: GitHub Pages heeft geen
// SPA-fallback; met hash-routing werkt elke route ook offline via de SW.
async function bootstrap() {
  let initiallyFailed = false;
  try {
    const savedLanguage = (await db.settings.get('language'))?.value;
    storeLanguage(savedLanguage === 'en' ? 'en' : 'nl');
    await installLanguageRuntime();
  } catch (error) {
    // A failed language-chunk download happens before React's boundary exists.
    // Show the same recovery screen instead of leaving an empty app.
    console.error('Koers kon niet opstarten.', error);
    initiallyFailed = true;
  }
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <HashRouter>
        <AppErrorBoundary initiallyFailed={initiallyFailed}>
          <App />
        </AppErrorBoundary>
      </HashRouter>
    </React.StrictMode>
  );
}

void bootstrap();
