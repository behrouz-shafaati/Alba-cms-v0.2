// providers/server-providers.tsx
import { ClientProviders } from './ClientProviders'

export function ServerProviders({ children }: { children: React.ReactNode }) {
  return <ClientProviders>{children}</ClientProviders>
}
