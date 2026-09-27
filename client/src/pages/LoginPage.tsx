import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Products, StytchLogin, useStytchUser } from '@stytch/react'
import { peekReturnTo, redirectToReturnTo, saveReturnTo } from '../lib/returnTo'
import { authenticateRedirectUrl } from '../lib/stytchConfig'

function SignedIn({ hasPendingRequest }: { hasPendingRequest: boolean }) {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Signed in</h1>
        {hasPendingRequest ? (
          <p className="muted">Redirecting you back to the MCP client…</p>
        ) : (
          <>
            <p className="muted">
              You are signed in. No MCP authorization request is waiting.
            </p>
            <Link className="back-link" to="/">
              ← Home
            </Link>
          </>
        )}
      </div>
    </main>
  )
}

export function LoginPage() {
  const [searchParams] = useSearchParams()
  const { user, isInitialized } = useStytchUser()

  // A pending MCP authorization request is either passed along in the query string
  // or left over from the page the user came from.
  const [hasPendingRequest] = useState(
    () => Boolean(searchParams.get('returnTo') ?? peekReturnTo()),
  )

  useEffect(() => {
    const returnTo = searchParams.get('returnTo')
    if (returnTo) {
      saveReturnTo(returnTo)
    }
  }, [searchParams])

  useEffect(() => {
    if (!user) return
    redirectToReturnTo()
  }, [user])

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
    return <SignedIn hasPendingRequest={hasPendingRequest} />
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
