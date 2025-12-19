import { SupportedLanguage } from '@/lib/types/types'

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
}

export type SettingsKey =
  | ''
  | 'site_title'
  | 'ad'
  | 'appearance'
  | 'general'
  | 'validation'
  | 'users'
