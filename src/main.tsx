import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
// Theme custom properties, generated from tokens.ts at build time. Imported
// first so :root vars are defined before index.css / component styles use them.
import './theme/theme.generated.css'
import './index.css'
import './styles/liquid-glass.css'
import { I18nProvider } from './i18n/I18nProvider'
import { AuthProvider } from './lib/auth'
import { ContentProvider } from './lib/content'
import { EditModeProvider } from './lib/edit-mode'
import App from './App.tsx'
import { initAutoHideScrollbar } from './utils/autoHideScrollbar'

initAutoHideScrollbar()

const rootEl = document.getElementById('root')!

// Provider order is load-bearing. I18nProvider is outermost because
// ContentProvider merges database overrides into i18next and EditableText reads
// through t(). AuthProvider precedes EditModeProvider, which derives canEdit
// from isAdmin.
const app = (
  <StrictMode>
    <I18nProvider>
      <AuthProvider>
        <ContentProvider>
          <EditModeProvider>
            <App />
          </EditModeProvider>
        </ContentProvider>
      </AuthProvider>
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
