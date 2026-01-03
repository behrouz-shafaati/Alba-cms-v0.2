'use client'

import { useContext } from 'react'
import { LocaleContext } from '@/components/context/locale-context'
import { LocaleSchema as DashboardLocaleSchema } from '@/lib/i18n/dashboard'

export function useLocale(): DashboardLocaleSchema {
  const context = useContext(LocaleContext)

  if (!context) {
    throw new Error('useLocale must be used inside <LocaleProvider>')
  }

  return context
}
