'use server'

import { z } from 'zod'
import postCtrl from '@/lib/features/post/controller'
import { redirect } from 'next/navigation'
import { createPostHref } from './utils'
import { getSession } from '@/lib/auth/get-session'
import { Option, Session, FormActionState } from '@/lib/types'
import { QueryFind, QueryResult } from '@/lib/features/core/interface'
import { Post, PostTranslationSchema } from './interface'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { User } from '../user/interface'
import extractExcerptFromContentJson from '@/lib/utils/extractExcerptFromContentJson'
import getTranslation from '@/lib/utils/getTranslation'
import authorize from '@/lib/utils/authorize'
import { getSettingsAction } from '../settings/actions'
import { fa } from 'zod/v4/locales'
import menuCtrl from '../menu/controller'

const FormSchema = z.object({
  title: z.string({}).nullable(),
  seoTitle: z.string({}).nullable(),
  contentJson: z.string({}),
  metaDescription: z.string({}),
  locale: z.string({}),
  status: z.string({}),
  mainCategory: z.string({}).nullable(),
  primaryVideo: z.string({}).nullable(),
  primaryVideoEmbedUrl: z.string({}).nullable(),
  categories: z.string({}),
  slug: z.string({}),
  tags: z.string({}),
  jsonLd: z.string().nullable(),
  image: z.string().nullable(),
})

/**
 * Creates a post with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the post dashboard.
 */
export async function createPost(
  prevState: FormActionState,
  formData: FormData,
) {
  let newPost = null
  const rawValues = Object.fromEntries(formData.entries())
  const settings = await getSettingsAction()
  const LocaleFallback = settings.language?.siteDefault
  const values = {
    ...rawValues,
    translation: {
      locale: rawValues?.locale || LocaleFallback,
      title: rawValues?.title || '',
      contentJson: rawValues.contentJson || '',
    },
  }
  try {
    const user = (await getSession())?.user as User
    authorize(user.roles, 'post.create')
    // Validate form fields

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
    const params = await sanitizePostData(validatedFields)
    if (params.status === 'published') {
      authorize(
        user.roles,
        params.author !== user.id ? 'post.publish.any' : 'post.publish.own',
      )
    }
    const cleanedParams = await postCtrl.generateUniquePostSlug(params)
    // const mainCategory = await categoryCtrl.findById({
    //   id: cleanedParams.mainCategory,
    // })
    newPost = await postCtrl.create({
      params: cleanedParams,
    })
    const post = await postCtrl.findById({ id: newPost.id })
    // Revalidate the path
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'post',
      slug: [createPostHref(post as Post), `/dashboard/posts`],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }

    revalidateTag('posts')
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
        values,
      }
    }
    if (process.env.NODE_ENV === 'development') throw error
    console.log('Error in create post:', error)
    return {
      message: 'خطای پایگاه داده: ایجاد مطلب ناموفق بود.',
      success: false,
      values,
    }
  }
  if (newPost) redirect(encodeURI(`/dashboard/posts/${newPost.id}`))
  else redirect(`/dashboard/posts`)
}

export async function updatePost(
  id: string,
  prevState: FormActionState,
  formData: FormData,
) {
  let updatedPost = {}
  const settings = await getSettingsAction()
  const LocaleFallback = settings.language?.siteDefault
  const rawValues = Object.fromEntries(formData.entries())
  const values = {
    ...rawValues,
    translation: {
      locale: rawValues?.locale || LocaleFallback,
      title: rawValues?.title || '',
      contentJson: rawValues.contentJson || '',
    },
  }
  try {
    const user = (await getSession())?.user as User
    const prevPost = await postCtrl.findById({ id })
    authorize(
      user.roles,
      prevPost.author?.id !== user.id ? 'post.edit.any' : 'post.edit.own',
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
    const params = await sanitizePostData(validatedFields, id)
    if (params.status === 'published') {
      authorize(
        user.roles,
        prevPost.author?.id !== user.id
          ? 'post.publish.any'
          : 'post.publish.own',
      )
    }
    const cleanedParams = await postCtrl.generateUniquePostSlug(params, id)

    updatedPost = await postCtrl.findOneAndUpdate({
      filters: id,
      params: cleanedParams,
    })
    // Revalidate the path
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'post',
      slug: [createPostHref(updatedPost as Post), `/dashboard/posts`],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }
    revalidateTag('posts')
    return { message: 'فایل با موفقیت بروز رسانی شد', success: true, values }
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
    console.log('Error in update post:', error)
    return {
      message: 'خطای پایگاه داده: بروزرسانی مطلب ناموفق بود.',
      success: false,
      values: updatedPost,
    }
  }
}

export async function deletePostsAction(ids: string[]) {
  try {
    const user = (await getSession())?.user as User
    const prevPostResult = await postCtrl.findAll({
      filters: { _id: { $in: ids } },
    })
    for (const prevPost of prevPostResult.data) {
      authorize(
        user.roles,
        prevPost.author?.id !== user.id ? 'post.delete.any' : 'post.delete.own',
      )
    }

    await postCtrl.delete({ filters: ids })
    // revalidate pathes
    let constRticlesPathes = []
    for (const prevPost of prevPostResult.data) {
      constRticlesPathes.push(createPostHref(prevPost as Post))
    }
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'post',
      slug: [...constRticlesPathes, `/dashboard/posts`],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }
    revalidateTag('posts')
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
    console.log('Error in delete post:', error)
    return { message: 'خطای پایگاه داده: حذف مطلب ناموفق بود', success: false }
  }
}

async function sanitizePostData(validatedFields: any, id?: string | undefined) {
  let prevState = { translations: [] }
  if (id) {
    prevState = await postCtrl.findById({ id })
  }
  const session = (await getSession()) as Session
  // Create the post
  const postPayload = validatedFields.data

  // for multi categories select
  // const categoriesArray: Option[] = JSON.parse(postPayload?.categories || '[]')
  const excerpt = extractExcerptFromContentJson(postPayload.contentJson, 25)
  const image = postPayload.image
    ? postPayload.image == ''
      ? null
      : postPayload.image
    : null
  const user = session.user.id
  const contentJson = await postCtrl.setFileData(postPayload.contentJson)
  // CHECK IF TAG DOES'T EXIST CREATE IT
  const tagsArray: Option[] = JSON.parse(postPayload?.tags || '[]')
  // const tags = await tagCtrl.ensureTagsExist(tagsArray)
  const categories = JSON.parse(postPayload?.categories)

  const postType = postPayload.primaryVideoEmbedUrl != '' ? 'video' : 'article'
  const translations = [
    {
      locale: postPayload.locale,
      title: postPayload.title,
      seoTitle:
        postPayload.seoTitle != '' ? postPayload.seoTitle : postPayload.title,
      metaDescription:
        postPayload.metaDescription != ''
          ? postPayload.metaDescription
          : excerpt,
      excerpt,
      contentJson: JSON.stringify(contentJson),
      readingTime: postPayload.readingTime,
      jsonLd: postPayload.jsonLd,
    },
    ...prevState.translations.filter(
      (t: PostTranslationSchema) => t.locale != postPayload.locale,
    ),
  ]
  const mainCategory = postPayload.mainCategory || null
  const categoriesId = categories.map((cat: Option) => cat.value)
  if (mainCategory && !categoriesId.includes(postPayload.mainCategory))
    categoriesId.push(postPayload.mainCategory)
  let params = {
    type: postType,
    ...postPayload,
    translations,
    tags: tagsArray.map((tag: Option) => tag.value),
    categories: categoriesId,
    image,
    mainCategory,
    ...(postPayload.status == 'published' ? { publishedAt: new Date() } : {}),
  }

  // اگر مطلب در حال بروز رسانی نیست نام کاربر و نویسنده ثبت شود
  if (!id || id === undefined) {
    params = { ...params, user, author: user }
  }
  return params
}

export async function getPosts(payload: QueryFind): Promise<QueryResult> {
  const filters: Record<string, any> = { ...(payload.filters ?? {}) }

  if (!Array.isArray(filters.categories) || filters.categories.length === 0) {
    delete filters.categories
  }

  if (!Array.isArray(filters.tags) || filters.tags.length === 0) {
    delete filters.tags
  }

  return postCtrl.find({
    ...payload,
    filters: { ...filters, status: 'published' },
  })
}

export const getSlimPostsForPostListAction = async ({
  payload,
  locale = 'fa',
}: {
  payload: QueryFind
  locale?: string
}): Promise<QueryResult> => {
  const cacheKey = ['posts', locale + JSON.stringify(payload)]

  return unstable_cache(
    async () => {
      const filters: Record<string, any> = { ...(payload.filters ?? {}) }

      if (
        !Array.isArray(filters.categories) ||
        filters.categories.length === 0
      ) {
        delete filters.categories
      }

      if (!Array.isArray(filters.tags) || filters.tags.length === 0) {
        delete filters.tags
      }

      const result = await postCtrl.find({
        ...payload,
        filters: {
          ...filters,
          status: 'published',
        },
      })
      console.log('#23432 locale:', locale)
      const slimResult = {
        ...result,
        data: result.data.map((post: Post) => {
          console.log('#23432 post.translations:', post.translations)
          const postTranslation = getTranslation({
            translations: post.translations,
            locale,
          })
          const imageTranslation = getTranslation({
            translations: post?.image?.translations,
            locale,
          })
          return {
            id: post.id,
            translations: [
              {
                locale,
                title: postTranslation?.title,
                excerpt: postTranslation?.excerpt,
                metaDescription: postTranslation?.metaDescription,
                readingTime: postTranslation?.readingTime,
              },
            ],
            slug: post.slug,
            image: {
              translations: [imageTranslation],
              srcSmall: post?.image?.srcSmall,
              srcMedium: post?.image?.srcMedium,
              srcLarge: post?.image?.srcLarge,
              width: post?.image?.width,
              height: post?.image?.height,
              blurDataURL: post?.image?.blurDataURL,
            },
            createdAt: post.createdAt,
            href: post?.href || '#',
          }
        }),
      }

      // 🔍 DEBUG: ذخیره در فایل
      // try {
      //   const debugDir = path.join(process.cwd(), '.debug')
      //   await fs.mkdir(debugDir, { recursive: true })

      //   const filePath = path.join(debugDir, `posts-${Date.now()}.json`)

      //   const json = JSON.stringify(slimResult, null, 2)

      //   await fs.writeFile(filePath, json, 'utf8')

      //   console.log(
      //     '[getPosts] slimResult size:',
      //     Buffer.byteLength(json, 'utf8'),
      //     'bytes'
      //   )
      // } catch (err) {
      //   console.error('[getPosts] debug write failed', err)
      // }

      return slimResult
    },
    cacheKey,
    {
      tags: ['posts'],
    },
  )()
}

type getPostActionProp = {
  slug: string
  locale: string
}
export async function getPostAction({ locale, slug }: getPostActionProp) {
  slug = decodeURIComponent(slug)
  const postResult = await postCtrl.find({
    filters: { slug, 'translations.locale': locale },
    projection: {
      slug: 1,
      status: 1,
      type: 1,
      publishedAt: 1,
      createdAt: 1,
      updatedAt: 1,
      translations: {
        $filter: {
          input: '$translations',
          as: 't',
          cond: { $eq: ['$$t.locale', locale] },
        },
      },
    },
  })
  console.log('#2349 locale: ', locale, ' # slug: ', slug)
  console.log('#23498734 postResult:', postResult)
  return postResult?.data[0] || null
}
export async function getSlimPostAction({ locale, slug }: getPostActionProp) {
  // 'use cache'
  slug = decodeURIComponent(slug)
  const postResult = await postCtrl.find({
    filters: { slug, 'translations.locale': locale },
    projection: {
      slug: 1,
      status: 1,
      type: 1,
      publishedAt: 1,
      createdAt: 1,
      updatedAt: 1,
      translations: {
        $filter: {
          input: '$translations',
          as: 't',
          cond: { $eq: ['$$t.locale', locale] },
        },
      },
    },
  })
  console.log('#2349 Slim locale: ', locale, ' # slug: ', slug)
  console.log('#23498734 Slim postResult:', postResult)
  return postResult?.data[0] || null
}

type getPostLocalesActionProp = {
  slug: string
}
export async function getPostLocalesAction({ slug }: getPostLocalesActionProp) {
  // 'use cache'
  slug = decodeURIComponent(slug)
  const postResult = await postCtrl.find({
    filters: { slug },
    projection: {
      slug: 1,
      mainCategory: 1,
      user: 0,
      author: 0,
      image: 0,
      categories: 0,
      tags: 0,
      translations: {
        $map: {
          input: '$translations',
          as: 'tr',
          in: {
            title: '$$tr.title',
            locale: '$$tr.locale',
          },
        },
      },
    },
  })
  console.log('#2349 slug: ', slug)
  console.log('#232498734 locales postResult:', postResult)
  if (!postResult?.data[0]) return null
  const { mainCategory, ...post } = postResult?.data[0]
  return post
}

type GetPostNavigationContentActionProp = {
  locale: string
  /**
   * Post slug
   */
  slug: string | null
  /**
   * Post id
   */
  id: string | null
  menuId: string | null
  categories: Array<string>
  usePageCategory: boolean
  tags: Array<string>
}

export type PostNavigationContent = {
  /**
   * Next post
   */
  nex: {
    title: string
    url: string
  } | null
  /**
   * Previous post
   */
  pre: {
    title: string
    url: string
  } | null
}

export async function getPostNavigationContentAction(
  props: GetPostNavigationContentActionProp,
): Promise<PostNavigationContent | null> {
  let {
    locale,
    slug = null,
    id = null,
    menuId = null,
    categories = [],
    usePageCategory = false,
    tags = [],
  } = props
  console.log('#234 getPostNavigationAction props:', props)
  if (!id && !slug)
    return {
      nex: { title: 'Next post', link: '#' },
      pre: { title: 'Previous post', link: '#' },
    }
  slug = decodeURIComponent(slug)
  if (menuId && slug)
    return getNavigationContentFromMenu({ locale, menuId, slug })
  if (usePageCategory)
    return getNavigationFromPostMainCategory({ locale, slug, tags })
  return getNavigationFromCategoriesTags({ locale, slug, categories, tags })
}

type getNavigationContentFromMenuProps = {
  locale: string
  menuId: string
  /**
   * Post slug
   */
  slug: string
}
type MenuItem = {
  label: string
  url: string
  subMenu: MenuItem[]
  _id: { $oid: string }
}
async function getNavigationContentFromMenu({
  locale,
  menuId,
  slug,
}: getNavigationContentFromMenuProps): Promise<PostNavigationContent | null> {
  const query = {
    filters: { id: menuId, 'translations.locale': locale },
    projection: {
      translations: {
        $filter: {
          input: '$translations',
          as: 't',
          cond: { $eq: ['$$t.locale', locale] },
        },
      },
    },
  }
  const menuResult = await menuCtrl.find(query)
  // تبدیل ساختار تو در تو به لیست صاف
  const flatList: { title: string; url: string }[] = []
  function flatten(items: MenuItem[]) {
    for (const item of items) {
      flatList.push({ title: item.label, url: item.url })
      if (item.subMenu && item.subMenu.length > 0) {
        flatten(item.subMenu)
      }
    }
  }

  flatten(menuResult.data[0].translations[0].items)

  // پیدا کردن index پست فعلی
  const currentIndex = flatList.findIndex((item) =>
    item.url.endsWith(`/${slug}`),
  )

  if (currentIndex === -1) {
    return null // پست پیدا نشد
  }

  return {
    nex: currentIndex < flatList.length - 1 ? flatList[currentIndex + 1] : null,
    pre: currentIndex > 0 ? flatList[currentIndex - 1] : null,
  }
}

type getNavigationFromPostMainCategoryProps = {
  locale: string
  /**
   * Post slug
   */
  slug: string
  /**
   * Array of tag ids
   */
  tags: Array<string>
}
async function getNavigationFromPostMainCategory({
  locale,
  slug,
  tags,
}: getNavigationFromPostMainCategoryProps): Promise<PostNavigationContent | null> {
  const postQuery = {
    filters: { slug },
    projection: {
      mainCategory: 1,
      publishedAt: 1,
      user: 0,
      author: 0,
      image: 0,
      categories: 0,
      tags: 0,
    },
  }

  const currentPost = await postCtrl.findOne(postQuery)
  if (!currentPost) return { pre: null, nex: null }
  const mainCategoryId = currentPost?.mainCategory?.id || null

  const baseFilter = {
    status: 'published',
    categories: mainCategoryId,
    ...(tags.length > 0 ? { tags: { $in: tags } } : {}),
    'translations.locale': locale,
  }

  const nextQuery = {
    filters: {
      ...baseFilter,
      publishedAt: { $gt: new Date(currentPost.publishedAt) },
    },
    sort: { publishedAt: 1 },
    projection: {
      slug: 1,
      mainCategory: 0,
      user: 0,
      author: 0,
      image: 0,
      categories: 0,
      tags: 0,
      translations: {
        $map: {
          input: {
            $filter: {
              input: '$translations',
              as: 't',
              cond: { $eq: ['$$t.locale', locale] },
            },
          },
          as: 'tr',
          in: {
            title: '$$tr.title',
          },
        },
      },
    },
  }

  const nextPost = await postCtrl.findOne(nextQuery)

  const prevoiusQuery = {
    ...nextQuery,
    filters: {
      publishedAt: { $lt: new Date(currentPost.publishedAt) },
    },
    sort: { publishedAt: -1 },
  }
  const previousPost = await postCtrl.findOne(prevoiusQuery)

  return {
    nex: nextPost
      ? { title: nextPost.translations[0].title, url: nextPost.href }
      : null,
    pre: previousPost
      ? { title: previousPost.translations[0].title, url: previousPost.href }
      : null,
  }
}
type getNavigationFromCategoriesTagsProps = {
  locale: string
  /**
   * Post slug
   */
  slug: string
  /**
   * Array of category ids
   */
  categories: Array<string>
  /**
   * Array of tag ids
   */
  tags: Array<string>
}
async function getNavigationFromCategoriesTags({
  locale,
  slug,
  categories,
  tags,
}: getNavigationFromCategoriesTagsProps): Promise<PostNavigationContent | null> {
  const postQuery = {
    filters: { slug },
    projection: {
      mainCategory: 1,
      publishedAt: 1,
      createdAt: 1,
      user: 0,
      author: 0,
      image: 0,
      categories: 0,
      tags: 0,
    },
  }

  const currentPost = await postCtrl.findOne(postQuery)
  if (!currentPost) return { pre: null, nex: null }

  const baseFilter = {
    status: 'published',
    ...(categories.length > 0 ? { categories: { $in: categories } } : {}),
    ...(tags.length > 0 ? { tags: { $in: tags } } : {}),
    'translations.locale': locale,
  }

  const nextQuery = {
    filters: {
      ...baseFilter,
      createdAt: { $gt: new Date(currentPost.createdAt) },
    },
    sort: { createdAt: 1 },
    projection: {
      slug: 1,
      createdAt: 1,
      mainCategory: 0,
      user: 0,
      author: 0,
      image: 0,
      categories: 0,
      tags: 0,
      translations: {
        $map: {
          input: {
            $filter: {
              input: '$translations',
              as: 't',
              cond: { $eq: ['$$t.locale', locale] },
            },
          },
          as: 'tr',
          in: {
            title: '$$tr.title',
          },
        },
      },
    },
  }
  const nextPost = await postCtrl.findOne(nextQuery)

  const prevoiusQuery = {
    ...nextQuery,
    filters: {
      ...baseFilter,
      createdAt: { $lt: new Date(currentPost.createdAt) },
    },
    sort: { createdAt: -1 },
    pagination: {
      page: 1,
      perPage: 1,
    },
  }
  const previousPostResult = await postCtrl.find(prevoiusQuery)
  const previousPost = previousPostResult.data[0]

  return {
    nex: nextPost
      ? { title: nextPost.translations[0].title, url: nextPost.href }
      : null,
    pre: previousPost
      ? { title: previousPost.translations[0].title, url: previousPost.href }
      : null,
  }
}
