import { DataTable } from '@/components/other/ui/data-table'
import { Heading } from '@/components/other/ui/heading'
import { LinkButton } from '@/components/other/ui/link-button'
import templateCtrl from '@/lib/features/template/controller'
import { Template } from '@/lib/features/template/interface'
import { Plus } from 'lucide-react'
import { QueryResponse } from '@/lib/features/core/interface'
import GroupAction from './group-action'
import { getSession } from '@/lib/auth/get-session'
import { User } from '@/lib/features/user/interface'
import authorize from '@/lib/utils/authorize'
import ClientTemplateTable from './client-table'

interface Props {
  filters: {
    query?: string
  }
  page: number
  locale: string
}

export default async function TemplateTable({ filters, page, locale }: Props) {
  const user = (await getSession())?.user as User
  if (!authorize(user.roles, 'template.view.any', false)) {
    filters = { ...filters, user: user.id }
  }

  const canCreate = authorize(user.roles, 'template.create', false)
  const findResult: QueryResponse<Template> = await templateCtrl.find({
    filters,
    pagination: { page, perPage: 6 },
  })

  return (
    <ClientTemplateTable
      canCreate={canCreate}
      findResult={findResult}
      locale={locale}
      groupAction={GroupAction}
    />
  )
}
