import { getSlimPostsForPostListAction } from '@/lib/features/post/actions'
import {
  getAllCategories,
  getAllCategoriesSlimAction,
} from '@/lib/features/category/actions'
import { DesktopFilters } from './DesktopFilters'
import { getAllTags, getAllTagsSlimAction } from '@/lib/features/tag/actions'
import { Option } from '@/lib/types'
import PostHorizontalCard from '../builder-canvas/shared-blocks/postList/designs/card/ArticalHorizontalCard'
import { MobileFilters } from './MobileFilters'
import ActiveFilters from './ActiveFilters'
import { getSettingsAction } from '@/lib/features/settings/actions'
import getTranslation from '@/lib/utils/getTranslation'
import Pagination from '../other/ui/pagination'

export default async function ArchivePost({
  locale,
  page = 1,
  perPage = 6,
  filters = {},
}: {
  locale: string
  filters?: { categories: string[]; tags: string[] }
  page?: number
  perPage?: number
}) {
  console.log('#23e4 filters:', filters)
  let categoryIds = []
  let tagIds = []
  let defaultSelectedCategories: Option[] = []
  let defaultSelectedTags: Option[] = []
  if (filters?.categories?.length || filters?.tags?.length) {
    const [defaultCategoriesResult, defaultTagsResult] = await Promise.all([
      getAllCategories({ slug: { $in: filters?.categories } }),
      getAllTags({ slug: { $in: filters?.tags } }),
    ])
    categoryIds = defaultCategoriesResult.data.map((cat: any) => cat.id)
    tagIds = defaultTagsResult.data.map((tag: any) => tag.id)

    defaultSelectedCategories = defaultCategoriesResult.data.map(
      (cat: any) => ({
        label: getTranslation({ translations: cat.translations, locale })
          ?.title,
        value: String(cat.slug),
      }),
    )
    defaultSelectedTags = defaultTagsResult.data.map((tag: any) => ({
      label: getTranslation({ translations: tag.translations, locale })?.title,
      value: String(tag.slug),
    }))
  }
  const [siteSettings, postResult, allCategories, allTags] = await Promise.all([
    getSettingsAction(),
    getSlimPostsForPostListAction({
      payload: {
        filters: { categories: categoryIds, tags: tagIds },
        pagination: { page, perPage },
      },
      locale,
    }),
    getAllCategoriesSlimAction({ locale }),
    getAllTagsSlimAction({ locale }),
  ])
  const posts = postResult.data
  const postItems = posts.map((post) => {
    return (
      <PostHorizontalCard
        key={post.id}
        post={post}
        options={{ showExcerpt: true }}
      />
    )
  })

  console.log('#234876 defaultSelectedCategories:', defaultSelectedCategories)
  console.log('#234876 defaultSelectedTags:', defaultSelectedTags)

  return (
    <div className="grid grid-cols-4 gap-4 relative">
      <div
        className={`block  px-4 py-2  md:hidden col-span-4 bg-slate-50 dark:bg-slate-950 z-10 sticky`}
        style={{ top: `${siteSettings?.appearance?.mobileHeaderHeight}px` }}
      >
        <MobileFilters
          locale={locale}
          allCategories={allCategories}
          allTags={allTags}
          defaultSelectedCategories={defaultSelectedCategories}
          defaultSelectedTags={defaultSelectedTags}
        />
      </div>
      <div className="hidden md:block">
        <DesktopFilters
          locale={locale}
          siteSettings={siteSettings}
          allCategories={allCategories}
          allTags={allTags}
          defaultSelectedCategories={defaultSelectedCategories}
          defaultSelectedTags={defaultSelectedTags}
        />
      </div>
      <div className="p-2 col-span-4 md:col-span-3 ">
        <div className="block md:hidden">
          {' '}
          <ActiveFilters
            locale={locale}
            initial={{
              tags: defaultSelectedTags,
              categories: defaultSelectedCategories,
            }}
          />
        </div>
        <div>{postItems}</div>
        <div className="p-4 flex justify-center items-center">
          <Pagination totalPages={postResult.totalPages} />
        </div>
      </div>
    </div>
  )
}
