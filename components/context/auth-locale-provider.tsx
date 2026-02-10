'use client'
// providers/locale-provider.tsx
import { LocaleSchema } from '@/lib/i18n/auth'
import { LocaleContext } from './install-locale-context'

export function InstallLocaleProvider({
  dictionary,
  children,
}: {
  dictionary: LocaleSchema
  children: React.ReactNode
}) {
  return (
    <LocaleContext.Provider value={dictionary}>
      {children}
    </LocaleContext.Provider>
  )
}
