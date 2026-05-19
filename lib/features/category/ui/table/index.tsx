import { Heading } from '@/components/other/ui/heading'
import { LinkButton } from '@/components/other/ui/link-button'
import CategoryCtrl from '../../controller'
import { Category } from '../../interface'
import { Plus } from 'lucide-react'
import { QueryResponse } from '@/lib/features/core/interface'
import GroupAction from './group-action'
import { User } from '@/lib/features/user/interface'
import { getSession } from '@/lib/auth/get-session'
import authorize from '@/lib/utils/authorize'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'
import ClientCategoryTable from './client-tabel'

interface CategoriesTableProps {
  locale: string
  dictionary: DashboardLocaleSchema
  filters: any
  query: string
  page: number
}

export default async function CategoryTable({
  locale,
  dictionary,
  query,
  filters,
  page,
}: CategoriesTableProps) {
  filters = { ...filters, query }
  const user = (await getSession())?.user as User
  if (!authorize(user.roles, 'category.view.any', false)) {
    filters = { ...filters, user: user.id }
  }

  const canCreate = authorize(user.roles, 'category.create', false)

  const findResult: QueryResponse<Category> = await CategoryCtrl.find({
    filters,
    pagination: { page, perPage: 6 },
  })
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`${dictionary.feature.category.title} (${findResult?.totalDocuments || 0})`}
          description={dictionary.feature.category.description}
        />
        {canCreate && (
          <LinkButton
            className="text-xs md:text-sm"
            href="/dashboard/categories/create"
          >
            <Plus className="me-2 h-4 w-4" />{' '}
            {dictionary.feature.category.create}
          </LinkButton>
        )}
      </div>
      <ClientCategoryTable
        dictionary={dictionary}
        locale={locale}
        findResult={findResult}
        groupAction={GroupAction}
      />
    </>
  )
}
