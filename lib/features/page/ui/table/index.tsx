import PageCtrl from '@/lib/features/page/controller'
import { Page } from '@/lib/features/page/interface'
import { Plus } from 'lucide-react'
import { columns } from './columns'
import { QueryResponse } from '@/lib/features/core/interface'
import GroupAction from './group-action'
import { getSession } from '@/lib/auth/get-session'
import { User } from '@/lib/features/user/interface'
import authorize from '@/lib/utils/authorize'
import { Heading } from '@/components/other/ui/heading'
import { LinkButton } from '@/components/other/ui/link-button'
import { DataTable } from '@/components/other/ui/data-table'

interface CategoriesTableProps {
  query: string
  page: number
}

export default async function PageTable({ query, page }: CategoriesTableProps) {
  let filters = { query }
  const user = (await getSession())?.user as User
  if (!authorize(user.roles, 'page.view.any', false)) {
    filters = { ...filters, user: user.id }
  }

  const canCreate = await authorize(user.roles, 'page.create', false)
  const findResult: QueryResponse<Page> = await PageCtrl.find({
    filters,
    pagination: { page, perPage: 6 },
  })

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`برگه ها (${findResult?.totalDocuments || 0})`}
          description="مدیریت برگه ها"
        />
        {canCreate && (
          <LinkButton
            className="text-xs md:text-sm"
            href="/dashboard/pages/create"
          >
            <Plus className="ml-2 h-4 w-4" /> افزودن برگه
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
