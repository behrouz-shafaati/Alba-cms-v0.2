import { BreadCrumb } from '@/components/other/breadcrumb'
import { getSession } from '@/lib/auth/get-session'
import { getSettings } from '@/lib/features/settings/controller'
import ProductTagTable from '@/lib/features/product-tag/ui/table'
import { User } from '@/lib/features/user/interface'
import { getDashboardDictionary } from '@/lib/i18n/dashboard'
import { resolveLocale } from '@/lib/i18n/utils/resolve-locale'

interface PageProps {
  searchParams: Promise<{
    query?: string
    page?: string
  }>
}

async function Page({ searchParams }: PageProps) {
  const user = (await getSession())?.user as User
  const [siteSettings] = await Promise.all([getSettings()])
  const locale = user?.locale || siteSettings?.language?.dashboardDefault || ''
  const resolvedLocale = await resolveLocale({ locale })
  const dictionary = getDashboardDictionary(resolvedLocale)

  const breadcrumbItems = [
    {
      title: dictionary.feature.productTag.title,
      link: '/dashboard/product-tags',
    },
  ]

  const resolvedSearchParams = await searchParams
  const { query = '', page = '1', ...filters } = resolvedSearchParams

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <ProductTagTable
        locale={resolvedLocale}
        query={query}
        page={Number(page)}
        dictionary={dictionary}
        filters={filters}
      />
    </div>
  )
}

export default Page
