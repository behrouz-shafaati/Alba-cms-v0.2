// lib/i18n/resolve-locale.ts
import { getSettingsAction } from '@/lib/features/settings/actions'
import { LANGUAGES } from '@/lib/i18n/languages'

interface ResolveLocaleOptions {
  locale: string
}

export async function resolveLocale({
  locale,
}: ResolveLocaleOptions): Promise<string> {
  const languageSettings = await getSettingsAction({ key: 'language' })
  // 1. اگر در URL زبان هست
  const language = LANGUAGES.find((lang) => lang.value == locale)
  // 2. اگر زبان در URL نیست
  const resolved = language ? language.value : languageSettings?.siteDefault

  return resolved
}
// در غیر این صورت، زبان پیش‌فرض رو برگردون
