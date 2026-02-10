import { z } from 'zod'
import { getInstallDictionary } from '@/lib/i18n/install'
import { SupportedLanguage } from '@/lib/types'

export default function generateLocalesSchema(locale: SupportedLanguage) {
  const t = getInstallDictionary(locale)

  return z.object({
    locales: z
      .string({ required_error: t.languages.locales.required_error })
      .min(3, { message: t.languages.locales.required_error }),

    siteDefault: z
      .string({ required_error: t.languages.siteDefault.required_error })
      .min(1, { message: t.languages.siteDefault.required_error }),
    dashboardDefault: z.string({}),
  })
}
