import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { I18nProvider } from './i18n/I18nProvider';
import { AuthProvider } from './lib/auth';
import { ThemeProvider } from './lib/theme';
import { ContentProvider } from './lib/content';
import { EditModeProvider } from './lib/edit-mode';
import App from './App';

// Server entry used only by the postbuild prerender step (scripts/prerender.mjs).
// It renders the exact same tree as main.tsx to a static HTML string that is
// injected into dist/index.html's #root.
//
// The provider stack must match main.tsx exactly, or a component reading one of
// these contexts throws mid-prerender. None of them reach the network here:
// their work happens in effects, which React does not run during
// renderToString. So the prerendered HTML is always the signed-out, edit-locked,
// no-overrides view — which is precisely what the client renders first too, so
// hydration matches.
//
// ThemeProvider is the same story: with no window to read, it resolves to the
// default palette, which is the one the stylesheet paints from bare :root. The
// palette never reaches the markup anyway — it lives on <html data-theme>, set
// by the inline script in index.html before the first paint.
export function render(): string {
  return renderToString(
    <StrictMode>
      <ThemeProvider>
        <I18nProvider>
          <AuthProvider>
            <ContentProvider>
              <EditModeProvider>
                <App />
              </EditModeProvider>
            </ContentProvider>
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </StrictMode>,
  );
}
