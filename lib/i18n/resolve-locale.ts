// lib/i18n/resolve-locale.ts
import localesJson from './locales/locales.json'
export type Locale = keyof typeof localesJson
type DirectionType = 'ltr' | 'rtl'

const locales = Object.keys(localesJson) as Locale[]

const DEFAULT_LOCALE = 'en'

interface ResolveLocaleOptions {
  locale: string
}

export function resolveLocale({ locale }: ResolveLocaleOptions): Locale {
  console.log('#234 raw locale:', locale)
  let resolvedLocale = DEFAULT_LOCALE
  // 1. اگر در URL زبان هست
  if (locales.includes(locale as Locale)) {
    resolvedLocale = locale
  }

  // 2. اگر زبان در URL نیست
  console.log('#2376 resolvedLocale:', resolvedLocale)
  return resolvedLocale as Locale
}

export function getDirection(locale: Locale): DirectionType {
  let resolvedDirection: DirectionType = 'ltr'
  // اگر locale معتبر بود، dir رو برگردون
  if (locales.includes(locale || DEFAULT_LOCALE)) {
    resolvedDirection = localesJson[locale].dir as DirectionType
  }

  // fallback به ltr
  console.log('#2376 resolvedDirection:', resolvedDirection)
  return resolvedDirection
}
