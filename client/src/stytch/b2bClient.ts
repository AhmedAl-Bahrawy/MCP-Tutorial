import { createStytchB2BClient } from '@stytch/react/b2b'
import { stytchPublicToken } from '../lib/stytchConfig'

export const stytchB2BClient = createStytchB2BClient(stytchPublicToken ?? '')
