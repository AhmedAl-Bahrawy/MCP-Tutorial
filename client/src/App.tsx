import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { stytchPublicToken } from './lib/stytchConfig'
import { authorizePath, isAuthorizeRequest } from './lib/oauthParams'
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

/**
 * The Stytch Authorization URL is often just the site root, so an MCP client can
 * open this app on any path with the authorization request in the query string.
 * Send those requests to the page that hosts the IdentityProvider, query string
 * intact, so Stytch can read client_id, redirect_uri, state and the PKCE challenge.
 */
function Landing() {
  const search = typeof window === 'undefined' ? '' : window.location.search

  if (isAuthorizeRequest(search)) {
    return <Navigate to={`${authorizePath}${search}`} replace />
  }

  return <Navigate to="/" replace />
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/authenticate" element={<AuthenticatePage />} />
        <Route path={authorizePath} element={<OAuthAuthorizePage />} />
        <Route path="*" element={<Landing />} />
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
