import 'server-only'
import { jwtVerify, errors } from 'jose'
import { getJwtSecret } from '../config/get-jwt-secret'
import { Session } from '../types'

export async function decrypt(token: string): Promise<Session | null> {
  try {
    const secret = await getJwtSecret()
    const encodedSecret = new TextEncoder().encode(secret)
    const { payload } = await jwtVerify<Session>(token, encodedSecret, {
      algorithms: ['HS256'],
    })

    return payload
  } catch (error) {
    if (error instanceof errors.JWTExpired) {
      return null
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('[JWT VERIFY ERROR]', error)
    }

    return null
  }
}
