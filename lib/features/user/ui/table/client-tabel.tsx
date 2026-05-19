'use client'
import { DataTable } from '@/components/other/ui/data-table'
import { Heading } from '@/components/other/ui/heading'
import { LinkButton } from '@/components/other/ui/link-button'
import { Plus } from 'lucide-react'
import { getColumns } from './columns'
import { QueryResponse } from '@/lib/features/core/interface'
import { useLocale } from '@/hooks/useLocale'

interface UsersTableProps {
  locale: string
  findResult: QueryResponse<any>
  GroupAction: any
  canCreate: boolean
}

export default function ClientUsersTable({
  locale,
  findResult,
  GroupAction,
  canCreate,
}: UsersTableProps) {
  const dictionary = useLocale()
  const columns = getColumns(dictionary, locale)
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`${dictionary.feature.user.title} (${findResult?.totalDocuments || 0})`}
          description={dictionary.feature.user.description}
        />
        {canCreate && (
          <LinkButton
            className="text-xs md:text-sm"
            href="/dashboard/users/create"
          >
            <Plus className="me-2 h-4 w-4" /> {dictionary.feature.user.create}
          </LinkButton>
        )}
      </div>
      <DataTable
        searchTitle={`${dictionary.shared.search} ...`}
        columns={columns}
        response={findResult}
        groupAction={GroupAction}
      />
    </>
  )
}
