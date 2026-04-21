import { Heading } from '@/components/other/ui/heading'
import { LinkButton } from '@/components/other/ui/link-button'
import TagCtrl from '../../controller'
import { Tag } from '../../interface'
import { Plus } from 'lucide-react'
import { QueryResponse } from '@/lib/features/core/interface'
import GroupAction from './group-action'
import { getSession } from '@/lib/auth/get-session'
import { User } from '@/lib/features/user/interface'
import authorize from '@/lib/utils/authorize'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'
import ClientTagTable from './client-tabel'

interface TagsTableProps {
  locale: string
  dictionary: DashboardLocaleSchema
  query: string
  filters: any
  page: number
}

export default async function TagTable({
  locale,
  dictionary,
  query,
  filters,
  page,
}: TagsTableProps) {
  const user = (await getSession())?.user as User
  filters = { ...filters, query }
  if (!authorize(user.roles, 'tag.view.any', false)) {
    filters = { ...filters, user: user.id }
  }

  const canCreate = await authorize(user.roles, 'post.create', false)

  const findResult: QueryResponse<Tag> = await TagCtrl.find({
    filters,
    pagination: { page, perPage: 6 },
  })
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`${dictionary.feature.tag.title} (${findResult?.totalDocuments || 0})`}
          description={dictionary.feature.tag.description}
        />
        {canCreate && (
          <LinkButton
            className="text-xs md:text-sm"
            href="/dashboard/tags/create"
          >
            <Plus className="me-2 h-4 w-4" /> {dictionary.feature.tag.create}
          </LinkButton>
        )}
      </div>
      <ClientTagTable
        dictionary={dictionary}
        locale={locale}
        findResult={findResult}
        GroupAction={GroupAction}
      />
    </>
  )
}
