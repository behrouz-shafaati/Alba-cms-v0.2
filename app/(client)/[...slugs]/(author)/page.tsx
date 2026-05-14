import { notFound } from 'next/navigation'
import userCtrl from '@/lib/features/user/controller'
import { getSettings } from '@/lib/features/settings/controller'
import templateCtrl from '@/lib/features/template/controller'
import RendererRows from '@/components/builder-canvas/pageRenderer/RenderRows'
import { getSlimPostsForPostListAction } from '@/lib/features/post/actions'
import getTranslation from '@/lib/utils/getTranslation'
import DefaultAuthorPage from '@/lib/features/post/ui/page/author'

interface PageProps {
  locale: string
  userName: string
  searchParams: Promise<{
    query?: string
    page?: string
  }>
}
export default async function AuthorPage({
  locale,
  userName,
  searchParams,
}: PageProps) {
  const resolvedSearchParams = (await searchParams) ?? {}
  const { query = '', page = '1' } = resolvedSearchParams

  const [user] = await Promise.all([
    userCtrl.findOne({ filters: { userName: userName } }),
  ])
  console.log('$233409237480 user:', user)
  if (!user) {
    notFound()
  }

  const [siteSettings, template, postResult] = await Promise.all([
    getSettings(),
    templateCtrl.getTemplate({ slug: 'author', locale }),
    getSlimPostsForPostListAction({
      payload: {
        filters: { author: user.id },
        pagination: { page: Number(page), perPage: 6 },
      },
      locale,
    }),
  ])

  console.log('dsfdf sdfpostResult', postResult)
  if (template) {
    const templateTranslation = getTranslation({
      translations: template.translations,
      locale,
    })
    return (
      <>
        <RendererRows
          siteSettings={siteSettings}
          rows={templateTranslation.content.rows}
          editroMode={false}
          content_all={<AuthorPage user={user} postResult={postResult} />}
        />
      </>
    )
  }
  return (
    <DefaultAuthorPage user={user} postResult={postResult} locale={locale} />
  )
}
