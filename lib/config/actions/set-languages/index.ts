'use server'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath } from 'next/cache'
import z from 'zod'
import { getInstallDictionary } from '@/lib/i18n/install'
import generateLanguagesSchema from './schema'
import { getSettingsAction } from '@/lib/features/settings/actions'
import { Language } from '@/lib/features/settings/locales/interface'
import settingsCtrl from '@/lib/features/settings/controller'
import { writeConfigAction } from '../../action'
import { generateAndSaveJwtSecret } from '../../generateAndSaveJwtSecret'
import seedData from '@/lib/seed/seed'

const METADATA_KEY = 'language'

export default async function installLanguagesAction(
  prevState: any,
  formData: FormData
) {
  const rawValues = Object.fromEntries(formData)
  const locale = formData.get('locale')?.toString() || 'en'
  const t = getInstallDictionary(locale)
  const FormSchema = generateLanguagesSchema(locale)
  // Validate form fields
  console.log('#234897 rawValues:', rawValues)
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      values: rawValues,
      errors: validatedFields.error.flatten().fieldErrors,
      message: t.shared.fillForm,
      success: false,
    }
  }

  try {
    console.log('#234897 validatedFields:', validatedFields)
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
    await writeConfigAction({
      language: { siteDefault: params.value.siteDefault },
    })
    await seedData()
    await generateAndSaveJwtSecret()
    return {
      message: t.languages.success,
      success: true,
      values: rawValues,
    }
  } catch (error) {
    console.log('#---65 signup error:', error)
    // Handle database error
    if (error instanceof z.ZodError) {
      return {
        values: rawValues,
        errors: error.flatten().fieldErrors,
      }
    }
    return {
      values: rawValues,
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
