// i18n/index.ts
import fa from './locales/fa.json'
import en from './locales/en.json'
import { SupportedLanguage } from '@/lib/types'

const dictionaries = { fa, en }
export type DashboardLocaleSchema = typeof en

export function getDashboardDictionary(
  locale: SupportedLanguage | undefined,
): DashboardLocaleSchema {
  const DEFAULT_LANGUAGE = 'en'
  if (locale === undefined) locale = DEFAULT_LANGUAGE
  return dictionaries[locale] ?? dictionaries.en
}

export function getDir(locale: SupportedLanguage) {
  return dictionaries[locale]?.dir ?? 'ltr'
}
