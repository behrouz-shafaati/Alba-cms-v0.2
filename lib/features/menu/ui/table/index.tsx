import MenuCtrl from '@/lib/features/menu/controller'
import { Menu } from '@/lib/features/menu/interface'
import { QueryResponse } from '@/lib/features/core/interface'
import GroupAction from './group-action'
import { getSession } from '@/lib/auth/get-session'
import { User } from '@/lib/features/user/interface'
import authorize from '@/lib/utils/authorize'
import ClientMenuTable from './client-tabel'

interface CategoriesTableProps {
  filters: {
    query?: string
  }
  page: number
  locale: string
}

export default async function MenuTable({
  filters,
  page,
  locale,
}: CategoriesTableProps) {
  const user = (await getSession())?.user as User
  if (!authorize(user.roles, 'menu.view.any', false)) {
    filters = { ...filters, user: user.id }
  }

  const canCreate = authorize(user.roles, 'menu.create', false)

  const findResult: QueryResponse<Menu> = await MenuCtrl.find({
    filters,
    pagination: { page, perPage: 6 },
  })

  return (
    <ClientMenuTable
      groupAction={GroupAction}
      canCreate={canCreate}
      findResult={findResult}
      locale={locale}
    />
  )
}
