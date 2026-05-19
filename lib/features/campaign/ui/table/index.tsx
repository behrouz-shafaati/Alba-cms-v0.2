import CampaignCtrl from '../../controller'
import { Campaign } from '../../interface'
import { QueryResponse } from '@/lib/features/core/interface'
import GroupAction from './group-action'
import { getSession } from '@/lib/auth/get-session'
import { User } from '@/lib/features/user/interface'
import authorize from '@/lib/utils/authorize'
import ClientCampaignTable from './client-table'

interface Props {
  filters: {
    query?: string
  }
  page: number
  locale: string
}

export default async function CampaignTable({ filters, page, locale }: Props) {
  const user = (await getSession())?.user as User
  if (!authorize(user.roles, 'campaign.view.any', false)) {
    filters = { ...filters, user: user.id }
  }

  const canCreate = authorize(user.roles, 'campaign.create', false)

  const findResult: QueryResponse<Campaign> = await CampaignCtrl.find({
    filters,
    pagination: { page, perPage: 6 },
  })
  return (
    <>
      <ClientCampaignTable
        GroupAction={GroupAction}
        canCreate={canCreate}
        findResult={findResult}
        locale={locale}
      />
    </>
  )
}
