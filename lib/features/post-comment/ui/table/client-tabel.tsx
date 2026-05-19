'use client'
import { DataTable } from '@/components/other/ui/data-table'
import { Heading } from '@/components/other/ui/heading'
import { getColumns } from './columns'
import { QueryResponse } from '@/lib/features/core/interface'
import { useLocale } from '@/hooks/useLocale'

type Props = {
  locale: string
  findResult: QueryResponse<any>
  refetchDataUrl: string
  GroupAction: any
  canCreate: boolean
}

export default function ClientPostCommentTable({
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
          title={`${dictionary.feature.postComment.title} (${findResult?.totalDocuments || 0})`}
          description={dictionary.feature.postComment.description}
        />
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
