'use client'
import { LocaleSchema } from '@/lib/i18n/dashboard'
import { createContext } from 'react'

export const DashboardLocaleContext = createContext<LocaleSchema | null>(null)
