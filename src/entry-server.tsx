import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { I18nProvider } from './i18n/I18nProvider';
import App from './App';

// Server entry used only by the postbuild prerender step (scripts/prerender.mjs).
// It renders the exact same tree as main.tsx to a static HTML string that is
// injected into dist/index.html's #root. Rendering happens with the default
// language ('en'); the client applies the saved language after hydration.
export function render(): string {
  return renderToString(
    <StrictMode>
      <I18nProvider>
        <App />
      </I18nProvider>
    </StrictMode>,
  );
}
