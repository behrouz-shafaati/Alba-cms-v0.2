import templateSegmentCtrl from '@/lib/features/templateSegment/controller'
import { Section } from '@/lib/features/templateSegment/interface'
import { QueryResponse } from '@/lib/features/core/interface'
import GroupAction from './group-action'
import { getSession } from '@/lib/auth/get-session'
import { User } from '@/lib/features/user/interface'
import authorize from '@/lib/utils/authorize'
import ClientSectionTable from './client-table'

interface Props {
  filters: {
    query?: string
  }
  page: number
  locale: string
}

export default async function SectionTable({ filters, page, locale }: Props) {
  const user = (await getSession())?.user as User
  if (!authorize(user.roles, 'template.view.any', false)) {
    filters = { ...filters, user: user.id }
  }
  const canCreate = authorize(user.roles, 'template.create', false)
  const findResult: QueryResponse<Section> = await templateSegmentCtrl.find({
    filters,
    pagination: { page, perPage: 6 },
  })

  return (
    <ClientSectionTable
      GroupAction={GroupAction}
      canCreate={canCreate}
      findResult={findResult}
      locale={locale}
    />
  )
}
