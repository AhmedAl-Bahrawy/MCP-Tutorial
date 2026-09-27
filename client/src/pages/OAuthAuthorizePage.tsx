import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { B2BIdentityProvider, useStytchMember } from '@stytch/react/b2b'
import { IdentityProvider, useStytchUser } from '@stytch/react'
import { isB2B } from '../lib/stytchConfig'

function OAuthAuthorizeB2B() {
  const { member, isInitialized } = useStytchMember()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isInitialized) return
    if (member) return

    const returnTo = `${window.location.origin}${location.pathname}${location.search}`
    navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`, { replace: true })
  }, [isInitialized, member, navigate, location])

  if (!isInitialized || !member) {
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
        <B2BIdentityProvider />
      </div>
    </main>
  )
}

function OAuthAuthorizeConsumer() {
  const { user, isInitialized } = useStytchUser()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isInitialized) return
    if (user) return

    const returnTo = `${window.location.origin}${location.pathname}${location.search}`
    navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`, { replace: true })
  }, [isInitialized, user, navigate, location])

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

export function OAuthAuthorizePage() {
  return isB2B ? <OAuthAuthorizeB2B /> : <OAuthAuthorizeConsumer />
}
