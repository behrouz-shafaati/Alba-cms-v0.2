import { BreadCrumb } from '@/components/other/breadcrumb'
import { getSession } from '@/lib/auth/get-session'
import Table from '@/lib/features/template/ui/table'
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
  const resolvedSearchParams = await searchParams
  const breadcrumbItems = [
    { title: dictionary.feature.template.title, link: '/dashboard/pages' },
  ]
  const { page = '1', ...filters } = resolvedSearchParams

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <Table locale={resolvedLocale} filters={filters} page={Number(page)} />
    </div>
  )
}
