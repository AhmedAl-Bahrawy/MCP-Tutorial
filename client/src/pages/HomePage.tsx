import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <main className="auth-page">
      <div className="auth-card auth-card-wide">
        <p className="eyebrow">MCP OAuth</p>
        <h1>Authorization frontend</h1>
        <p className="lede">
          When an MCP client (Claude Code, Cursor, MCP Inspector, etc.) needs access,
          it opens your browser here to sign in and approve access. After consent,
          the client receives an authorization code and continues on its own.
        </p>
        <ul className="checklist">
          <li>
            Stytch Dashboard → Connected Apps → set <strong>Authorization URL</strong>{' '}
            to <code>{window.location.origin}/oauth/authorize</code>
          </li>
          <li>
            That page hosts <code>&lt;IdentityProvider /&gt;</code> from the Consumer
            SDK, matching this project&apos;s Consumer authentication
          </li>
          <li>Enable Dynamic Client Registration so MCP clients can obtain a client_id</li>
          <li>
            MCP server PRM: <code>http://127.0.0.1:8000/.well-known/oauth-protected-resource</code>
          </li>
        </ul>
        <div className="actions">
          <Link className="button primary" to="/login">
            Sign in
          </Link>
        </div>
        <p className="muted">
          <Link className="back-link" to="/oauth/authorize">
            Open the authorize page
          </Link>{' '}
          — it needs an MCP client&apos;s query string to do anything.
        </p>
      </div>
    </main>
  )
}
