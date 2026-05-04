'use server'

import { z } from 'zod'
import templateCtrl from '@/lib/features/template/controller'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/get-session'
import { QueryFind, QueryResult } from '@/lib/features/core/interface'
import { Template } from './interface'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath } from 'next/cache'
import { User } from '../user/interface'
import { FormActionState, Session } from '@/lib/types'
import authorize from '@/lib/utils/authorize'
import { getSettingsAction } from '../settings/actions'
import { PageTranslationSchema } from '../page/interface'

const FormSchema = z.object({
  contentJson: z.string({}),
  locale: z.string({}),
})

/**
 * Creates a Template with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the Template dashboard.
 */
export async function createTemplate(
  prevState: FormActionState,
  formData: FormData,
) {
  let newTemplate = null
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
        rawValues,
      }
    }

    const params = await sanitizeTemplateData(validatedFields)
    // const cleanedParams = await templateCtrl.generateUniqueTemplateSlug(params)
    console.log('#23487s6 cleanedParams:', params)
    // Create the Template
    newTemplate = await templateCtrl.create({
      params: params,
    })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'template',
      slug: [`/dashboard/templates`],
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
    console.log('Error in create template:', error)
    return {
      message: 'خطای پایگاه داده: ایجاد دسته ناموفق بود.',
      success: false,
      values,
    }
  }
  if (newTemplate) {
    // redirect(`/dashboard/templates/${newTemplate.id}`)
    return {
      message: '',
      success: true,
      isCreatedJustNow: true,
      values: newTemplate,
    }
  }
  redirect('/dashboard/templates')
}

export async function updateTemplate(
  id: string,
  prevState: FormActionState,
  formData: FormData,
) {
  let updatedTemplate = {}
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
    const prevTemplate = await templateCtrl.findById({ id })
    authorize(
      user.roles,
      prevTemplate.user !== user.id ? 'template.edit.any' : 'template.edit.own',
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
    const params = await sanitizeTemplateData(validatedFields, id)
    console.log('#23s87s6 updated content:', content)
    // const cleanedParams = await templateCtrl.generateUniqueTemplateSlug(
    //   params,
    //   id,
    // )
    // if is home Template so revalidate home Template
    updatedTemplate = await templateCtrl.findOneAndUpdate({
      filters: id,
      params: params,
    })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'template',
      slug: [`/dashboard/templates`],
    })
    // console.log('098 path need revalidate:', pathes)
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
    console.log('Error in update template:', error)
    return { message: 'خطای پایگاه داده: بروزرسانی دسته ناموفق بود.' }
  }
  return {
    message: 'بروزرسانی با موفقیت انجام شد',
    success: true,
    values: { ...updatedTemplate, translation: { content } },
  }
}

/**
 *
 * @param id template id
 * @param from origin locale content
 * @param to destinition locale
 * @returns void
 */
export async function cloneTemplateAction(
  templateId: string,
  from: string,
  to: string,
) {
  try {
    const user = (await getSession())?.user as User
    const prevTemplate = await templateCtrl.findById({ id: templateId })
    authorize(
      user.roles,
      prevTemplate.user !== user.id ? 'template.edit.any' : 'template.edit.own',
    )

    // let varRevalidatePath = [`/${prevTemplate.slug}`]
    // if is home page so revalidate home page
    // const settings = await settingsCtrl.findOne({
    //   filters: { type: 'site-settings' },
    // })
    // if (settings?.id === pageId) varRevalidatePath = [...varRevalidatePath, '/']

    const originContent = prevTemplate.translations.find(
      (t) => t.locale == from,
    )
    const newTemplate = {
      ...prevTemplate,
      translations: [
        ...prevTemplate.translations.filter((t) => t.locale != to),
        {
          ...originContent,
          locale: to,
        },
      ],
    }
    const updatedTemplate = await templateCtrl.findOneAndUpdate({
      filters: templateId,
      params: newTemplate,
    })

    // const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
    //   feature: 'page',
    //   slug: [...varRevalidatePath, '/dashboard/pages'],
    // })

    // for (const slug of pathes) {
    //   // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
    //   revalidatePath(slug)
    // }
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

export async function deleteTemplatesAction(ids: string[]) {
  try {
    const user = (await getSession())?.user as User
    const prevTemplateResult = await templateCtrl.findAll({
      filters: { _id: { $in: ids } },
    })
    for (const prevTemplate of prevTemplateResult.data) {
      authorize(
        user.roles,
        prevTemplate.user !== user.id
          ? 'template.delete.any'
          : 'template.delete.own',
      )
    }

    await templateCtrl.delete({ filters: ids })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'template',
      slug: [`/dashboard/templates`],
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
      }
    }
    if (process.env.NODE_ENV === 'development') throw error
    console.log('Error in delete template:', error)
    return { message: 'خطای پایگاه داده: حذف دسته ناموفق بود' }
  }
}

export async function getAllTemplates() {
  return templateCtrl.findAll({})
}

async function sanitizeTemplateData(
  validatedFields: any,
  id?: string | undefined,
) {
  let prevState = { translations: [] }

  if (id) {
    prevState = await templateCtrl.findById({ id })
  }

  const session = (await getSession()) as Session

  const user = session.user.id
  // Create the template
  const content = JSON.parse(validatedFields.data.contentJson)
  const locale = validatedFields.data.locale
  const translations = [
    {
      locale,
      title: content.title || '',
      content,
    },
    ...prevState.translations.filter(
      (t: PageTranslationSchema) => t.locale != locale,
    ),
  ]
  const params = {
    content,
    title: content.title,
    type: content.type,
    templateFor: content.templateFor,
    translations,
    status: content.status,
    parent: content.parent == 'none' ? null : content.parent,
    user,
  }
  return params
}

export async function getTemplates(payload: QueryFind): Promise<QueryResult> {
  return templateCtrl.find(payload)
}
export async function getTemplate(templateId: string): Promise<Template> {
  const result = await templateCtrl.find({ filters: { id: templateId } })
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
