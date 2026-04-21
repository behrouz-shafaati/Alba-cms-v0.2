'use server'

import { z } from 'zod'
import productTagCtrl from './controller'
import { redirect } from 'next/navigation'
import { Option, Session, FormActionState } from '@/lib/types'
import { ProductTag, ProductTagTranslationSchema } from './interface'
import { getSession } from '@/lib/auth/get-session'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath, unstable_cache } from 'next/cache'
import { User } from '../user/interface'
import slugify from '@/lib/utils/slugify'
import stableHash from 'stable-hash'
import authorize from '@/lib/utils/authorize'

const FormSchema = z.object({
  title: z.string({}).min(1, { message: 'لطفا عنوان را وارد کنید.' }),
  slug: z.string({}).nullable(),
  locale: z.string({}).nullable(),
  description: z.string({}),
  status: z.string({}).min(1, { message: 'لطفا وضعیت را تعیین کنید.' }),
  image: z.string({}).nullable(),
  icon: z.string({}).nullable(),
})

async function sanitizePostData(validatedFields: any, id?: string | undefined) {
  let prevState = { translations: [] }
  if (id) {
    prevState = await productTagCtrl.findById({ id })
    console.log('#prevState 098776 :', prevState)
  }
  const session = (await getSession()) as Session
  const payload = validatedFields.data
  const user = session.user.id
  const slug = payload.slug !== '' ? payload.slug : slugify(payload.title)
  const translations = [
    {
      locale: payload.locale,
      title: payload.title,
      description: payload.description,
    },
    ...prevState.translations.filter(
      (t: ProductTagTranslationSchema) => t.locale != payload.locale,
    ),
  ]
  const params = {
    ...payload,
    translations,
    user,
    slug,
  }

  return params
}

/**
 * Creates a productTag with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the productTag dashboard.
 */
export async function createProductTag(
  prevState: FormActionState,
  formData: FormData,
) {
  const rawValues = Object.fromEntries(formData)
  const values = {
    ...rawValues,
    translation: {
      locale: rawValues?.locale,
      title: rawValues?.title,
      description: rawValues?.description,
    },
  }
  // Validate form fields
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  )
  try {
    const user = (await getSession())?.user as User
    authorize(user.roles, 'productTag.create')
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'لطفا فیلدهای لازم را پر کنید.',
        values,
      }
    }

    const params = await sanitizePostData(validatedFields)
    // Create the productTag
    await productTagCtrl.create({ params })
    // Revalidate the path
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'productTag',
      slug: [`/dashboard/product-tags`],
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
        errors: error.flatten().fieldErrors,
      }
    }
    if (process.env.NODE_ENV === 'development') throw error
    console.log('!2345:', error)
    return {
      message: 'خطای پایگاه داده: ایجاد برچسب ناموفق بود.',
      values,
    }
  }
  redirect('/dashboard/product-tags')
}

export async function updateProductTag(
  id: string,
  prevState: FormActionState,
  formData: FormData,
) {
  const rawValues = Object.fromEntries(formData)
  const values = {
    ...rawValues,
    translation: {
      locale: rawValues?.locale,
      title: rawValues?.title,
      description: rawValues?.description,
    },
  }

  const validatedFields = FormSchema.safeParse(rawValues)

  try {
    const user = (await getSession())?.user as User
    const prevProductTag = await productTagCtrl.findById({ id })
    authorize(
      user.roles,
      prevProductTag?.user.id !== user.id
        ? 'productTag.edit.any'
        : 'productTag.edit.own',
    )
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'لطفا فیلدهای لازم را پر کنید.',
        values,
      }
    }
    const params = await sanitizePostData(validatedFields, id)

    const updateResult = await productTagCtrl.findOneAndUpdate({
      filters: id,
      params: params,
    })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'productTag',
      slug: [`/dashboard/product-tags`],
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
    console.log('!2345 Error in update productTag:', error)
    return { message: 'خطای پایگاه داده: بروزرسانی برچسب ناموفق بود.', values }
  }
  redirect('/dashboard/product-tags')
}

export async function deleteProductTagsAction(ids: string[]) {
  try {
    const user = (await getSession())?.user as User
    const prevProductTagResult = await productTagCtrl.findAll({
      filters: { _id: { $in: ids } },
    })
    for (const prevProductTag of prevProductTagResult.data) {
      authorize(
        user.roles,
        prevProductTag?.user.id !== user.id
          ? 'productTag.delete.any'
          : 'productTag.delete.own',
      )
    }

    await productTagCtrl.delete({ filters: ids })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'productTag',
      slug: [`/dashboard/product-tags`],
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
    console.log('!2348 Error in delete productTag:', error)
    return { message: 'خطای پایگاه داده: حذف برچسب ناموفق بود' }
  }
}

export async function getAllProductTags(filters: any = {}) {
  return productTagCtrl.findAll({ filters })
}

export async function getAllTagsSlimAction({
  payload,
  locale = 'fa',
}: {
  payload?: { filters: any }
  locale?: 'fa'
}) {
  const cacheKy = ['productTag', stableHash(payload), locale]
  try {
    return await unstable_cache(
      async () => {
        return productTagCtrl.findAllSlim({
          payload: { filters: payload?.filters || {} },
          locale,
        })
      },
      cacheKy,
      {
        productTags: ['productTags'],
      },
    )()
  } catch (error) {
    // fallback امن: اگر cache fail شد
    console.warn(
      '[getAllTagsSlimAction] unstable_cache failed, fallback to direct call',
      error,
    )
    return productTagCtrl.findAllSlim({
      payload: { filters: payload?.filters || {} },
      locale,
    })
  }
}

export async function getProductTagAction({ slug }: { slug: string }) {
  const productTagResult = await productTagCtrl.find({ filters: { slug } })
  return productTagResult.data[0] || null
}

export async function searchProductTags(
  query: string,
  locale: string = 'fa',
): Promise<Option[]> {
  const results = await productTagCtrl.find({ filters: { query } })

  return results.data.map((productTag: ProductTag) => {
    const translation: any =
      productTag?.translations?.find((t: any) => t.locale === locale) ||
      productTag?.translations[0] ||
      {}
    return {
      label: translation?.title,
      value: String(productTag.id),
    }
  })
}
