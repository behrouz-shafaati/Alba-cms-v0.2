'use client'
import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from './cell-action'
import { Checkbox } from '@/components/ui/checkbox'
import { FormSubmission } from '@/lib/features/form-submission/interface'
import { Status } from '@/components/other/Status'
import getTranslation from '@/lib/utils/getTranslation'
import truncateWords from '@/lib/utils/truncateWords'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'

export const columns = (
  formFields: any,
  dictionary: DashboardLocaleSchema,
  locale: string,
): ColumnDef<FormSubmission>[] => {
  let countColumnsToShow = 5
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    ...formFields.slice(0, countColumnsToShow).map((f: any) => {
      return {
        accessorKey: `values.${f.name}`,
        header: f.label,
        cell: ({ row }) => {
          const translation = getTranslation({
            translations: row.original.translations,
          })
          return truncateWords(translation.values[f.name])
        },
      }
    }),
    {
      accessorKey: 'status',
      header: dictionary.feature.form.status,
      cell: ({ row }) => <Status row={row} />,
      meta: {
        filterConfig: {
          type: 'select',
          options: [
            { label: dictionary.feature.form.read, value: 'read' },
            { label: dictionary.feature.form.unread, value: 'unread' },
          ],
        },
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <CellAction data={row.original} formFields={formFields} />
      ),
    },
  ]
}
