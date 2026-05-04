import { notFound } from 'next/navigation'
import { Form } from '@/lib/features/form/ui/form'
import formCtrl from '@/lib/features/form/controller'
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

  let settings,
    page = null
  let pageBreadCrumb = {
    title: 'افزودن',
    link: '/dashboard/forms/create',
  }
  if (id !== 'create') {
    ;[settings, page] = await Promise.all([
      getSettingsAction(),
      formCtrl.findById({ id }),
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

  const localedFallback = settings.language?.siteDefault
  const locale = resolvedSearchParams.locale ?? localedFallback
  return (
    <>
      <Form key={locale} initialData={page} settings={settings} />
    </>
  )
}
