import { createStytchClient } from '@stytch/react'
import { stytchPublicToken } from '../lib/stytchConfig'

export const stytchConsumerClient = createStytchClient(stytchPublicToken ?? '')
