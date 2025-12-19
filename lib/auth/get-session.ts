// lib/auth/get-session.ts
import 'server-only'
import { cookies } from 'next/headers'
import { cache } from 'react'
import { decrypt } from './decrypt'
import type { Session } from './types'

export const getSession = cache(async (): Promise<Session | null> => {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  if (!token) return null

  return await decrypt(token)
})
