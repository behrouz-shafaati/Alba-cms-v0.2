'use client'

import { useContext } from 'react'
import { LocaleContext } from '@/components/context/locale-context'
import { InstallLocaleSchema } from '@/lib/i18n/install'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'
import { LocaleSchema as AuthLocaleSchema } from '@/lib/i18n/auth'

export function useLocale():
  | DashboardLocaleSchema
  | AuthLocaleSchema
  | InstallLocaleSchema {
  const context = useContext(LocaleContext)

  if (!context) {
    throw new Error('useLocale must be used inside <InstallLocaleProvider>')
  }

  return context
}
