import { InstallLocaleProvider } from '@/components/context/auth-locale-provider'
import { getAuthDictionary } from '@/lib/i18n/auth'
import { resolveLocale } from '@/lib/i18n/utils/resolve-locale'
import { SupportedLanguage } from '@/lib/types'

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
  return (
    <InstallLocaleProvider dictionary={dictionary}>
      {children}
    </InstallLocaleProvider>
  )
}
