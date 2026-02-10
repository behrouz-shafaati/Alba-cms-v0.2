import { LANGUAGES } from '../i18n/languages'

export default function getSlugsWithoutLocale(slugs: string[]) {
  const languagesCode = LANGUAGES.map((lang) => lang.value)
  return slugs.filter((slug) => !languagesCode.includes(slug))
}
