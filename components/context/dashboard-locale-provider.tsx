'use client'
import { LocaleSchema } from '@/lib/i18n/dashboard'
import { LocaleContext } from './install-locale-context'

export function DashboardLocaleProvider({
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
