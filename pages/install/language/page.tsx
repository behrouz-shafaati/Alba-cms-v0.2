import { getDictionary } from '@/lib/i18n/index'
import { PageComponentProps } from '@/lib/types/types'
import SelectLanguageForm from './form'
import { ThemeToggle } from '@/components/ui/theme-toggle/ThemeToggle'

export default function InstallLanguagePage({ locale }: PageComponentProps) {
  const dict = getDictionary(locale) // fallback

  return (
    <>
      <h1 className="text-2xl font-bold">{dict.installer.chooseLanguage}</h1>
      <SelectLanguageForm />
      <ThemeToggle />
    </>
  )
}
