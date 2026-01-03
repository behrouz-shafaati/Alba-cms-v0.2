'use server'
import userCtrl from '@/lib/features/user/controller'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath } from 'next/cache'
import createConfigSuperAdminSchema from './schema'
import z from 'zod'
import { getDictionary } from '@/lib/i18n'
import { writeConfigAction } from '../../action'

export default async function configSuperAdminAction(
  prevState: any,
  formData: FormData
) {
  let newUser = null
  const rawValues = Object.fromEntries(formData)
  const locale = formData.get('locale')?.toString() || 'en'
  const t = getDictionary(locale)
  const FormSchema = createConfigSuperAdminSchema(locale)
  // Validate form fields
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

  if (validatedFields.data.password !== validatedFields.data.confirmPassword) {
    return {
      values: rawValues,
      message: t.user.confirmPassword.dontEqual_error,
      success: false,
    }
  }
  try {
    // Parse the roles field from a string to an array
    validatedFields.data = {
      ...validatedFields.data,
    }

    const cleanedUserData = {
      ...validatedFields.data,
      image: null,
      roles: ['super_admin'],

      mobileVerified: true,
      emailVerified: true,
      userName: await userCtrl.generateUniqueUsername(),
    }

    console.log('#234324 cleanedUserData:', cleanedUserData)
    newUser = await userCtrl.create({ params: cleanedUserData })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'user',
      slug: [`/dashboard/users`],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }
    await writeConfigAction({ admin: { email: newUser.email } })
    return {
      values: rawValues,
      message: t.user.createSuccessful,
      success: true,
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
