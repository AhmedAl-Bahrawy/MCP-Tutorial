import { useEffect } from 'react'
import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

import {
  B2BProducts,
  StytchB2B,
  useStytchMember,
} from '@stytch/react/b2b'

import {
  Products,
  StytchLogin,
  useStytchUser,
} from '@stytch/react'

import { saveReturnTo, consumeReturnTo } from '../lib/returnTo'
import {
  authenticateRedirectUrl,
  isB2B,
} from '../lib/stytchConfig'

function LoginB2B() {
  const [searchParams] = useSearchParams()
  const { member, isInitialized } = useStytchMember()
  const navigate = useNavigate()

  useEffect(() => {
    const returnTo = searchParams.get('returnTo')

    if (returnTo) {
      saveReturnTo(returnTo)
    }
  }, [searchParams])

  useEffect(() => {
    if (!member) return

    const returnTo = consumeReturnTo()

    if (returnTo) {
      window.location.href = returnTo
      return
    }

    navigate('/', { replace: true })
  }, [member, navigate])

  if (!isInitialized) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <p className="muted">Loading…</p>
        </div>
      </main>
    )
  }

  if (member) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <h1>Signed in</h1>
          <p className="muted">
            Redirecting you back to the MCP client…
          </p>
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

        <h1>Sign in</h1>

        <p className="lede">
          Sign in to approve MCP client access. After login you will
          return to the authorization screen automatically.
        </p>

        <StytchB2B
          config={{
            authFlowType: 'Discovery',
            products: [B2BProducts.emailMagicLinks],

            emailMagicLinksOptions: {
              loginRedirectURL: authenticateRedirectUrl,
              signupRedirectURL: authenticateRedirectUrl,
              discoveryRedirectURL: authenticateRedirectUrl,
            },

            sessionOptions: {
              sessionDurationMinutes: 60,
            },
          }}
        />
      </div>
    </main>
  )
}

function LoginConsumer() {
  const [searchParams] = useSearchParams()
  const { user, isInitialized } = useStytchUser()
  const navigate = useNavigate()

  useEffect(() => {
    const returnTo = searchParams.get('returnTo')

    if (returnTo) {
      saveReturnTo(returnTo)
    }
  }, [searchParams])

  useEffect(() => {
    if (!user) return

    const returnTo = consumeReturnTo()

    if (returnTo) {
      window.location.href = returnTo
      return
    }

    navigate('/', { replace: true })
  }, [user, navigate])

  if (!isInitialized) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <p className="muted">Loading…</p>
        </div>
      </main>
    )
  }

  if (user) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <h1>Signed in</h1>
          <p className="muted">
            Redirecting you back to the MCP client…
          </p>
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

        <h1>Sign in</h1>

        <p className="lede">
          Sign in to approve MCP client access. After login you will
          return to the authorization screen automatically.
        </p>

        <StytchLogin
          config={{
            products: [Products.emailMagicLinks],

            emailMagicLinksOptions: {
              loginRedirectURL: authenticateRedirectUrl,
              signupRedirectURL: authenticateRedirectUrl,
            },
          }}
        />
      </div>
    </main>
  )
}

export function LoginPage() {
  return isB2B ? <LoginB2B /> : <LoginConsumer />
}