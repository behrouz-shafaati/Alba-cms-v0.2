import { BreadCrumb } from '@/components/other/breadcrumb'
import tagCtrl from '@/lib/features/tag/controller'
import { notFound } from 'next/navigation'
import { TagTranslationSchema } from '@/lib/features/tag/interface'
import { User } from '@/lib/features/user/interface'
import { getSession } from '@/lib/auth/get-session'
import { resolveLocale } from '@/lib/i18n/utils/resolve-locale'
import { getDashboardDictionary } from '@/lib/i18n/dashboard'
import { getSettingsAction } from '@/lib/features/settings/actions'
import { TagFormTranslation } from '@/lib/features/tag/ui/tag-form-translation'

interface PageProps {
  params: Promise<{ id: string }>
}
export default async function Page({ params }: PageProps) {
  const user = (await getSession())?.user as User
  const resolvedParams = await params
  const { id } = resolvedParams
  let tag = null,
    settings
  let pageBreadCrumb = null
  if (id !== 'create') {
    ;[tag, settings] = await Promise.all([
      tagCtrl.findById({ id }),
      getSettingsAction(),
    ])

    if (!tag) {
      notFound()
    }

    const locale = user?.locale || settings?.language?.dashboardDefault || ''

    const translation: TagTranslationSchema =
      tag?.translations?.find((t: TagTranslationSchema) => t.lang === locale) ||
      tag?.translations[0] ||
      {}

    pageBreadCrumb = {
      title: translation?.title,
      link: `/dashboard/tags/${id}`,
    }
  } else {
    ;[settings] = await Promise.all([getSettingsAction()])
  }

  const locale = user?.locale || settings?.language?.dashboardDefault || ''
  const resolvedLocale = await resolveLocale({ locale })
  const dictionary = getDashboardDictionary(resolvedLocale)

  if (!pageBreadCrumb)
    pageBreadCrumb = {
      title: dictionary.feature.tag.create,
      link: '/dashboard/tags/create',
    }

  const breadcrumbItems = [
    { title: dictionary.feature.tag.title, link: '/dashboard/tags' },
    pageBreadCrumb,
  ]
  return (
    <>
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <TagFormTranslation
          initialData={tag}
          settings={settings}
          dictionary={dictionary}
        />
      </div>
    </>
  )
}
