import { LANGUAGES } from '@/lib/i18n/languages'
type DirectionType = 'ltr' | 'rtl'

export function getDirection(locale: string): DirectionType {
  // اگر locale معتبر بود، dir رو برگردون
  const language = LANGUAGES.find((lang) => lang.value == locale)
  return language.dir || 'ltr'
}
// در غیر این صورت، 'ltr' پیش‌فرض رو برگردون
