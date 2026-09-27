import { useEffect } from 'react'

const RETURN_TO_KEY = 'mcp_oauth_return_to'
const RETURN_TO_COOKIE = `${RETURN_TO_KEY}_cookie`
const MAX_AGE_SECONDS = 60 * 15

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  for (const part of document.cookie.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return decodeURIComponent(rest.join('='))
  }
  return null
}

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${MAX_AGE_SECONDS}; samesite=lax`
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`
}

/**
 * Remembers the MCP client's authorization URL while the user signs in.
 *
 * It is kept in sessionStorage *and* a short lived cookie: the magic link is
 * followed from an email client, which is a cross-site top-level navigation, so
 * the return trip can land in a brand new tab that has no sessionStorage.
 */
export function saveReturnTo(url: string) {
  sessionStorage.setItem(RETURN_TO_KEY, url)
  writeCookie(RETURN_TO_COOKIE, url)
}

export function peekReturnTo(): string | null {
  return sessionStorage.getItem(RETURN_TO_KEY) ?? readCookie(RETURN_TO_COOKIE)
}

export function consumeReturnTo(): string | null {
  const value = peekReturnTo()
  if (value) {
    sessionStorage.removeItem(RETURN_TO_KEY)
    clearCookie(RETURN_TO_COOKIE)
  }
  return value
}

/** Sends the browser back to the MCP client's authorization request, if there is one. */
export function redirectToReturnTo(): boolean {
  const returnTo = consumeReturnTo()
  if (!returnTo) return false

  // Never bounce the browser to a URL that is not part of this app.
  const target = new URL(returnTo, window.location.origin)
  if (target.origin !== window.location.origin) return false

  window.location.href = target.href
  return true
}

/** After sign-in (no magic link redirect), send the user back to the MCP OAuth URL. */
export function useLoginReturnRedirect(isLoggedIn: boolean) {
  useEffect(() => {
    if (isLoggedIn) redirectToReturnTo()
  }, [isLoggedIn])
}
