'use client'

import {
  ClientLocaleProvider,
  ClientLocaleSchema,
} from './client-locale-provider'
import { ThemeProvider } from './theme-provider'

interface ProvidersProps {
  children: React.ReactNode
}

export function ClientProviders({ children }: ProvidersProps) {
  const dictionary: ClientLocaleSchema = {
    input: {
      comboBox: {
        loading: 'Loading',
        notFound: 'Not found',
        placeholder: 'Choose...',
      },
    },
  }
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
