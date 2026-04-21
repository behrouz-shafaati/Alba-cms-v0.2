'use client'
// providers/locale-provider.tsx

import { LocaleContext } from './locale-context'

export type ClientLocaleSchema = {
  input: {
    comboBox: {
      placeholder: string
      loading: string
      notFound: string
    }
  }
}

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
