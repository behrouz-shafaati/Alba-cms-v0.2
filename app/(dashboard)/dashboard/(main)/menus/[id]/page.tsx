import { BreadCrumb } from '@/components/other/breadcrumb'
import menuCtrl from '@/lib/features/menu/controller'
import { notFound } from 'next/navigation'
import { MenuTranslationSchema } from '@/lib/features/menu/interface'
import { getSettingsAction } from '@/lib/features/settings/actions'
import { MenuFormTranslation } from '@/lib/features/menu/ui/menu-form-translation'
import { User } from '@/lib/features/user/interface'
import { getSession } from '@/lib/auth/get-session'
import { resolveLocale } from '@/lib/i18n/utils/resolve-locale'

interface PageProps {
  params: Promise<{ id: string }>
}
export default async function Page({ params }: PageProps) {
  const user = (await getSession())?.user as User
  const resolvedParams = await params
  const { id } = resolvedParams
  const { resolvedLocale: locale, dictionary } = await resolveLocale({ user })
  let menu = null
  let pageBreadCrumb = {
    title: dictionary.feature.menu.create,
    link: '/dashboard/menus/create',
  }
  if (id !== 'create') {
    ;[menu] = await Promise.all([menuCtrl.findById({ id })])

    if (!menu) {
      notFound()
    }
    const translation: MenuTranslationSchema =
      menu?.translations?.find(
        (t: MenuTranslationSchema) => t.lang === locale,
      ) ||
      menu?.translations[0] ||
      {}
    pageBreadCrumb = {
      title: translation?.title,
      link: `/dashboard/menus/${id}`,
    }
  }

  const [settings] = await Promise.all([getSettingsAction()])

  const breadcrumbItems = [
    { title: dictionary.feature.menu.title, link: '/dashboard/menus' },
    pageBreadCrumb,
  ]
  return (
    <>
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <MenuFormTranslation initialData={menu} settings={settings} />
      </div>
    </>
  )
}
