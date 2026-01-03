import { LANGUAGES } from '../i18n/languages'

export default function getLocaleOptions(localesCode: string[] = []) {
  const options = LANGUAGES.filter((lan) => localesCode.includes(lan.value))
  return options
}
