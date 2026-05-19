'use client'
import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from './cell-action'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/lib/features/form/interface'
import { Status } from '@/components/other/Status'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'
import getTranslation from '@/lib/utils/getTranslation'

export const getColumns = (
  dictionary: DashboardLocaleSchema,
  locale: string,
): ColumnDef<Form>[] => [
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
  {
    header: dictionary.feature.form.title,
    accessorFn: (row) => {
      return (
        getTranslation({ translations: row.translations, locale })?.title ?? ''
      )
    },
  },
  {
    accessorKey: 'status',
    header: dictionary.feature.form.status,
    cell: ({ row }) => <Status row={row} />,
    meta: {
      filterConfig: {
        type: 'select',
        options: [
          { label: dictionary.feature.form.active, value: 'Active' },
          { label: dictionary.feature.form.deactive, value: 'Deactive' },
        ],
      },
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
