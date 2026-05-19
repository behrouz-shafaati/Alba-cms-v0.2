import userCtrl from '@/lib/features/user/controller'
import { User } from '@/lib/features/user/interface'
import { QueryResponse } from '@/lib/features/core/interface'
import GroupAction from './group-action'
import { getSession } from '@/lib/auth/get-session'
import authorize from '@/lib/utils/authorize'
import ClientUsersTable from './client-tabel'

interface UsersTableProps {
  filters: {
    query?: string
  }
  page: number
  locale: string
}

export default async function UsersTable({
  filters,
  page,
  locale,
}: UsersTableProps) {
  const user = (await getSession())?.user as User
  if (!authorize(user.roles, 'user.view.any', false)) {
    filters = { ...filters, id: user.id }
  }

  const canCreate = authorize(user.roles, 'user.create', false)

  const findResult: QueryResponse<User> = await userCtrl.find({
    filters,
    pagination: { page, perPage: 6 },
  })

  return (
    <ClientUsersTable
      GroupAction={GroupAction}
      canCreate={canCreate}
      findResult={findResult}
      locale={locale}
    />
  )
}
