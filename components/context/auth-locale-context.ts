'use client'
import { LocaleSchema } from '@/lib/i18n/auth'
import { createContext } from 'react'

export const LocaleContext = createContext<LocaleSchema | null>(null)
