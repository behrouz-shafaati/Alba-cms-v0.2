import { BreadCrumb } from '@/components/other/breadcrumb'
import categoryCtrl from '@/lib/features/category/controller'
import { notFound } from 'next/navigation'
import { CategoryForm } from '@/lib/features/category/ui/category-form'
import { FileTranslationSchema } from '@/lib/features/file/interface'
import { getSession } from '@/lib/auth/get-session'
import { User } from '@/lib/features/user/interface'
import { getSettingsAction } from '@/lib/features/settings/actions'
import { resolveLocale } from '@/lib/i18n/utils/resolve-locale'
import { getDashboardDictionary } from '@/lib/i18n/dashboard'
import { PostCategoryFormTranslation } from '@/lib/features/category/ui/category-form-translation'

interface PageProps {
  params: Promise<{ id: string }>
}
export default async function Page({ params }: PageProps) {
  const user = (await getSession())?.user as User
  const resolvedParams = await params
  const { id } = resolvedParams
  let category = null,
    allCategories,
    settings
  let pageBreadCrumb = null
  if (id !== 'create') {
    ;[category, allCategories, settings] = await Promise.all([
      categoryCtrl.findById({ id }),
      categoryCtrl.findAll({}),
      getSettingsAction(),
    ])

    if (!category) {
      notFound()
    }
    const locale = user?.locale || settings?.language?.dashboardDefault || ''
    const translation: FileTranslationSchema =
      category?.translations?.find(
        (t: FileTranslationSchema) => t.locale === locale,
      ) ||
      category?.translations[0] ||
      {}

    pageBreadCrumb = {
      title: translation?.title,
      link: `/dashboard/categories/${id}`,
    }
  } else {
    ;[allCategories, settings] = await Promise.all([
      categoryCtrl.findAll({}),
      getSettingsAction(),
    ])
  }

  const locale = user?.locale || settings?.language?.dashboardDefault || ''
  const resolvedLocale = await resolveLocale({ locale })
  const dictionary = getDashboardDictionary(resolvedLocale)

  if (!pageBreadCrumb)
    pageBreadCrumb = {
      title: dictionary.feature.category.create,
      link: '/dashboard/categories/create',
    }

  const breadcrumbItems = [
    { title: dictionary.feature.category.title, link: '/dashboard/categories' },
    pageBreadCrumb,
  ]
  return (
    <>
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <PostCategoryFormTranslation
          settings={settings}
          dictionary={dictionary}
          initialData={category}
          allCategories={allCategories.data}
        />
      </div>
    </>
  )
}
