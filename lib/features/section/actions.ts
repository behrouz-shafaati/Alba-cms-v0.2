'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import templatePartCtrl from '@/lib/features/section/controller'
import { redirect } from 'next/navigation'
import settingsCtrl from '../settings/controller'
import { generateUniqueSectionSlug } from './utils'
import { getSession } from '@/lib/auth/get-session'
import { QueryFind, QueryResult } from '@/lib/features/core/interface'
import { Section } from './interface'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { User } from '../user/interface'
import authorize from '@/lib/utils/authorize'
import { FormActionState, Session } from '@/lib/types'

const FormSchema = z.object({
  contentJson: z.string({}),
})

/**
 * Creates a Section with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the Section dashboard.
 */
export async function createSection(
  prevState: FormActionState,
  formData: FormData,
) {
  let newSection = null
  const values = Object.fromEntries(formData.entries())
  // Validate form fields
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  )
  try {
    const user = (await getSession())?.user as User
    authorize(user.roles, 'template.create')
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'لطفا فیلدهای لازم را پر کنید.',
        success: false,
        values,
      }
    }

    const params = await sanitizeSectionData(validatedFields)
    const cleanedParams = await generateUniqueSectionSlug(params)
    console.log('#234876 params:', params)
    // Create the Section
    newSection = await templatePartCtrl.create({
      params: cleanedParams,
    })

    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'templatePart',
      slug: [
        `/${cleanedParams?.slug || params.slug}`,
        `/dashboard/template-parts`,
      ],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }
  } catch (error: any) {
    if (error.message === 'Forbidden') {
      return {
        success: false,
        status: 403,
        message: 'شما اجازه انجام این کار را ندارید',
        values,
      }
    }
    // Handle database error
    if (error instanceof z.ZodError) {
      return {
        message: 'لطفا فیلدهای لازم را پر کنید.',
        errors: error.flatten().fieldErrors,
        values,
      }
    }
    if (process.env.NODE_ENV === 'development') throw error
    console.log('Error in create template part:', error)
    return {
      message: 'خطای پایگاه داده: ایجاد قطعه قالب ناموفق بود.',
      success: false,
      values,
    }
  }
  if (newSection) {
    // redirect(`/dashboard/template-parts/${newSection.id}`)
    return {
      message: '',
      success: true,
      isCreatedJustNow: true,
      values: newSection,
    }
  }
  redirect('/dashboard/template-parts')
}

export async function updateSection(
  id: string,
  prevState: FormActionState,
  formData: FormData,
) {
  const values = Object.fromEntries(formData.entries())
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  )
  try {
    const user = (await getSession())?.user as User
    const prevSection = await templatePartCtrl.findById({ id })
    authorize(
      user.roles,
      prevSection.user !== user.id ? 'template.edit.any' : 'template.edit.own',
    )
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'لطفا فیلدهای لازم را پر کنید.',
        success: false,
        values,
      }
    }

    const params = await sanitizeSectionData(validatedFields)

    const cleanedParams = await generateUniqueSectionSlug(params, id)
    let varRevalidatePath = [`/${cleanedParams?.slug || params.slug}`]
    // if is home Section so revalidate home Section
    const settings = await settingsCtrl.findOne({
      filters: { type: 'site-settings' },
    })
    if (settings?.id === id) varRevalidatePath = [...varRevalidatePath, '/']
    await templatePartCtrl.findOneAndUpdate({
      filters: id,
      params: cleanedParams,
    })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'templatePart',
      slug: [...varRevalidatePath, `/dashboard/template-parts`],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }
  } catch (error: any) {
    if (error.message === 'Forbidden') {
      return {
        success: false,
        status: 403,
        message: 'شما اجازه انجام این کار را ندارید',
        values,
      }
    }
    if (process.env.NODE_ENV === 'development') throw error
    console.log('Error in update template part:', error)
    return { message: 'خطای پایگاه داده: بروزرسانی قطعه قالب ناموفق بود.' }
  }
}

export async function deleteSectionAction(ids: string[]) {
  try {
    const user = (await getSession())?.user as User
    const prevSectionResult = await templatePartCtrl.findAll({
      filters: { _id: { $in: ids } },
    })
    for (const prevSection of prevSectionResult.data) {
      authorize(
        user.roles,
        prevSection.user !== user.id
          ? 'template.delete.any'
          : 'template.delete.own',
      )
    }

    await templatePartCtrl.delete({ filters: ids })
  } catch (error: any) {
    if (error.message === 'Forbidden') {
      return {
        success: false,
        status: 403,
        message: 'شما اجازه انجام این کار را ندارید',
      }
    }
    if (process.env.NODE_ENV === 'development') throw error
    console.log('Error in delete template part:', error)
    return { message: 'خطای پایگاه داده: حذف قطعه قالب ناموفق بود' }
  }
  const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
    feature: 'templatePart',
    slug: [`/dashboard/template-parts`],
  })

  for (const slug of pathes) {
    // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
    revalidatePath(slug)
  }
}

export async function getAllSections() {
  return templatePartCtrl.findAll({})
}

async function sanitizeSectionData(validatedFields: any) {
  const session = (await getSession()) as Session

  const user = session.user.id
  // Create the post
  const content = JSON.parse(validatedFields.data.contentJson)
  const params = {
    content,
    title: content.title,
    type: content.type,
    templatePartFor: content.templatePartFor,
    slug: content.slug,
    status: content.status,
    user,
  }
  return params
}

export async function getSections(payload: QueryFind): Promise<QueryResult> {
  return templatePartCtrl.find(payload)
}
export async function getSection(templatePartId: string): Promise<Section> {
  const result = await templatePartCtrl.find({
    filters: { id: templatePartId },
  })
  return result.data[0]
}
