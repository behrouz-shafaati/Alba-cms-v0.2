'use client'
// providers/locale-provider.tsx
import { LocaleSchema } from '@/lib/i18n/install'
import { LocaleContext } from './locale-context'

export function LocaleProvider({
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
