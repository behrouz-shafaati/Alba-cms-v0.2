import { PageRenderer } from '@/components/builder-canvas/pageRenderer'
import pageCtrl from '@/lib/features/page/controller'
import { notFound } from 'next/navigation'
import PostPage from './post'

type Props = {
  slugs: string[]
  pageSlug: string
  locale: string
}
export default async function PageOrPost({ locale, pageSlug, slugs }: Props) {
  let isPost = false,
    isPage = false,
    pageResult,
    postResult

  if (slugs.length > 1) isPost = true
  else isPage = true

  if (isPage) {
    pageResult = await pageCtrl.find({
      filters: { slug: pageSlug, 'translations.locale': locale },
      projection: {
        translations: {
          $filter: {
            input: '$translations',
            as: 't',
            cond: { $eq: ['$$t.locale', locale] },
          },
        },
      } as any,
    })
    if (pageResult?.data.length == 0) {
      notFound()
    }

    // this is a page
    if (pageResult?.data[0])
      return <PageRenderer page={pageResult?.data[0]} locale={locale} />
  }

  if (isPost) {
    return <PostPage locale={locale} postSlug={pageSlug} slugs={slugs} />
  }
}
