import formCtrl from '@/lib/features/form/controller'
import { Form } from '@/lib/features/form/interface'
import { QueryResponse } from '@/lib/features/core/interface'
import GroupAction from './group-action'
import { getSession } from '@/lib/auth/get-session'
import { User } from '@/lib/features/user/interface'
import authorize from '@/lib/utils/authorize'
import ClientFormTable from './client-table'

interface Props {
  filters: {
    query?: string
  }
  page: number
  locale: string
}

export default async function FormTable({ filters, page, locale }: Props) {
  const user = (await getSession())?.user as User
  if (!authorize(user.roles, 'form.view.any', false)) {
    filters = { ...filters, user: user.id }
  }
  const canCreate = authorize(user.roles, 'form.create', false)
  const findResult: QueryResponse<Form> = await formCtrl.find({
    filters,
    pagination: { page, perPage: 6 },
  })

  return (
    <>
      <ClientFormTable
        GroupAction={GroupAction}
        canCreate={canCreate}
        findResult={findResult}
        locale={locale}
      />
    </>
  )
}
