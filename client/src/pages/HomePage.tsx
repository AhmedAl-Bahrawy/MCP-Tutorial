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
          <li>Enable Dynamic Client Registration for MCP clients</li>
          <li>
            MCP server PRM: <code>http://127.0.0.1:8000/.well-known/oauth-protected-resource</code>
          </li>
        </ul>
        <div className="actions">
          <Link className="button primary" to="/login">
            Sign in
          </Link>
          <Link className="button ghost" to="/oauth/authorize">
            OAuth authorize (test)
          </Link>
        </div>
      </div>
    </main>
  )
}
