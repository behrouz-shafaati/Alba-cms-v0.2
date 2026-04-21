'use client'
import { DataTable } from '@/components/other/ui/data-table'
import { QueryResponse } from '@/lib/features/core/interface'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'
import { getPostTagColumns } from './columns'

interface TagsTableProps {
  dictionary: DashboardLocaleSchema
  locale: string
  findResult: QueryResponse<any>
  GroupAction: any
}

export default function ClientTagTable({
  dictionary,
  locale,
  findResult,
  GroupAction,
}: TagsTableProps) {
  const columns = getPostTagColumns(dictionary, locale)
  return (
    <DataTable
      searchTitle={dictionary.shared.search}
      columns={columns}
      response={findResult}
      groupAction={GroupAction}
    />
  )
}
