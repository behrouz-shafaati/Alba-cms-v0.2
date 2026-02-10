import { PageRenderer } from '@/components/builder-canvas/pageRenderer'
import pageCtrl from '@/lib/features/page/controller'
import { notFound } from 'next/navigation'

type Props = {
  pageSlug: string
  locale: string
}
export default async function Page({ locale, pageSlug }: Props) {
  const pageResult = await pageCtrl.find({
    filters: { slug: pageSlug, 'translations.locale': locale },
    projection: {
      translations: {
        $filter: {
          input: '$translations',
          as: 't',
          cond: { $eq: ['$$t.locale', locale] },
        },
      },
    },
  })

  if (pageResult?.data.length == 0) {
    notFound()
  }

  // this is a page
  if (pageResult?.data[0])
    return (
      <PageRenderer
        page={pageResult?.data[0]}
        locale={locale}
        pageSlug={pageSlug || ''}
      />
    )
}
