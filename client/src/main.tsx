import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { StytchB2BProvider } from '@stytch/react/b2b'
import { StytchProvider } from '@stytch/react'
import './index.css'
import App from './App.tsx'
import { isB2B, stytchPublicToken } from './lib/stytchConfig'
import { stytchB2BClient } from './stytch/b2bClient'
import { stytchConsumerClient } from './stytch/consumerClient'

const root = createRoot(document.getElementById('root')!)

function Root() {
  if (!stytchPublicToken) {
    return <App />
  }

  if (isB2B) {
    return (
      <StytchB2BProvider stytch={stytchB2BClient}>
        <App />
      </StytchB2BProvider>
    )
  }

  return (
    <StytchProvider stytch={stytchConsumerClient}>
      <App />
    </StytchProvider>
  )
}

root.render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
