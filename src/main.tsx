import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GeminiProvider } from './context/GeminiContext'
import './styles/variables.css'
import './styles/global.css'
import './styles/components.css'
import './styles/layout.css'
import App from './App.tsx'




createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GeminiProvider>
      <App />
    </GeminiProvider>
  </StrictMode>,
)
