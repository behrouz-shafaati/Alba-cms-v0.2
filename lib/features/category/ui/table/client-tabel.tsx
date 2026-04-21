'use client'
import { DataTable } from '@/components/other/ui/data-table'
import { QueryResponse } from '@/lib/features/core/interface'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'
import { getPostCategoryColumns } from './columns'

interface CategoriesTableProps {
  dictionary: DashboardLocaleSchema
  locale: string
  findResult: QueryResponse<any>
  groupAction: any
}

export default function ClientCategoryTable({
  dictionary,
  locale,
  findResult,
  groupAction,
}: CategoriesTableProps) {
  const columns = getPostCategoryColumns(dictionary, locale)
  return (
    <DataTable
      searchTitle={dictionary.shared.search}
      columns={columns}
      response={findResult}
      groupAction={groupAction}
    />
  )
}
