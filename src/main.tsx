import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
// Theme custom properties, generated from tokens.ts at build time. Imported
// first so :root vars are defined before index.css / component styles use them.
import './theme/theme.generated.css'
import './index.css'
import { I18nProvider } from './i18n/I18nProvider'
import App from './App.tsx'
import { initAutoHideScrollbar } from './utils/autoHideScrollbar'

initAutoHideScrollbar()

const rootEl = document.getElementById('root')!

const app = (
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>
)

// The production build prerenders markup into #root (scripts/prerender.mjs), so
// hydrate it in place. The dev server ships an empty #root, so fall back to a
// fresh client render there.
if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, app)
} else {
  createRoot(rootEl).render(app)
}
