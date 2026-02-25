import { UserForm } from '@/lib/features/user/ui/user-form'
import { BreadCrumb } from '@/components/other/breadcrumb'
import userCtrl from '@/lib/features/user/controller'
import { notFound } from 'next/navigation'
import { getSession } from '@/lib/auth/get-session'

interface PageProps {
  params: Promise<{ id: string }>
}
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams
  const loginedUser = await getSession()
  let user = null
  let pageBreadCrumb = { title: 'افزودن', link: '/dashboard/users/create' }
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
    { title: 'کاربران', link: '/dashboard/users' },
    pageBreadCrumb,
  ]
  return (
    <>
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <UserForm initialData={user} lodginedUser={loginedUser?.user} />
      </div>
    </>
  )
}
