import { DataTable } from '@/components/other/ui/data-table'
import { Heading } from '@/components/other/ui/heading'
import { LinkButton } from '@/components/other/ui/link-button'
import templatePartCtrl from '@/lib/features/section/controller'
import { Section } from '@/lib/features/section/interface'
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

export default async function SectionTable({
  query,
  page,
}: CategoriesTableProps) {
  let filters = { query }
  const user = (await getSession())?.user as User
  if (!authorize(user.roles, 'template.view.any', false)) {
    filters = { ...filters, user: user.id }
  }
  const canCreate = authorize(user.roles, 'template.create', false)
  const findResult: QueryResponse<Section> = await templatePartCtrl.find({
    filters,
    pagination: { page, perPage: 6 },
  })

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`قطعه قالب‌ها (${findResult?.totalDocuments || 0})`}
          description="مدیریت قالب ها"
        />
        {canCreate && (
          <LinkButton
            className="text-xs md:text-sm"
            href="/dashboard/sections/create"
          >
            <Plus className="ml-2 h-4 w-4" /> افزودن قطعه قالب
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
