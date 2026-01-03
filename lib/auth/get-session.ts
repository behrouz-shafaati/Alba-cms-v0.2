// lib/auth/get-session.ts
import 'server-only'
import { cookies } from 'next/headers'
import { cache } from 'react'
import { decrypt } from './decrypt'
import { Session } from '../types'

const guestUser = { user: { roles: ['guest'] } }

export const getSession = cache(async (): Promise<Session | null> => {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value
    if (!session) return guestUser

    const decryptedSession = await decrypt(session)
    if (!decryptedSession) return guestUser
    return decryptedSession
  } catch (err) {
    console.error('❌ cookies() called outside request context', err)
    return guestUser
  }
})
