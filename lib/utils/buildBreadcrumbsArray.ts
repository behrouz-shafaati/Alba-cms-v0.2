import { createPostHref } from '../features/post/utils'

/**
 * ساخت breadcrumb برای مطلب به صورت بازگشتی
 * @param post مطلب‌ای که باید breadcrumb برایش ساخته شود
 * @param lang زبان انتخابی برای نمایش عنوان‌ها (پیش‌فرض: fa)
 */
export function buildBreadcrumbsArray(post: any, lang: string = 'fa') {
  /**
   * تابع بازگشتی برای جمع‌آوری سلسله‌مراتب دسته‌ها
   */
  function collectCategories(
    category?: any | null,
  ): { title: string; link: string }[] {
    if (!category) return []

    const parentBreadcrumbs = collectCategories(category.parent)
    const title =
      category.translations?.find((t: any) => t.lang === lang)?.title ||
      category.slug
    const link = `/archive/categories/${category.slug}`

    return [...parentBreadcrumbs, { title, link }]
  }

  /**
   * انتخاب mainCategory (در اولویت)، در صورت نبود، اولین دسته از categories
   */
  const baseCategory = post.mainCategory || post.categories?.[0] || null
  const breadcrumbs = baseCategory ? collectCategories(baseCategory) : []

  // افزودن خود مطلب به انتها
  const postTitle =
    post.translations?.find((t: any) => t.lang === lang)?.title || post.slug

  breadcrumbs.push({
    title: postTitle,
    link: createPostHref(post),
  })

  return breadcrumbs
}
