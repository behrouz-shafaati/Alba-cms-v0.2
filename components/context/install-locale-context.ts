'use client'
import { LocaleSchema } from '@/lib/i18n/install'
import { LocaleSchema as DashboardLocaleSchema } from '@/lib/i18n/dashboard'
import { createContext } from 'react'

export const LocaleContext = createContext<
  DashboardLocaleSchema | LocaleSchema | null
>(null)
