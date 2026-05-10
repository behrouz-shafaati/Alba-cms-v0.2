'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import templateSegmentCtrl from '@/lib/features/templateSegment/controller'
import { redirect } from 'next/navigation'
import settingsCtrl from '../settings/controller'
import { getSession } from '@/lib/auth/get-session'
import { QueryFind, QueryResult } from '@/lib/features/core/interface'
import { TemplateSegment, TemplateSegmentTranslation } from './interface'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { User } from '../user/interface'
import authorize from '@/lib/utils/authorize'
import { FormActionState, Session } from '@/lib/types'
import { getSettingsAction } from '../settings/actions'

const FormSchema = z.object({
  contentJson: z.string({}),
  locale: z.string({}),
})

/**
 * Creates a TemplateSegment with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the TemplateSegment dashboard.
 */
export async function createTemplateSegment(
  prevState: FormActionState,
  formData: FormData,
) {
  let newTemplateSegment = null
  const rawValues = Object.fromEntries(formData)
  const settings = await getSettingsAction()
  const LocaleFallback = settings.language?.siteDefault
  const content = JSON.parse(rawValues?.contentJson)
  const validateResult = validateInputs(content)
  if (validateResult?.success == false) return validateResult
  const values = {
    ...rawValues,
    title: content?.title || '', // for generate slug
    type: content.type,
    templateFor: content.templateFor,
    status: content.status,
    translation: {
      locale: rawValues?.locale || LocaleFallback,
      title: content?.title || '',
      content,
    },
  }
  try {
    const user = (await getSession())?.user as User
    authorize(user.roles, 'template.create')
    const validatedFields = FormSchema.safeParse(rawValues)
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'لطفا فیلدهای لازم را پر کنید.',
        success: false,
        values,
      }
    }

    const params = await sanitizeTemplateSegmentData(validatedFields)
    console.log('#234876 params:', params)
    // Create the TemplateSegment
    newTemplateSegment = await templateSegmentCtrl.create({
      params,
    })

    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'templateSegment',
      slug: [`/dashboard/templateSegments`],
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
  if (newTemplateSegment) {
    // redirect(`/dashboard/templateSegments/${newTemplateSegment.id}`)
    return {
      message: '',
      success: true,
      isCreatedJustNow: true,
      values: newTemplateSegment,
    }
  }
  redirect('/dashboard/templateSegments')
}

export async function updateTemplateSegment(
  id: string,
  prevState: FormActionState,
  formData: FormData,
) {
  let updatedTemplateSegment = {}
  const rawValues = Object.fromEntries(formData.entries())
  const content = JSON.parse(rawValues?.contentJson)
  const values = {
    ...rawValues,
    title: content?.title || '', // for generate slug
    type: content.type,
    templateFor: content.templateFor,
    slug: content.slug,
    status: content.status,
    translation: {
      locale: rawValues?.locale,
      title: content?.title || '',
      content,
    },
  }
  try {
    const user = (await getSession())?.user as User
    const prevTemplateSegment = await templateSegmentCtrl.findById({ id })
    authorize(
      user.roles,
      prevTemplateSegment.user !== user.id
        ? 'template.edit.any'
        : 'template.edit.own',
    )
    const validatedFields = FormSchema.safeParse(rawValues)
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'لطفا فیلدهای لازم را پر کنید.',
        success: false,
        values,
      }
    }

    const params = await sanitizeTemplateSegmentData(validatedFields, id)
    updatedTemplateSegment = await templateSegmentCtrl.findOneAndUpdate({
      filters: id,
      params,
    })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'templateSegment',
      slug: [`/dashboard/templateSegments`],
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
  return {
    message: 'بروزرسانی با موفقیت انجام شد',
    success: true,
    values: { ...updatedTemplateSegment, translation: { content } },
  }
}

/**
 * @param id template segment id
 * @param from origin locale content
 * @param to destinition locale
 * @returns void
 */
export async function cloneTemplateSegmentAction(
  id: string,
  from: string,
  to: string,
) {
  try {
    const user = (await getSession())?.user as User
    const prevTemplateSegment = await templateSegmentCtrl.findById({ id })
    authorize(
      user.roles,
      prevTemplateSegment.user !== user.id
        ? 'template.edit.any'
        : 'template.edit.own',
    )

    const originContent = prevTemplateSegment.translations.find(
      (t) => t.locale == from,
    )
    const newTemplateSegment = {
      ...prevTemplateSegment,
      translations: [
        ...prevTemplateSegment.translations.filter((t) => t.locale != to),
        {
          ...originContent,
          locale: to,
        },
      ],
    }
    const updatedPage = await templateSegmentCtrl.findOneAndUpdate({
      filters: id,
      params: newTemplateSegment,
    })
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') throw error
    console.log('Error in update page:', error)
    return { message: 'خطای پایگاه داده: بروزرسانی برگه ناموفق بود.' }
  }
  return {
    message: 'بروزرسانی با موفقیت انجام شد',
    success: true,
  }
}

export async function deleteTemplateSegmentAction(ids: string[]) {
  try {
    const user = (await getSession())?.user as User
    const prevTemplateSegmentResult = await templateSegmentCtrl.findAll({
      filters: { _id: { $in: ids } },
    })
    for (const prevTemplateSegment of prevTemplateSegmentResult.data) {
      authorize(
        user.roles,
        prevTemplateSegment.user !== user.id
          ? 'template.delete.any'
          : 'template.delete.own',
      )
    }

    await templateSegmentCtrl.delete({ filters: ids })
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
    feature: 'templateSegment',
    slug: [`/dashboard/templateSegments`],
  })

  for (const slug of pathes) {
    // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
    revalidatePath(slug)
  }
}

export async function getAllTemplateSegments() {
  return templateSegmentCtrl.findAll({})
}

async function sanitizeTemplateSegmentData(
  validatedFields: any,
  id?: string | undefined,
) {
  let prevState = { translations: [] }

  if (id) {
    prevState = await templateSegmentCtrl.findById({ id })
  }

  const session = (await getSession()) as Session

  const user = session.user.id
  // Create the post
  const content = JSON.parse(validatedFields.data.contentJson)
  const locale = validatedFields.data.locale
  const translations = [
    {
      locale,
      title: content.title || '',
      content,
    },
    ...prevState.translations.filter(
      (t: TemplateSegmentTranslation) => t.locale != locale,
    ),
  ]
  const params = {
    content,
    title: content.title,
    type: content.type,
    translations,
    status: content.status,
    user,
  }
  return params
}

export async function getTemplateSegments(
  payload: QueryFind,
): Promise<QueryResult> {
  return templateSegmentCtrl.find(payload)
}
export async function getTemplateSegment(
  templateSegmentId: string,
): Promise<TemplateSegment> {
  const result = await templateSegmentCtrl.find({
    filters: { id: templateSegmentId },
  })
  return result.data[0]
}

function validateInputs(content) {
  if (content?.title == undefined || content?.title == '')
    return {
      success: false,
      message: 'لطفا عنوان را وارد کنید.',
      values: content,
    }
}
