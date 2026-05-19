import { BreadCrumb } from '@/components/other/breadcrumb'
import { getSession } from '@/lib/auth/get-session'
import FormTable from '@/lib/features/form/ui/table'
import { User } from '@/lib/features/user/interface'
import { resolveLocale } from '@/lib/i18n/utils/resolve-locale'

interface Props {
  searchParams: Promise<{
    query?: string
    page?: number
  }>
}

export default async function Page({ searchParams }: Props) {
  const user = (await getSession())?.user as User
  const { resolvedLocale, dictionary } = await resolveLocale({ user })
  const breadcrumbItems = [
    { title: dictionary.shared.dashboard, link: '/dashboard' },
    { title: dictionary.feature.form.title, link: '/dashboard/forms' },
  ]

  const resolvedSearchParams = await searchParams
  const { page = '1', ...filters } = resolvedSearchParams

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <FormTable
        locale={resolvedLocale}
        filters={filters}
        page={Number(page)}
      />
    </div>
  )
}
