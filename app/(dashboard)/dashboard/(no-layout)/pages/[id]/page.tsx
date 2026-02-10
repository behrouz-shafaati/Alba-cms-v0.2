import pageCtrl from '@/lib/features/page/controller'
import { notFound } from 'next/navigation'
import { PageForm } from '@/lib/features/page/ui/page-form'
import categoryCtrl from '@/lib/features/category/controller'
import headerCtrl from '@/lib/features/template/controller'
import templateCtrl from '@/lib/features/template/controller'
import { getSettingsAction } from '@/lib/features/settings/actions'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: {
    locale?: string
  }
}
export default async function Page({ params, searchParams }: PageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams
  const resolvedSearchParams = await searchParams

  let page = null,
    allTemplates,
    allCategories,
    allHeaders,
    settings
  let pageBreadCrumb = {
    title: 'افزودن',
    link: '/dashboard/pages/create',
  }
  if (id !== 'create') {
    ;[settings, page, allTemplates, allCategories, allHeaders] =
      await Promise.all([
        getSettingsAction(),
        pageCtrl.findById({ id }),
        templateCtrl.findAll({}),
        categoryCtrl.findAll({}),
        headerCtrl.findAll({}),
      ])

    if (!page) {
      notFound()
    }
    pageBreadCrumb = {
      title: page.title,
      link: `/dashboard/pages/${id}`,
    }
  } else {
    ;[settings, allTemplates, allCategories, allHeaders] = await Promise.all([
      getSettingsAction(),
      pageCtrl.findAll({ filters: { type: 'template' } }),
      categoryCtrl.findAll({}),
      headerCtrl.findAll({}),
    ])
  }

  const localedFallback = settings.language?.siteDefault
  const locale = resolvedSearchParams.locale ?? localedFallback
  console.log('#239845766 searchParams in server page:', resolvedSearchParams)
  console.log('#239845766 locale in server page:', locale)
  return (
    <>
      <PageForm
        key={locale}
        settings={settings}
        initialData={page}
        allTemplates={allTemplates.data}
        allCategories={allCategories.data}
        allHeaders={allHeaders.data}
      />
    </>
  )
}
