'use client'

import { getColumns } from './columns'
import { DataTable } from '@/components/other/ui/data-table'
import { QueryResponse } from '@/lib/features/core/interface'
import { Heading } from '@/components/other/ui/heading'
import { LinkButton } from '@/components/other/ui/link-button'
import { Plus } from 'lucide-react'
import { useLocale } from '@/hooks/useLocale'

type Props = {
  locale: string
  findResult: QueryResponse<any>
  refetchDataUrl: string
  GroupAction: any
  canCreate: boolean
}

export function ClientPostTable({
  locale,
  findResult,
  refetchDataUrl,
  GroupAction,
  canCreate,
}: Props) {
  const dictionary = useLocale()
  const columns = getColumns(dictionary, locale)
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`${dictionary.feature.post.title} (${findResult?.totalDocuments || 0})`}
          description={dictionary.feature.post.description}
        />
        {canCreate && (
          <LinkButton
            className="text-xs md:text-sm"
            href="/dashboard/posts/create"
          >
            <Plus className="me-2 h-4 w-4" />
            {dictionary.feature.post.create}
          </LinkButton>
        )}
      </div>
      <DataTable
        searchTitle={`${dictionary.shared.search} ...`}
        columns={columns}
        response={findResult}
        refetchDataUrl={refetchDataUrl}
        groupAction={GroupAction}
      />
    </>
  )
}
