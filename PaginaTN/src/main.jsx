import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { LanguageProvider } from './i18n/LanguageContext.jsx';
import './index.css';
import App from './App.jsx';

const rootEl = document.getElementById('root');

if (!rootEl) {
  document.body.innerHTML = '<p style="padding:24px">No se encontró #root en index.html</p>';
} else {
  createRoot(rootEl).render(
    <StrictMode>
      <ErrorBoundary>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </ErrorBoundary>
    </StrictMode>,
  );
}
