import { notFound } from 'next/navigation'
import { Form } from '@/lib/features/section/ui/form'
import templatePartCtrl from '@/lib/features/section/controller'
import { getSettingsAction } from '@/lib/features/settings/actions'

interface PageProps {
  params: Promise<{ id: string }>
}
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams
  let page = null,
    settings,
    allTemplates,
    allCategories
  let pageBreadCrumb = {
    title: 'افزودن',
    link: '/dashboard/templates/create',
  }
  if (id !== 'create') {
    ;[settings, page] = await Promise.all([
      getSettingsAction(),
      templatePartCtrl.findById({ id }),
    ])

    if (!page) {
      notFound()
    }
    pageBreadCrumb = {
      title: page.title,
      link: `/dashboard/templates/${id}`,
    }
  } else {
    ;[settings] = await Promise.all([getSettingsAction()])
  }
  return (
    <>
      <Form initialData={page} settings={settings} />
    </>
  )
}
