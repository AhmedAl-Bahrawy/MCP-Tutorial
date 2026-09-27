import { useEffect } from 'react'

const RETURN_TO_KEY = 'mcp_oauth_return_to'

export function saveReturnTo(url: string) {
  sessionStorage.setItem(RETURN_TO_KEY, url)
}

export function consumeReturnTo(): string | null {
  const value = sessionStorage.getItem(RETURN_TO_KEY)
  if (value) {
    sessionStorage.removeItem(RETURN_TO_KEY)
  }
  return value
}

export function redirectIfReturnTo(isLoggedIn: boolean) {
  if (!isLoggedIn) return false
  const returnTo = consumeReturnTo()
  if (returnTo) {
    window.location.href = returnTo
    return true
  }
  return false
}

/** After inline login (no magic-link redirect), send user back to MCP OAuth URL. */
export function useLoginReturnRedirect(isLoggedIn: boolean) {
  useEffect(() => {
    redirectIfReturnTo(isLoggedIn)
  }, [isLoggedIn])
}
