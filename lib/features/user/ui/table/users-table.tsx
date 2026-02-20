import { DataTable } from '@/components/other/ui/data-table'
import { Heading } from '@/components/other/ui/heading'
import { LinkButton } from '@/components/other/ui/link-button'
import userCtrl from '@/lib/features/user/controller'
import { User } from '@/lib/features/user/interface'
import { Plus } from 'lucide-react'
import { columns } from './columns'
import { QueryResponse } from '@/lib/features/core/interface'
import GroupAction from './group-action'
import { getSession } from '@/lib/auth/get-session'
import authorize from '@/lib/utils/authorize'

interface UsersTableProps {
  query: string
  page: number
}

export default async function UsersTable({ query, page }: UsersTableProps) {
  let filters = { query }
  const user = (await getSession())?.user as User
  if (!authorize(user.roles, 'user.view.any', false)) {
    filters = { ...filters, id: user.id }
  }

  const canCreate = authorize(user.roles, 'user.create', false)

  const findResult: QueryResponse<User> = await userCtrl.find({
    filters: filters,
    pagination: { page, perPage: 6 },
  })

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`کاربران (${findResult?.totalDocuments || 0})`}
          description="مدیریت کاربران"
        />
        {canCreate && (
          <LinkButton
            className="text-xs md:text-sm"
            href="/dashboard/users/create"
          >
            <Plus className="ml-2 h-4 w-4" /> افزودن کاربر
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
