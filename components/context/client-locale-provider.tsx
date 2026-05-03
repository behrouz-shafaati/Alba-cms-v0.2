'use client'
import { ClientLocaleSchema } from '@/lib/i18n/client'
// providers/locale-provider.tsx

import { LocaleContext } from './locale-context'

export function ClientLocaleProvider({
  dictionary,
  children,
}: {
  dictionary: ClientLocaleSchema
  children: React.ReactNode
}) {
  return (
    <LocaleContext.Provider value={dictionary}>
      {children}
    </LocaleContext.Provider>
  )
}
