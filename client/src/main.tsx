import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { StytchProvider } from '@stytch/react'
import './index.css'
import App from './App.tsx'
import { stytchPublicToken } from './lib/stytchConfig'
import { stytchClient } from './stytch/client'

export function Root() {
  if (!stytchPublicToken) {
    return <App />
  }

  return (
    <StytchProvider stytch={stytchClient}>
      <App />
    </StytchProvider>
  )
}

const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
