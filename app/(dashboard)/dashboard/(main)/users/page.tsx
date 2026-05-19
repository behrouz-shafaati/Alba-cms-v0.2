import UsersTable from '@/lib/features/user/ui/table/users-table'
import { BreadCrumb } from '@/components/other/breadcrumb'
import { User } from '@/lib/features/user/interface'
import { getSession } from '@/lib/auth/get-session'
import { resolveLocale } from '@/lib/i18n/utils/resolve-locale'

interface PageProps {
  searchParams: Promise<{
    query?: string
    page?: string
  }>
}

async function Page({ searchParams }: PageProps) {
  const user = (await getSession())?.user as User
  const { resolvedLocale, dictionary } = await resolveLocale({ user })
  const breadcrumbItems = [
    { title: dictionary.feature.user.title, link: '/dashboard/users' },
  ]

  const resolvedSearchParams = await searchParams
  const { page = '1', ...filters } = resolvedSearchParams

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <UsersTable
        locale={resolvedLocale}
        filters={filters}
        page={Number(page)}
      />
    </div>
  )
}

export default Page
