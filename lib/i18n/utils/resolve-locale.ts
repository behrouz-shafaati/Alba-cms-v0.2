// lib/i18n/resolve-locale.ts
import { LANGUAGES } from '@/lib/i18n/languages'

const DEFAULT_LOCALE = 'en'

interface ResolveLocaleOptions {
  locale: string
}

export function resolveLocale({ locale }: ResolveLocaleOptions): string {
  // 1. اگر در URL زبان هست
  const language = LANGUAGES.find((lang) => lang.value == locale)

  // 2. اگر زبان در URL نیست
  return language ? language.value : DEFAULT_LOCALE
}
// در غیر این صورت، زبان پیش‌فرض رو برگردون
