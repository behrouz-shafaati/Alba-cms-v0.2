import 'server-only'
import { SignJWT } from 'jose'
import { getJwtSecret } from '../config/get-jwt-secret'

export async function encrypt(payload: any) {
  const secret = await getJwtSecret()
  const encodedSecret = new TextEncoder().encode(secret)

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedSecret)
}
