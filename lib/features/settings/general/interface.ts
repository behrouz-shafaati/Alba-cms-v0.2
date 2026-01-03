export type GeneralTranslation = {
  lang: string
  site_title: string

  site_introduction: string
}
export type General = {
  translations: GeneralTranslation[]
  site_url: string
  homePageId: string
  termsPageId: string
  privacyPageId: string
  favicon: string
}
