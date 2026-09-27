import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useStytch, useStytchUser } from '@stytch/react'
import { redirectToReturnTo } from '../lib/returnTo'

const SESSION_DURATION_MINUTES = 60

export function AuthenticatePage() {
  const stytch = useStytch()
  const { user } = useStytchUser()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    const token = searchParams.get('token')
    const tokenType = searchParams.get('stytch_token_type')
    if (!token || !tokenType) {
      navigate('/', { replace: true })
      return
    }

    started.current = true
    void (async () => {
      try {
        if (tokenType === 'magic_links') {
          await stytch.magicLinks.authenticate(token, {
            session_duration_minutes: SESSION_DURATION_MINUTES,
          })
        } else if (tokenType === 'oauth') {
          await stytch.oauth.authenticate(token, {
            session_duration_minutes: SESSION_DURATION_MINUTES,
          })
        } else {
          throw new Error(`Unsupported token type: ${tokenType}`)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Authentication failed')
      }
    })()
  }, [navigate, searchParams, stytch])

  useEffect(() => {
    if (!user) return
    if (redirectToReturnTo()) return
    navigate('/', { replace: true })
  }, [navigate, user])

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Completing sign-in</h1>
        {error ? (
          <>
            <p className="error">{error}</p>
            <Link className="back-link" to="/login">
              ← Back to sign in
            </Link>
          </>
        ) : (
          <p className="muted">One moment…</p>
        )}
      </div>
    </main>
  )
}
