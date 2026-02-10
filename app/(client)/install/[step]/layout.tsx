import { InstallLocaleProvider } from '@/components/context/install-locale-provider'
import { ModeToggle } from '@/components/theme-mode-toggle/ModeToggle'
import { guardInstallStepBySegment } from '@/lib/config/guardInstallStep'
import { getInstallDictionary } from '@/lib/i18n/install'
import { resolveLocale } from '@/lib/i18n/utils/resolve-locale'

type Props = {
  children: React.ReactNode
  params: Promise<{
    locale: string
    step: string
  }>
}

export default async function Layout({ children, params }: Props) {
  const { locale = '', step } = await params
  const resolvedLocale = resolveLocale({ locale })
  const dictionary = getInstallDictionary(resolvedLocale)
  guardInstallStepBySegment(step, locale)
  return (
    <main className=" ">
      <header className="p-2">
        <ModeToggle />
      </header>
      <InstallLocaleProvider dictionary={dictionary}>
        {children}
      </InstallLocaleProvider>
    </main>
  )
}
