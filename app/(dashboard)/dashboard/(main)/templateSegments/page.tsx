import { BreadCrumb } from '@/components/other/breadcrumb'
import { getSession } from '@/lib/auth/get-session'
import Table from '@/lib/features/templateSegment/ui/table'
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
  const { page = '1', ...filters } = resolvedSearchParams
  const breadcrumbItems = [
    {
      title: dictionary.feature.templateSegment.title,
      link: '/dashboard/pages',
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <Table locale={resolvedLocale} filters={filters} page={Number(page)} />
    </div>
  )
}
