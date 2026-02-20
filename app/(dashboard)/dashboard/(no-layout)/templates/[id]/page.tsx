import templateCtrl from '@/lib/features/template/controller'
import { notFound } from 'next/navigation'
import { Form } from '@/lib/features/template/ui/form'
import categoryCtrl from '@/lib/features/category/controller'
import { getSettingsAction } from '@/lib/features/settings/actions'

interface PageProps {
  params: Promise<{ id: string }>
}
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams
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

  return (
    <>
      <Form
        settings={settings}
        initialData={page}
        allCategories={allCategories.data}
        allTemplates={allTemplates.data}
      />
    </>
  )
}
