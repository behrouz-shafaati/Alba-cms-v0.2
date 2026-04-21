'use client'
import { DataTable } from '@/components/other/ui/data-table'
import { QueryResponse } from '@/lib/features/core/interface'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'
import { getProductCategoryColumns } from './columns'

interface CategoriesTableProps {
  dictionary: DashboardLocaleSchema
  locale: string
  findResult: QueryResponse<any>
  GroupAction: any
}

export default function ClientProductCategoryTable({
  dictionary,
  locale,
  findResult,
  GroupAction,
}: CategoriesTableProps) {
  const columns = getProductCategoryColumns(dictionary, locale)
  return (
    <DataTable
      searchTitle={dictionary.shared.search}
      columns={columns}
      response={findResult}
      groupAction={GroupAction}
    />
  )
}
