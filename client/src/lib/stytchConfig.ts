const origin = typeof window !== 'undefined' ? window.location.origin : ''

export const authenticateRedirectUrl = `${origin}/authenticate`

export const stytchPublicToken = import.meta.env.VITE_STYTCH_PUBLIC_TOKEN
