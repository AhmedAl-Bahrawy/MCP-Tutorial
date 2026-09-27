import { createStytchClient } from '@stytch/react'
import { stytchPublicToken } from '../lib/stytchConfig'

/**
 * This Stytch project uses Consumer authentication, so the app always builds the
 * Consumer client. Loading the B2B client here would fail with
 * "This application is using a Stytch client for B2B projects, but the public
 * token is for a Stytch Consumer project."
 */
export const stytchClient = createStytchClient(stytchPublicToken ?? '')
