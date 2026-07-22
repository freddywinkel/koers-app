import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App, { AppErrorBoundary } from './App';
import './index.css';
import './themes.css';
import { installLanguageRuntime } from './i18n';

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
  await installLanguageRuntime();
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <HashRouter>
        <AppErrorBoundary>
          <App />
        </AppErrorBoundary>
      </HashRouter>
    </React.StrictMode>
  );
}

void bootstrap();
