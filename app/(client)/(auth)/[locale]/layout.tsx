import { AuthLocaleProvider } from '@/components/context/auth-locale-provider'
import { Toaster } from '@/components/ui/sonner'
import { getAuthDictionary } from '@/lib/i18n/auth'
import { getDirection } from '@/lib/i18n/utils/getDirection'
import { resolveLocale } from '@/lib/i18n/utils/resolve-locale'
import { SupportedLanguage } from '@/lib/types'
import '@/app/globals.css'
import { Suspense } from 'react'

type Props = {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}

const Layout_ = async ({ children, params }: Props) => {
  const { locale = '' } = await params
  const resolvedLocale = (await resolveLocale({ locale })) as SupportedLanguage
  const dictionary = getAuthDictionary(resolvedLocale)
  const dir = getDirection(locale)
  return (
    <html lang={locale} dir={dir}>
      <body>
        <AuthLocaleProvider dictionary={dictionary}>
          {children}
          <Toaster />
        </AuthLocaleProvider>
      </body>
    </html>
  )
}

export default async function Layout({ children, params }: Props) {
  return (
    <Suspense fallback="loading auth layout...">
      <Layout_ params={params}>{children}</Layout_>
    </Suspense>
  )
}
