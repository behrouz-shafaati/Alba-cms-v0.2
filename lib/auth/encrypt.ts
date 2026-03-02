import 'server-only'
import { SignJWT } from 'jose'
import { env } from 'node:process'

export async function encrypt(payload: any) {
  const secret = env?.JWT_SECRET
  const encodedSecret = new TextEncoder().encode(secret)

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedSecret)
}
