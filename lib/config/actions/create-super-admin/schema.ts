import { z } from 'zod'
import { getInstallDictionary } from '@/lib/i18n/install'
import { SupportedLanguage } from '@/lib/types'

export default function createConfigSuperAdminSchema(
  locale: SupportedLanguage
) {
  const t = getInstallDictionary(locale)

  return z.object({
    firstName: z
      .string({ required_error: t.user.fName.required_error })
      .min(1, { message: t.user.fName.required_error }),

    lastName: z
      .string({ required_error: t.user.lName.required_error })
      .min(1, { message: t.user.lName.required_error }),

    email: z
      .string({ required_error: t.user.email.required_error })
      .min(1, { message: t.user.email.required_error })
      .email({ message: t.user.email.valid_error }),

    mobile: z
      .string({ required_error: t.user.mobile.required_error })
      .min(1, { message: t.user.mobile.required_error }),

    password: z
      .string({ required_error: t.user.password.required_error })
      .min(6, { message: t.user.password.min_error }),

    confirmPassword: z
      .string({
        required_error: t.user.confirmPassword.required_error,
      })
      .min(1, { message: t.user.confirmPassword.required_error }),
  })
}
