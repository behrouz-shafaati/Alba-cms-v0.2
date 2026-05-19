'use client'

import { useLocale } from '@/hooks/useLocale'
import { useSession } from '../context/SessionContext'

export default function HelloUser() {
  const { user } = useSession()
  const dictionary = useLocale()
  return (
    <div>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {dictionary.shared.hello} {user?.name} 👋
        </h2>
      </div>
    </div>
  )
}
