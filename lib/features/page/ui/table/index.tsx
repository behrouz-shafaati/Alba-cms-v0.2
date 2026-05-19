import PageCtrl from '@/lib/features/page/controller'
import { Page } from '@/lib/features/page/interface'
import { QueryResponse } from '@/lib/features/core/interface'
import GroupAction from './group-action'
import { getSession } from '@/lib/auth/get-session'
import { User } from '@/lib/features/user/interface'
import authorize from '@/lib/utils/authorize'
import ClientPageTable from './client-table'

interface Props {
  filters: {
    query?: string
  }
  page: number
  locale: string
}

export default async function PageTable({ filters, page, locale }: Props) {
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
      <ClientPageTable
        GroupAction={GroupAction}
        canCreate={canCreate}
        findResult={findResult}
        locale={locale}
      />
    </>
  )
}
