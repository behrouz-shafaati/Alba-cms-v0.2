// lib/i18n/resolve-locale.ts
import { getSettingsAction } from '@/lib/features/settings/actions'
import { User } from '@/lib/features/user/interface'
import { LANGUAGES } from '@/lib/i18n/languages'
import { getDashboardDictionary } from '../dashboard'
import { getClientDictionary } from '../client'
import { getInstallDictionary } from '../install'
import { getAuthDictionary } from '../auth'

interface ResolveLocaleOptions {
  user?: User | null
  locale?: string | null
  scope?: 'dashboard' | 'client' | 'install' | 'auth'
}

type LocaleResult = {
  resolvedLocale: string
  dictionary: any
  dir?: 'rtl' | 'ltr'
}

export async function resolveLocale({
  user = { locale: null },
  scope = 'dashboard',
  locale = null,
}: ResolveLocaleOptions): Promise<LocaleResult> {
  // entry locale that must resolved
  const languageSettings = await getSettingsAction({ key: 'language' })
  let rawLocale = locale || user?.locale || null
  let fallBackLocale
  switch (scope) {
    case 'dashboard':
      fallBackLocale = languageSettings?.dashboardDefault
      break
    case 'client':
    case 'install':
      fallBackLocale = languageSettings?.siteDefault
      break
  }
  // 1. اگر در لیست زبان هست
  const language = LANGUAGES.find((lang) => lang.value == rawLocale)
  // 2. اگر زبان در لیست نیست
  const resolved = language ? language.value : fallBackLocale

  let dictionary
  switch (scope) {
    case 'dashboard':
      dictionary = getDashboardDictionary(resolved)
      break
    case 'client':
      dictionary = getClientDictionary(resolved)
      break
    case 'install':
      fallBackLocale = dictionary = getInstallDictionary(resolved)
      break
    case 'auth':
      fallBackLocale = dictionary = getAuthDictionary(resolved)
      break
  }

  const resolvedLanguage = LANGUAGES.find((lang) => lang.value == resolved)
  return {
    resolvedLocale: resolved,
    dictionary,
    dir: resolvedLanguage?.dir || 'ltr',
  }
}
// در غیر این صورت، زبان پیش‌فرض رو برگردون
