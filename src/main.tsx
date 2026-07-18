import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Gebundelde fonts (offline, geen CDN): Fraunces voor koppen, Nunito Sans voor body.
import '@fontsource/fraunces/500.css';
import '@fontsource/fraunces/600.css';
import '@fontsource/nunito-sans/400.css';
import '@fontsource/nunito-sans/600.css';
import '@fontsource/nunito-sans/700.css';
import '@fontsource/nunito-sans/800.css';

// Service worker-registratie + updatemelding zit in components/UpdatePrompt.tsx
// (useRegisterSW, registerType 'prompt'). HashRouter: GitHub Pages heeft geen
// SPA-fallback; met hash-routing werkt elke route ook offline via de SW.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
