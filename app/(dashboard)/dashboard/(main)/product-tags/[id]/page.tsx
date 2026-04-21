import { BreadCrumb } from '@/components/other/breadcrumb'
import productTagCtrl from '@/lib/features/product-tag/controller'
import { notFound } from 'next/navigation'
import { ProductTagTranslationSchema } from '@/lib/features/product-tag/interface'
import { User } from '@/lib/features/user/interface'
import { getSession } from '@/lib/auth/get-session'
import { resolveLocale } from '@/lib/i18n/utils/resolve-locale'
import { getDashboardDictionary } from '@/lib/i18n/dashboard'
import { getSettingsAction } from '@/lib/features/settings/actions'
import { ProductTagFormTranslation } from '@/lib/features/product-tag/ui/tag-form-translation'

interface PageProps {
  params: Promise<{ id: string }>
}
export default async function Page({ params }: PageProps) {
  const user = (await getSession())?.user as User
  const resolvedParams = await params
  const { id } = resolvedParams
  let productTag = null,
    settings
  let pageBreadCrumb = null
  if (id !== 'create') {
    ;[productTag, settings] = await Promise.all([
      productTagCtrl.findById({ id }),
      getSettingsAction(),
    ])

    if (!productTag) {
      notFound()
    }

    const locale = user?.locale || settings?.language?.dashboardDefault || ''

    const translation: ProductTagTranslationSchema =
      productTag?.translations?.find(
        (t: ProductTagTranslationSchema) => t.locale === locale,
      ) ||
      productTag?.translations[0] ||
      {}

    pageBreadCrumb = {
      title: translation?.title,
      link: `/dashboard/product-tags/${id}`,
    }
  } else {
    ;[settings] = await Promise.all([getSettingsAction()])
  }

  const locale = user?.locale || settings?.language?.dashboardDefault || ''
  const resolvedLocale = await resolveLocale({ locale })
  const dictionary = getDashboardDictionary(resolvedLocale)
  if (!pageBreadCrumb)
    pageBreadCrumb = {
      title: dictionary.feature.productTag.create,
      link: '/dashboard/product-tags/create',
    }

  const breadcrumbItems = [
    {
      title: dictionary.feature.productTag.title,
      link: '/dashboard/product-tags',
    },
    pageBreadCrumb,
  ]
  return (
    <>
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <ProductTagFormTranslation
          initialData={productTag}
          settings={settings}
          dictionary={dictionary}
        />
      </div>
    </>
  )
}
