'use client'

import { DataTable } from '@/components/other/ui/data-table'
import { columns } from './columns'
import GroupAction from './group-action'
import { QueryResponse } from '@/lib/features/core/interface'
import { FormSubmission } from '@/lib/features/form-submission/interface'

interface Props {
  response: QueryResponse<FormSubmission>
  fields: any
}

export default function FormSubmissionClientTable({ response, fields }: Props) {
  return (
    <DataTable
      searchTitle="جستجو ..."
      columns={columns(fields)}
      response={response}
      groupAction={GroupAction}
    />
  )
}
