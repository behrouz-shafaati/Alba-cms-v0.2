import { DataTable } from '@/components/other/ui/data-table'
import { Heading } from '@/components/other/ui/heading'
import { LinkButton } from '@/components/other/ui/link-button'
import CampaignCtrl from '../../controller'
import { Campaign } from '../../interface'
import { Plus } from 'lucide-react'
import { columns } from './columns'
import { QueryResponse } from '@/lib/features/core/interface'
import GroupAction from './group-action'
import { getSession } from '@/lib/auth/get-session'
import { User } from '@/lib/features/user/interface'
import authorize from '@/lib/utils/authorize'

interface CategoriesTableProps {
  query: string
  page: number
}

export default async function CampaignTable({
  query,
  page,
}: CategoriesTableProps) {
  let filters = { query }
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
      <div className="flex items-start justify-between">
        <Heading
          title={`کمپین‌های تبلیغاتی(${findResult?.totalDocuments || 0})`}
          description="مدیریت کمپین‌های تبلیغاتی"
        />
        {canCreate && (
          <LinkButton
            className="text-xs md:text-sm"
            href="/dashboard/ad-campaigns/create"
          >
            <Plus className="ml-2 h-4 w-4" /> افزودن کمپین‌ تبلیغاتی
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
