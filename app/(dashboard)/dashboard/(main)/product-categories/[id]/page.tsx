import { BreadCrumb } from '@/components/other/breadcrumb'
import { notFound } from 'next/navigation'
import { FileTranslationSchema } from '@/lib/features/file/interface'
import productCategoryCtrl from '@/lib/features/product-category/controller'
import { getSettingsAction } from '@/lib/features/settings/actions'
import { ProductCategoryFormTranslation } from '@/lib/features/product-category/ui/category-form-translation'
import { getSession } from '@/lib/auth/get-session'
import { User } from '@/lib/features/user/interface'
import { resolveLocale } from '@/lib/i18n/utils/resolve-locale'
import { getDashboardDictionary } from '@/lib/i18n/dashboard'

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
      productCategoryCtrl.findById({ id }),
      productCategoryCtrl.findAll({}),
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
      link: `/dashboard/product-categories/${id}`,
    }
  } else {
    ;[allCategories, settings] = await Promise.all([
      productCategoryCtrl.findAll({}),
      getSettingsAction(),
    ])
  }

  const locale = user?.locale || settings?.language?.dashboardDefault || ''
  const resolvedLocale = await resolveLocale({ locale })
  const dictionary = getDashboardDictionary(resolvedLocale)

  if (!pageBreadCrumb)
    pageBreadCrumb = {
      title: dictionary.feature.productCategory.create,
      link: '/dashboard/categories/create',
    }

  const breadcrumbItems = [
    {
      title: dictionary.feature.productCategory.title,
      link: '/dashboard/product-categories',
    },
  ]
  return (
    <>
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <ProductCategoryFormTranslation
          settings={settings}
          initialData={category}
          allCategories={allCategories.data}
          dictionary={dictionary}
        />
      </div>
    </>
  )
}
