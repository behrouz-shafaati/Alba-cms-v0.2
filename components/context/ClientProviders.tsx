'use client'

import { getClientDictionary } from '@/lib/i18n/client'
import { ClientLocaleProvider } from './client-locale-provider'
import { ThemeProvider } from './theme-provider'

interface ProvidersProps {
  locale: string
  children: React.ReactNode
}

export function ClientProviders({ locale, children }: ProvidersProps) {
  const dictionary = getClientDictionary(locale)
  console.log('#234234 ---> dictionary:', dictionary)
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ClientLocaleProvider dictionary={dictionary}>
        {children}
      </ClientLocaleProvider>
    </ThemeProvider>
  )
}
