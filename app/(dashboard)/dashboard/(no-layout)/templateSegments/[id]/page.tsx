import { notFound } from 'next/navigation'
import { Form } from '@/lib/features/templateSegment/ui/form'
import templateSegmentCtrl from '@/lib/features/templateSegment/controller'
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
  let templateSegment = null,
    settings
  let pageBreadCrumb = {
    title: 'افزودن',
    link: '/dashboard/templateSegments/create',
  }
  if (id !== 'create') {
    ;[settings, templateSegment] = await Promise.all([
      getSettingsAction(),
      templateSegmentCtrl.findById({ id }),
    ])

    if (!templateSegment) {
      notFound()
    }
    pageBreadCrumb = {
      title: templateSegment.id,
      link: `/dashboard/templateSegments/${id}`,
    }
  } else {
    ;[settings] = await Promise.all([getSettingsAction()])
  }

  const localedFallback = settings.language?.siteDefault
  const locale = resolvedSearchParams.locale ?? localedFallback
  console.log('#234987 locale in page:', locale)
  return (
    <>
      <Form key={locale} initialData={templateSegment} settings={settings} />
    </>
  )
}
