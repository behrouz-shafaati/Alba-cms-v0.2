// providers/server-providers.tsx
import { ClientProviders } from './ClientProviders'

export function ServerProviders({
  locale,
  children,
}: {
  locale: string
  children: React.ReactNode
}) {
  return <ClientProviders locale={locale}>{children}</ClientProviders>
}
