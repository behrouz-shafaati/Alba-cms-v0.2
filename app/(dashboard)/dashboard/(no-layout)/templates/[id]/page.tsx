import templateCtrl from '@/lib/features/template/controller'
import { notFound } from 'next/navigation'
import { Form } from '@/lib/features/template/ui/form'
import categoryCtrl from '@/lib/features/category/controller'
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
    settings
  let pageBreadCrumb = {
    title: 'افزودن',
    link: '/dashboard/templates/create',
  }

  if (id !== 'create') {
    ;[settings, page, allTemplates, allCategories] = await Promise.all([
      getSettingsAction(),
      templateCtrl.findById({ id }),
      templateCtrl.findAll({}),
      categoryCtrl.findAll({}),
    ])
    if (!page) {
      notFound()
    }
    pageBreadCrumb = {
      title: page.title,
      link: `/dashboard/templates/${id}`,
    }
  } else {
    ;[settings, allTemplates, allCategories] = await Promise.all([
      getSettingsAction(),
      templateCtrl.findAll({}),
      categoryCtrl.findAll({}),
    ])
  }

  const localedFallback = settings.language?.siteDefault
  const locale = resolvedSearchParams.locale ?? localedFallback
  console.log('#2866 locale in server page:', locale)
  return (
    <>
      <Form
        key={locale}
        settings={settings}
        initialData={page}
        allCategories={allCategories.data}
        allTemplates={allTemplates.data}
      />
    </>
  )
}
