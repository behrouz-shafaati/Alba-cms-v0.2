import { SupportedLanguage } from '@/lib/types'
import { Language } from './locales/interface'

type GeneralTranslation = {
  lang: SupportedLanguage
  site_title: string
  site_introduction: string
  homePageId: string
  termsPageId: string
  privacyPageId: string
}
type General = {
  translations: GeneralTranslation[]
  site_url: string
  favicon: string
  faviconDetails: {
    id: string
    srcSmall: string
    srcMedium: string
  }
}

export interface Settings {
  appInstalled?: boolean
  general?: General
  language?: Language
}

export type SettingsKey =
  | ''
  | 'site_title'
  | 'ad'
  | 'appearance'
  | 'general'
  | 'validation'
  | 'users'
  | 'language'

export type GetSessingsProps = {
  key?: SettingsKey
  lang?: string
}
