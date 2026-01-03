'use server'
const METADATA_KEY = 'language'

import { z } from 'zod'
import settingsCtrl from '@/lib/features/settings/controller'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth/get-session'
import { User } from '@/lib/features/user/interface'
import { Language } from './interface'
import { FormActionState } from '@/lib/types'
import authorize from '@/lib/utils/authorize'
import { getSettingsAction } from '../actions'
import generateLocalesSchema from './schema'
import { getDashboardDictionary } from '@/lib/i18n/dashboard'

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
  const locale = formData.get('locale')?.toString() || 'en'
  const t = getDashboardDictionary(locale)
  const FormSchema = generateLocalesSchema(locale)
  const validatedFields = FormSchema.safeParse(rawValues)

  try {
    const user = (await getSession())?.user as User
    authorize(user.roles, 'settings.moderate.any')
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: t.shared.fillForm,
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
      message: t.feature.setting.locales.success,
      success: true,
      values: rawValues,
    }
  } catch (error: any) {
    if (error.message === 'Forbidden') {
      return {
        success: false,
        status: 403,
        message: t.shared.notAuthorized,
      }
    }
    if (process.env.NODE_ENV === 'development') throw error
    console.log('Error in update settings:', error)
    return {
      message: t.shared.dbError,
      success: false,
    }
  }
}

async function sanitizeSettingsData(validatedFields: any) {
  const locale = validatedFields.locale
  // const session = (await getSession()) as Session
  // Create the settings
  const settings: Language = await getSettingsAction(METADATA_KEY)
  const localeOptions = JSON.parse(validatedFields?.locales)
  const locales = localeOptions.map((locale) => locale.value)
  const settingsPayload = validatedFields
  const params = {
    value: { ...settingsPayload, locales },
  }

  return params
}
