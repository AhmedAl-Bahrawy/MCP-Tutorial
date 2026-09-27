import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useStytchB2BClient, useStytchMember } from '@stytch/react/b2b'
import { useStytch, useStytchUser } from '@stytch/react'
import { consumeReturnTo, redirectIfReturnTo } from '../lib/returnTo'
import { isB2B } from '../lib/stytchConfig'

function AuthenticateB2B() {
  const stytch = useStytchB2BClient()
  const { member } = useStytchMember()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (started) return
    const token = searchParams.get('token')
    const tokenType = searchParams.get('stytch_token_type')
    if (!token || !tokenType) {
      navigate('/', { replace: true })
      return
    }

    setStarted(true)
    void (async () => {
      try {
        if (tokenType === 'multi_tenant_magic_links') {
          await stytch.magicLinks.authenticate({
            magic_links_token: token,
            session_duration_minutes: 60,
          })
        } else if (tokenType === 'oauth') {
          await stytch.oauth.authenticate({
            oauth_token: token,
            session_duration_minutes: 60,
          })
        } else if (tokenType === 'discovery') {
          await stytch.magicLinks.discovery.authenticate({
            discovery_magic_links_token: token,
          })
          navigate('/login', { replace: true })
          return
        } else {
          throw new Error(`Unsupported token type: ${tokenType}`)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Authentication failed')
      }
    })()
  }, [navigate, searchParams, started, stytch])

  useEffect(() => {
    if (!member) return
    const returnTo = consumeReturnTo()
    if (returnTo) {
      window.location.href = returnTo
      return
    }
    navigate('/', { replace: true })
  }, [member, navigate])

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Completing sign-in</h1>
        {error ? <p className="error">{error}</p> : <p className="muted">One moment…</p>}
      </div>
    </main>
  )
}

function AuthenticateConsumer() {
  const stytch = useStytch()
  const { user } = useStytchUser()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (started) return
    const token = searchParams.get('token')
    const tokenType = searchParams.get('stytch_token_type')
    if (!token || !tokenType) {
      navigate('/', { replace: true })
      return
    }

    setStarted(true)
    void (async () => {
      try {
        if (tokenType === 'magic_links') {
          await stytch.magicLinks.authenticate(token, { session_duration_minutes: 60 })
        } else if (tokenType === 'oauth') {
          await stytch.oauth.authenticate(token, { session_duration_minutes: 60 })
        } else {
          throw new Error(`Unsupported token type: ${tokenType}`)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Authentication failed')
      }
    })()
  }, [navigate, searchParams, started, stytch])

  useEffect(() => {
    if (!user) return
    const returnTo = consumeReturnTo()
    if (returnTo) {
      window.location.href = returnTo
      return
    }
    navigate('/', { replace: true })
  }, [user, navigate])

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Completing sign-in</h1>
        {error ? <p className="error">{error}</p> : <p className="muted">One moment…</p>}
      </div>
    </main>
  )
}

export function AuthenticatePage() {
  return isB2B ? <AuthenticateB2B /> : <AuthenticateConsumer />
}

/** After inline login (no magic-link redirect), send user back to MCP OAuth URL. */
export function useLoginReturnRedirect(isLoggedIn: boolean) {
  useEffect(() => {
    redirectIfReturnTo(isLoggedIn)
  }, [isLoggedIn])
}
