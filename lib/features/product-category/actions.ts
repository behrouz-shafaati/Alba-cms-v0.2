'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { Option, Session, FormActionState } from '@/lib/types'
import { ProductCategory, ProductCategoryTranslationSchema } from './interface'
import slugify from '@/lib/utils/slugify'
import createCatrgoryBreadcrumb from '@/lib/utils/createCatrgoryBreadcrumb'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath, unstable_cache } from 'next/cache'
import { User } from '../user/interface'
import { getSession } from '@/lib/auth/get-session'
import stableHash from 'stable-hash'
import authorize from '@/lib/utils/authorize'
import productCategoryCtrl from './controller'

const FormSchema = z.object({
  title: z.string({}).min(1, { message: 'لطفا عنوان را وارد کنید.' }),
  parent: z.string({}).nullable(),
  locale: z.string({}),
  slug: z.string({}),
  description: z.string({}),
  status: z.string({}).min(1, { message: 'لطفا وضعیت را تعیین کنید.' }),
  icon: z.string({}).nullable(),
  image: z.string({}).nullable(),
})

async function sanitizePostData(validatedFields: any, id?: string | undefined) {
  let prevState = { translations: [] }
  if (id) {
    prevState = await productCategoryCtrl.findById({ id })
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
      description: payload.description, // contentJson
    },
    ...prevState.translations.filter(
      (t: ProductCategoryTranslationSchema) => t.locale != payload.locale,
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
 * Creates a category with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the category dashboard.
 */
export async function createProductCategory(
  prevState: FormActionState,
  formData: FormData,
) {
  // Validate form fields
  const rawValues = Object.fromEntries(formData)
  const values = {
    ...rawValues,
    translation: {
      locale: rawValues.locale,
      title: rawValues.title,
      description: rawValues.description,
    },
  }
  try {
    const user = (await getSession())?.user as User
    authorize(user.roles, 'category.create')
    const validatedFields = FormSchema.safeParse(rawValues)
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'لطفا فیلدهای لازم را پر کنید.',
        values,
      }
    }

    const params = await sanitizePostData(validatedFields)
    // Create the category
    await productCategoryCtrl.create({
      params,
    })
    // Revalidate the path and redirect to the category dashboard
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'category',
      slug: '/dashboard/product-categories',
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
    console.log(error)
    return {
      message: ` خطای پایگاه داده: ${error}`,
      values,
    }
  }
  redirect('/dashboard/product-categories')
}

export async function updateProductCategory(
  id: string,
  prevState: FormActionState,
  formData: FormData,
) {
  const user = (await getSession())?.user as User
  const rawValues = Object.fromEntries(formData)
  const values = {
    ...rawValues,
    translation: {
      locale: rawValues.locale,
      title: rawValues.title,
      description: rawValues.description,
    },
  }
  const validatedFields = FormSchema.safeParse(rawValues)

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'لطفا فیلدهای لازم را پر کنید.',
      values,
    }
  }
  try {
    const prevCategory = await productCategoryCtrl.findById({ id })
    authorize(
      user.roles,
      prevCategory.user !== user.id
        ? 'productCategory.edit.any'
        : 'productCategory.edit.own',
    )
    const params = await sanitizePostData(validatedFields, id)
    await productCategoryCtrl.findOneAndUpdate({
      filters: id,
      params,
    })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'category',
      slug: '/dashboard/product-categories',
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
    console.log(error)
    return { message: 'خطای پایگاه داده: بروزرسانی دسته ناموفق بود.', values }
  }
  redirect('/dashboard/product-categories')
}

export async function deleteProductCategorysAction(ids: string[]) {
  try {
    const user = (await getSession())?.user as User
    const prevCategoryResult = await categoryCtrl.findAll({
      filters: { _id: { $in: ids } },
    })
    for (const prevCategory of prevCategoryResult.data) {
      authorize(
        user.roles,
        prevCategory.user !== user.id
          ? 'productCategory.delete.any'
          : 'productCategory.delete.own',
      )
    }
    await categoryCtrl.delete({ filters: ids })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'category',
      slug: '/dashboard/product-categories',
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }
    return {
      success: true,
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
    console.log(error)
    return { message: 'خطای پایگاه داده: حذف دسته ناموفق بود', success: false }
  }
}

export async function getAllProdyctCategories(filters: any = {}) {
  return productCategoryCtrl.findAll({ filters })
}
export async function getAllCategoriesSlimAction({
  payload,
  locale = 'fa',
}: {
  payload?: { filters: any }
  locale?: 'fa'
}) {
  const cacheKy = ['productCategory', stableHash(payload), locale]
  try {
    return await unstable_cache(
      async () => {
        return categoryCtrl.findAllSlim({
          payload: { filters: payload?.filters || {} },
          locale,
        })
      },
      cacheKy,
      {
        tags: ['productCategories'],
      },
    )()
  } catch (error) {
    // fallback امن: اگر cache fail شد
    console.warn(
      '[getAllProductCategoriesSlimAction] unstable_cache failed, fallback to direct call',
      error,
    )
    return productCategoryCtrl.findAllSlim({
      payload: { filters: payload?.filters || {} },
      locale,
    })
  }
}

export async function getProductCategoryAction({ slug }: { slug: string }) {
  const categoryResult = await productCategoryCtrl.find({ filters: { slug } })
  return categoryResult.data[0] || null
}

export async function searchProductCategories(
  query: string,
  locale: string = 'fa',
): Promise<Option[]> {
  const results = await productCategoryCtrl.find({ filters: { query } })

  return results.data.map((cat: ProductCategory) => {
    const translation: ProductCategoryTranslationSchema =
      cat?.translations?.find(
        (t: ProductCategoryTranslationSchema) => t.locale === locale,
      ) ||
      cat?.translations[0] ||
      {}
    return {
      label: createCatrgoryBreadcrumb(cat, translation?.title),
      value: String(cat.id),
    }
  })
}
