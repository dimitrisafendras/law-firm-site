import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { injectTheme } from './theme/injectTheme'
import './index.css'
import App from './App.tsx'

injectTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
