import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { IdentityProvider, useStytchUser } from '@stytch/react'
import { parseAuthorizeParams } from '../lib/oauthParams'
import { saveReturnTo } from '../lib/returnTo'

/**
 * Shown when this page is opened without an authorization request. Mounting the
 * IdentityProvider here fails with Stytch's
 * "Required parameter is missing: client_id" error, so check first.
 */
export function MissingAuthorizeParams() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Waiting for an MCP client</h1>
        <p className="lede">
          This page finishes the OAuth handshake for an MCP client, so it has to be
          opened with that client&apos;s authorization request in the query string
          (<code>client_id</code>, <code>redirect_uri</code>, <code>state</code>, …).
        </p>
        <p className="muted">
          Connect an MCP client to the server (<code>claude mcp add</code>, the MCP
          Inspector, …) instead of opening this page directly.
        </p>
        <Link className="back-link" to="/">
          ← Home
        </Link>
      </div>
    </main>
  )
}

export function OAuthAuthorizePage() {
  const { user, isInitialized } = useStytchUser()
  const navigate = useNavigate()
  const location = useLocation()

  const params = parseAuthorizeParams(location.search)
  const authorizeUrl = `${window.location.origin}${location.pathname}${location.search}`

  // Remember the full authorization request so the user comes back to it after
  // signing in, even if the magic link is opened in a different tab.
  useEffect(() => {
    if (params) saveReturnTo(authorizeUrl)
  }, [authorizeUrl, params])

  useEffect(() => {
    if (!isInitialized || user || !params) return
    navigate(`/login?returnTo=${encodeURIComponent(authorizeUrl)}`, { replace: true })
  }, [authorizeUrl, isInitialized, navigate, params, user])

  if (!params) return <MissingAuthorizeParams />

  if (!isInitialized || !user) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <p className="muted">Checking your session…</p>
        </div>
      </main>
    )
  }

  return (
    <main className="auth-page">
      <div className="auth-card auth-card-wide">
        <Link className="back-link" to="/">
          ← Home
        </Link>
        <h1>Authorize MCP client</h1>
        <p className="lede">
          Review the request below. When you allow access, your browser returns to
          the MCP client with an authorization code.
        </p>
        <IdentityProvider />
      </div>
    </main>
  )
}
