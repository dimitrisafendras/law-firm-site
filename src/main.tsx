import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { injectTheme } from './theme/injectTheme'
import { AuthProvider } from './lib/auth'
import { ContentProvider } from './lib/content'
import { EditModeProvider } from './lib/edit-mode'
import './i18n'
import './index.css'
import App from './App.tsx'

injectTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ContentProvider>
        <EditModeProvider>
          <App />
        </EditModeProvider>
      </ContentProvider>
    </AuthProvider>
  </StrictMode>,
)
