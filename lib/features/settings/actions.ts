'use server'

import { getSettings } from './controller'
import { GetSessingsProps, Settings } from './interface'
import { LANGUAGES } from '@/lib/i18n/languages'

export async function getSettingsAction({
  key = '',
  locale = '',
}: GetSessingsProps = {}): Promise<Settings> {
  return getSettings({ key, locale })
}

export async function getLocaleSettingsAction(): Promise<any> {
  const languageSettings = await getSettings({ key: 'language', locale: '' })
  const localeOptions = LANGUAGES.filter((lang) =>
    languageSettings?.locales.includes(lang.value),
  )
  return {
    localeOptions,
    siteDefault: languageSettings?.siteDefault,
    dashboardDefault: languageSettings?.dashboardDefault,
  }
}
