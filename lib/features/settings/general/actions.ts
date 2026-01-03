'use server'

import { z } from 'zod'
import settingsCtrl, { getSettings } from '@/lib/features/settings/controller'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth/get-session'
import { User } from '@/lib/features/user/interface'
import { General } from './interface'
import getTranslation from '@/lib/utils/getTranslation'
import fileCtrl from '@/lib/features/file/controller'
import { FormActionState } from '@/lib/types'
import authorize from '@/lib/utils/authorize'
import { getDashboardDictionary } from '@/lib/i18n/dashboard'

const METADATA_KEY = 'general'

const FormSchema = z.object({
  locale: z.string({}).nullable().optional(),
  favicon: z.string({}).nullable().optional(),
  site_title: z.string({}).nullable().optional(),
  site_introduction: z.string({}).nullable().optional(),
  site_url: z.string({}).nullable().optional(),
  homePageId: z.string({}).nullable().optional(),
  termsPageId: z.string({}).nullable().optional(),
  privacyPageId: z.string({}).nullable().optional(),
  lang: z.string({}).nullable().optional(),
})

/**
 * update settings with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the settings dashboard.
 */

export async function updateGeneralSettings(
  prevState: FormActionState,
  formData: FormData
) {
  const rawValues = Object.fromEntries(formData.entries())
  const t = getDashboardDictionary(rawValues?.locale)
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
      message: t.feature.setting.success,
      values: rawValues,
      success: true,
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
  const lang = validatedFields.lang
  // const session = (await getSession()) as Session
  // Create the settings
  const settings: General = (await getSettings({
    key: METADATA_KEY,
  })) as General
  const settingsPayload = validatedFields
  // public
  const generalTranslation = getTranslation({
    translations: settings?.translations || [],
    lang,
  })
  const generalTranslations = [
    ...((settings?.translations || []).filter((t) => t?.lang !== lang) || []),
    {
      lang,
      site_title:
        settingsPayload?.site_title || generalTranslation?.site_title || '',
      site_introduction:
        settingsPayload?.site_introduction ||
        generalTranslation?.site_introduction ||
        '',
    },
  ]

  const file = await fileCtrl.findById({ id: settingsPayload?.favicon })
  const params = {
    value: {
      translations: generalTranslations,
      site_url: settingsPayload?.site_url,
      favicon: settingsPayload?.favicon,
      homePageId: settingsPayload?.homePageId || null,
      termsPageId: settingsPayload?.termsPageId || null,
      privacyPageId: settingsPayload?.privacyPageId || null,
      faviconDetails: {
        id: file?.id,
        srcSmall: file?.srcSmall,
        srcMedium: file?.srcMedium,
        width: file?.width,
        height: file?.height,
      },
    },
  }

  return params
}
