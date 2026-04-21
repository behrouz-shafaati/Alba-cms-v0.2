'use client'
import { DataTable } from '@/components/other/ui/data-table'
import { QueryResponse } from '@/lib/features/core/interface'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'
import { getProductTagColumns } from './columns'

interface ProductTagsTableProps {
  dictionary: DashboardLocaleSchema
  locale: string
  findResult: QueryResponse<any>
  groupAction: any
}

export default function ClientProductTagTable({
  dictionary,
  locale,
  findResult,
  groupAction,
}: ProductTagsTableProps) {
  const columns = getProductTagColumns(dictionary, locale)
  return (
    <DataTable
      searchTitle={dictionary.shared.search}
      columns={columns}
      response={findResult}
      groupAction={groupAction}
    />
  )
}
