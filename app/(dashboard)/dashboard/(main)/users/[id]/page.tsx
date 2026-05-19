import { UserForm } from '@/lib/features/user/ui/user-form'
import { BreadCrumb } from '@/components/other/breadcrumb'
import userCtrl from '@/lib/features/user/controller'
import { notFound } from 'next/navigation'
import { getSession } from '@/lib/auth/get-session'
import { User } from '@/lib/features/user/interface'
import { resolveLocale } from '@/lib/i18n/utils/resolve-locale'
import { UserFormTranslation } from '@/lib/features/user/ui/user-form-translation'
import { getSettingsAction } from '@/lib/features/settings/actions'

interface PageProps {
  params: Promise<{ id: string }>
}
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams
  const loginedUser = await getSession()
  let user = null
  const [settings] = await Promise.all([getSettingsAction()])
  const { resolvedLocale: locale, dictionary } = await resolveLocale({
    user: loginedUser?.user,
  })
  let pageBreadCrumb = {
    title: dictionary.feature.user.create,
    link: '/dashboard/users/create',
  }
  if (id !== 'create') {
    ;[user] = await Promise.all([userCtrl.findById({ id })])
    if (!user) {
      notFound()
    }
    pageBreadCrumb = {
      title: user.name,
      link: `/dashboard/users/${id}`,
    }
  }

  const breadcrumbItems = [
    { title: dictionary.feature.user.title, link: '/dashboard/users' },
    pageBreadCrumb,
  ]
  return (
    <>
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <UserFormTranslation
          initialData={user}
          loginedUser={loginedUser?.user}
          settings={settings}
        />
      </div>
    </>
  )
}
