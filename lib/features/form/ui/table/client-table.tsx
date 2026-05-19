'use client'
import { DataTable } from '@/components/other/ui/data-table'
import { Heading } from '@/components/other/ui/heading'
import { LinkButton } from '@/components/other/ui/link-button'
import { Plus } from 'lucide-react'
import { QueryResponse } from '@/lib/features/core/interface'
import { useLocale } from '@/hooks/useLocale'
import { getColumns } from './columns'

interface Props {
  locale: string
  findResult: QueryResponse<any>
  GroupAction: any
  canCreate: boolean
}

export default function ClientFormTable({
  locale,
  findResult,
  GroupAction,
  canCreate,
}: Props) {
  const dictionary = useLocale()
  const columns = getColumns(dictionary, locale)

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`${dictionary.feature.form.title} (${findResult?.totalDocuments || 0})`}
          description={dictionary.feature.form.description}
        />
        {canCreate && (
          <LinkButton
            className="text-xs md:text-sm"
            href="/dashboard/forms/create"
          >
            <Plus className="me-2 h-4 w-4" /> {dictionary.feature.form.create}
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
