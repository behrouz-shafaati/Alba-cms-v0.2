'use client'

import { DataTable } from '@/components/other/ui/data-table'
import { columns } from './columns'
import GroupAction from './group-action'
import { QueryResponse } from '@/lib/features/core/interface'
import { FormSubmission } from '@/lib/features/form-submission/interface'
import { useLocale } from '@/hooks/useLocale'
import { Heading } from '@/components/other/ui/heading'
import { FromTranslation } from '@/lib/features/form/interface'

interface Props {
  findResult: QueryResponse<FormSubmission>
  formTranslation: FromTranslation
  locale: string
}

export default function FormSubmissionClientTable({
  findResult,
  formTranslation,
  locale,
}: Props) {
  const dictionary = useLocale()
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`${dictionary.feature.form.inboxMessages} ${formTranslation.title} (${
            findResult?.totalDocuments || 0
          })`}
          description={`${dictionary.feature.form.inboxMessagesDes} ${formTranslation.title}`}
        />
      </div>
      <DataTable
        searchTitle={`${dictionary.shared.search} ...`}
        columns={columns(formTranslation.fields, dictionary, locale)}
        response={findResult}
        groupAction={GroupAction}
      />
    </>
  )
}
