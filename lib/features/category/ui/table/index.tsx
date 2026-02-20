import { DataTable } from '@/components/other/ui/data-table'
import { Heading } from '@/components/other/ui/heading'
import { LinkButton } from '@/components/other/ui/link-button'
import CategoryCtrl from '../../controller'
import { Category } from '../../interface'
import { Plus } from 'lucide-react'
import { columns } from './columns'
import { QueryResponse } from '@/lib/features/core/interface'
import GroupAction from './group-action'
import { User } from '@/lib/features/user/interface'
import { getSession } from '@/lib/auth/get-session'
import authorize from '@/lib/utils/authorize'

interface CategoriesTableProps {
  query: string
  page: number
}

export default async function CategoryTable({
  query,
  page,
}: CategoriesTableProps) {
  let filters = { query }
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
          title={`دسته بندی ها (${findResult?.totalDocuments || 0})`}
          description="مدیریت دسته بندی ها"
        />
        {canCreate && (
          <LinkButton
            className="text-xs md:text-sm"
            href="/dashboard/categories/create"
          >
            <Plus className="ml-2 h-4 w-4" /> افزودن دسته بندی
          </LinkButton>
        )}
      </div>
      <DataTable
        searchTitle="جستجو ..."
        columns={columns}
        response={findResult}
        groupAction={GroupAction}
      />
    </>
  )
}
