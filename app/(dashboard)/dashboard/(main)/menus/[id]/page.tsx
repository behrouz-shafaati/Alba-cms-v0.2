import { BreadCrumb } from '@/components/other/breadcrumb'
import menuCtrl from '@/lib/features/menu/controller'
import { notFound } from 'next/navigation'
import { MenuTranslationSchema } from '@/lib/features/menu/interface'
import { getSettingsAction } from '@/lib/features/settings/actions'
import { MenuFormTranslation } from '@/lib/features/menu/ui/menu-form-translation'

interface PageProps {
  params: Promise<{ id: string }>
}
export default async function Page({ params }: PageProps) {
  const locale = 'fa'
  const resolvedParams = await params
  const { id } = resolvedParams

  let menu = null
  let pageBreadCrumb = {
    title: 'افزودن',
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
    { title: 'دسته ها', link: '/dashboard/menus' },
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
