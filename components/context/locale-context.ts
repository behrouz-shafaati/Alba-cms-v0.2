import { ClientLocaleSchema } from '@/lib/i18n/client'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'
import { InstallLocaleSchema } from '@/lib/i18n/install'
import { createContext } from 'react'

export const LocaleContext = createContext<
  DashboardLocaleSchema | InstallLocaleSchema | ClientLocaleSchema | null
>(null)
