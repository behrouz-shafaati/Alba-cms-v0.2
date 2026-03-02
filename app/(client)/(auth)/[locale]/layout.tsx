import { AuthLocaleProvider } from '@/components/context/auth-locale-provider'
import { Toaster } from '@/components/ui/sonner'
import { getAuthDictionary } from '@/lib/i18n/auth'
import { getDirection } from '@/lib/i18n/utils/getDirection'
import { resolveLocale } from '@/lib/i18n/utils/resolve-locale'
import { SupportedLanguage } from '@/lib/types'
import '@/app/globals.css'

type Props = {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}

export default async function Layout({ children, params }: Props) {
  const { locale = '' } = await params
  const resolvedLocale = resolveLocale({ locale }) as SupportedLanguage
  const dictionary = getAuthDictionary(resolvedLocale)
  const dir = getDirection(resolvedLocale)
  return (
    <html lang={resolvedLocale} dir={dir}>
      <body>
        <AuthLocaleProvider dictionary={dictionary}>
          {children}
          <Toaster />
        </AuthLocaleProvider>
      </body>
    </html>
  )
}
