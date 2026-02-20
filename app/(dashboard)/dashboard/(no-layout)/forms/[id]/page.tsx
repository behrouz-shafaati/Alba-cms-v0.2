import { notFound } from 'next/navigation'
import { Form } from '@/lib/features/form/ui/form'
import templatePartCtrl from '@/lib/features/form/controller'
import { getSettingsAction } from '@/lib/features/settings/actions'

interface PageProps {
  params: Promise<{ id: string }>
}
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams
  let settings,
    page = null
  let pageBreadCrumb = {
    title: 'افزودن',
    link: '/dashboard/forms/create',
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
      link: `/dashboard/forms/${id}`,
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
