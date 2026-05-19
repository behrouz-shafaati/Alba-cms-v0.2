import postCtrl from '@/lib/features/post/controller'
import { notFound } from 'next/navigation'
import { BreadCrumb } from '@/components/other/breadcrumb'
import categoryCtrl from '@/lib/features/category/controller'
import { PostTranslationSchema } from '@/lib/features/post/interface'
import { getSettingsAction } from '@/lib/features/settings/actions'
import { PostFormTranslation } from '@/lib/features/post/ui/post-form-translation'
import { User } from '@/lib/features/user/interface'
import { getSession } from '@/lib/auth/get-session'
import { resolveLocale } from '@/lib/i18n/utils/resolve-locale'
import getTranslation from '@/lib/utils/getTranslation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const user = (await getSession())?.user as User
  const resolvedParams = await params
  const { id } = resolvedParams
  let post = null,
    pageBreadCrumb = null
  const [settings, allCategories] = await Promise.all([
    getSettingsAction(),
    categoryCtrl.findAll({}),
  ])
  const { resolvedLocale: locale, dictionary } = await resolveLocale({ user })
  if (id !== 'create') {
    ;[post] = await Promise.all([postCtrl.findById({ id })])

    if (!post) {
      notFound()
    }
    const translation: PostTranslationSchema = getTranslation({
      translations: post?.translations,
      locale,
    })

    pageBreadCrumb = {
      title: translation?.title,
      link: `/dashboard/posts/${id}`,
    }
  }

  if (!pageBreadCrumb)
    pageBreadCrumb = {
      title: dictionary.feature.post.create,
      link: '/dashboard/posts/create',
    }
  const breadcrumbItems = [
    { title: dictionary.feature.post.title, link: '/dashboard/posts' },
    pageBreadCrumb,
  ]
  return (
    <>
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <PostFormTranslation
          initialData={post}
          allCategories={allCategories.data}
          settings={settings}
        />
      </div>
    </>
  )
}
