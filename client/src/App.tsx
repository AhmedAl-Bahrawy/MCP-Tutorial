import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { stytchPublicToken } from './lib/stytchConfig'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { AuthenticatePage } from './pages/AuthenticatePage'
import { OAuthAuthorizePage } from './pages/OAuthAuthorizePage'
import './App.css'

function MissingConfig() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Configure Stytch</h1>
        <p className="lede">
          Add your public token to <code>client/.env</code>:
        </p>
        <pre className="code-block">VITE_STYTCH_PUBLIC_TOKEN=public-token-test-...</pre>
        <p className="muted">See <code>client/.env.example</code>, then restart Vite.</p>
      </div>
    </main>
  )
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/authenticate" element={<AuthenticatePage />} />
        <Route path="/oauth/authorize" element={<OAuthAuthorizePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  if (!stytchPublicToken) {
    return <MissingConfig />
  }

  return <AppRoutes />
}
