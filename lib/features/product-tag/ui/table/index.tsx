import { Heading } from '@/components/other/ui/heading'
import { LinkButton } from '@/components/other/ui/link-button'
import productTagCtrl from '../../controller'
import { ProductTag } from '../../interface'
import { Plus } from 'lucide-react'
import { QueryResponse } from '@/lib/features/core/interface'
import GroupAction from './group-action'
import { getSession } from '@/lib/auth/get-session'
import { User } from '@/lib/features/user/interface'
import authorize from '@/lib/utils/authorize'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'
import ClientProductTagTable from './client-tabel'

interface ProductTagsTableProps {
  locale: string
  dictionary: DashboardLocaleSchema
  query: string
  filters: any
  page: number
}

export default async function ProductTagTable({
  locale,
  dictionary,
  query,
  filters,
  page,
}: ProductTagsTableProps) {
  const user = (await getSession())?.user as User
  filters = { ...filters, query }
  if (!authorize(user.roles, 'productTag.view.any', false)) {
    filters = { ...filters, user: user.id }
  }

  const canCreate = authorize(user.roles, 'productTag.create', false)

  const findResult: QueryResponse<ProductTag> = await productTagCtrl.find({
    filters,
    pagination: { page, perPage: 6 },
  })
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`${dictionary.feature.productTag.title} (${findResult?.totalDocuments || 0})`}
          description={dictionary.feature.productTag.description}
        />
        {canCreate && (
          <LinkButton
            className="text-xs md:text-sm"
            href="/dashboard/product-tags/create"
          >
            <Plus className="me-2 h-4 w-4" />{' '}
            {dictionary.feature.productTag.create}
          </LinkButton>
        )}
      </div>
      <ClientProductTagTable
        dictionary={dictionary}
        locale={locale}
        findResult={findResult}
        groupAction={GroupAction}
      />
    </>
  )
}
