import { Heading } from '@/components/other/ui/heading'
import { LinkButton } from '@/components/other/ui/link-button'
import { ProductCategory } from '../../interface'
import { Plus } from 'lucide-react'
import { QueryResponse } from '@/lib/features/core/interface'
import GroupAction from './group-action'
import { User } from '@/lib/features/user/interface'
import { getSession } from '@/lib/auth/get-session'
import authorize from '@/lib/utils/authorize'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'
import ClientProductCategoryTable from './client-tabel'
import productCategoryCtrl from '../../controller'

interface CategoriesTableProps {
  locale: string
  dictionary: DashboardLocaleSchema
  query: string
  filters: any
  page: number
}

export default async function ProductCategoryTable({
  locale,
  dictionary,
  query,
  filters,
  page,
}: CategoriesTableProps) {
  filters = { ...filters, query }
  const user = (await getSession())?.user as User
  if (!authorize(user.roles, 'productCategory.view.any', false)) {
    filters = { ...filters, user: user.id }
  }
  const canCreate = authorize(user.roles, 'productCategory.create', false)

  const findResult: QueryResponse<ProductCategory> =
    await productCategoryCtrl.find({
      filters,
      pagination: { page, perPage: 6 },
    })
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`${dictionary.feature.productCategory.title} (${findResult?.totalDocuments || 0})`}
          description={dictionary.feature.productCategory.description}
        />
        {canCreate && (
          <LinkButton
            className="text-xs md:text-sm"
            href="/dashboard/product-categories/create"
          >
            <Plus className="me-2 h-4 w-4" />{' '}
            {dictionary.feature.productCategory.create}
          </LinkButton>
        )}
      </div>
      <ClientProductCategoryTable
        dictionary={dictionary}
        locale={locale}
        findResult={findResult}
        GroupAction={GroupAction}
      />
    </>
  )
}
