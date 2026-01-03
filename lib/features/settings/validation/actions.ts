'use server'

import { z } from 'zod'
import settingsCtrl from '@/lib/features/settings/controller'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth/get-session'
import { User } from '@/lib/features/user/interface'
import { validationSettings } from './interface'
import { FormActionState } from '@/lib/types'
import authorize from '@/lib/utils/authorize'

const METADATA_KEY = 'validation'

const FormSchema = z.object({
  commentApprovalRequired: z.string({}).nullable().optional(),
  emailVerificationRequired: z.string({}).nullable().optional(),
  mobileVerificationRequired: z.string({}).nullable().optional(),
})

/**
 * update settings with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the settings dashboard.
 */

export async function updateValidationSettings(
  prevState: FormActionState,
  formData: FormData
) {
  const rawValues = Object.fromEntries(formData.entries())
  const validatedFields = FormSchema.safeParse(rawValues)

  try {
    const user = (await getSession())?.user as User
    authorize(user.roles, 'settings.moderate.any')
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'لطفا فیلدهای لازم را پر کنید.',
        success: false,
        values: rawValues,
      }
    }

    const params = await sanitizeSettingsData(validatedFields.data)
    console.log('#234897 params:', params)
    await settingsCtrl.findOneAndUpdate({
      filters: { key: METADATA_KEY },
      params,
      options: { upsert: true }, // اگر نبود، بساز
    })
    // Revalidate the path
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'settings',
    })

    // console.log('#234876 revalidating settings paths:', pathes)
    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }

    return {
      message: 'تنظیمات با موفقیت بروز رسانی شد',
      success: true,
      values: rawValues,
    }
  } catch (error: any) {
    if (error.message === 'Forbidden') {
      return {
        success: false,
        status: 403,
        message: 'شما اجازه انجام این کار را ندارید',
      }
    }
    if (process.env.NODE_ENV === 'development') throw error
    console.log('Error in update settings:', error)
    return {
      message: 'خطای پایگاه داده: بروزرسانی مطلب ناموفق بود.',
      success: false,
    }
  }
}

async function sanitizeSettingsData(validatedFields: any) {
  const locale = validatedFields?.locale
  const settingsPayload: validationSettings = validatedFields
  const params = {
    value: {
      commentApprovalRequired:
        settingsPayload?.commentApprovalRequired == 'on' ||
        settingsPayload?.commentApprovalRequired == true
          ? true
          : false,
      emailVerificationRequired:
        settingsPayload?.emailVerificationRequired == 'on' ||
        settingsPayload?.emailVerificationRequired == true
          ? true
          : false,
      mobileVerificationRequired:
        settingsPayload?.mobileVerificationRequired == 'on' ||
        settingsPayload?.mobileVerificationRequired == true
          ? true
          : false,
    },
  }

  return params
}
