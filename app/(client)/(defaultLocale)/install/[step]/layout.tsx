import { LocaleProvider } from '@/components/context/locale-provider'
import { ModeToggle } from '@/components/theme-mode-toggle/ModeToggle'
import { guardInstallStepBySegment } from '@/lib/config/guardInstallStep'
import { getDictionary } from '@/lib/i18n'
import { resolveLocale } from '@/lib/i18n/resolve-locale'

type Props = {
  children: React.ReactNode
  params: Promise<{
    locale: string
    step: string
  }>
}

export default async function RootLayout({ children, params }: Props) {
  const { locale = '', step } = await params
  const resolvedLocale = resolveLocale({ locale })
  const dictionary = getDictionary(resolvedLocale)
  guardInstallStepBySegment(step, locale)
  return (
    <main className=" ">
      <header className="p-2">
        <ModeToggle />
      </header>
      <LocaleProvider dictionary={dictionary}>{children}</LocaleProvider>
    </main>
  )
}
