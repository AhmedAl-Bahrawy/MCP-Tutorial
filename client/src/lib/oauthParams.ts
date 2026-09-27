export const authorizePath = '/oauth/authorize'

export type AuthorizeParams = {
  clientId: string
  redirectUri: string
  responseType: string
  scope: string | null
  state: string | null
  codeChallenge: string | null
  codeChallengeMethod: string | null
  resources: string[]
}

/**
 * Parses the OAuth 2.0 authorization request (RFC 6749 section 4.1.1) that an MCP
 * client sends to the Authorization URL configured on the Stytch Connected App.
 *
 * Returns null when the URL is not an authorization request, which is what the
 * Stytch IdentityProvider needs to avoid failing with
 * "Required parameter is missing: client_id".
 */
export function parseAuthorizeParams(search: string): AuthorizeParams | null {
  const params = new URLSearchParams(search)

  // Logout requests share the same page but are not authorize requests.
  if (params.has('post_logout_redirect_uri')) return null

  const clientId = params.get('client_id')
  const redirectUri = params.get('redirect_uri')
  if (!clientId || !redirectUri) return null

  return {
    clientId,
    redirectUri,
    responseType: params.get('response_type') ?? 'code',
    scope: params.get('scope'),
    state: params.get('state'),
    codeChallenge: params.get('code_challenge'),
    codeChallengeMethod: params.get('code_challenge_method'),
    resources: params.getAll('resource'),
  }
}

export function isAuthorizeRequest(search: string): boolean {
  return parseAuthorizeParams(search) !== null
}
