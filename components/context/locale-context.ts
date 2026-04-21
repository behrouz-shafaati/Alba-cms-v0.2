import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'
import { InstallLocaleSchema } from '@/lib/i18n/install'
import { createContext } from 'react'
import { ClientLocaleSchema } from './client-locale-provider'

export const LocaleContext = createContext<
  DashboardLocaleSchema | InstallLocaleSchema | ClientLocaleSchema | null
>(null)
