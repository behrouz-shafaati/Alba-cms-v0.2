'use client'

import { useContext } from 'react'
import { LocaleContext } from '@/components/context/locale-context'
import { InstallLocaleSchema } from '@/lib/i18n/install'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'
import { LocaleSchema as AuthLocaleSchema } from '@/lib/i18n/auth'
import { ClientLocaleSchema } from '@/lib/i18n/client'

export function useLocale():
  | DashboardLocaleSchema
  | AuthLocaleSchema
  | InstallLocaleSchema
  | ClientLocaleSchema {
  const context = useContext(LocaleContext)

  if (!context) {
    throw new Error('useLocale must be used inside LocaleProvider')
  }

  return context
}
