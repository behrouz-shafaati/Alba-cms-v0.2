// i18n/index.ts
import fa from './locales/fa.json'
import en from './locales/en.json'
import { SupportedLanguage } from '../types/types'

const dictionaries = { fa, en }

export function getDictionary(locale: SupportedLanguage | undefined) {
  const DEFAULT_LANGUAGE = 'en'
  console.log('#234 locale in getDictionary:', locale)
  console.log('#234 dictionaries in getDictionary:', dictionaries)
  if (locale === undefined) locale = DEFAULT_LANGUAGE
  return dictionaries[locale] ?? dictionaries.en
}

export function getDir(locale: SupportedLanguage) {
  return dictionaries[locale]?.dir ?? 'ltr'
}
