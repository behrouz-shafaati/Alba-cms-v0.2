'use client'
import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from './cell-action'
import { Page } from '@/lib/features/page/interface'
import { Checkbox } from '@/components/ui/checkbox'
import { Status } from '@/components/other/Status'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'
import getTranslation from '@/lib/utils/getTranslation'

export const getColumns = (
  dictionary: DashboardLocaleSchema,
  locale: string,
): ColumnDef<Page>[] => [
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
    header: dictionary.feature.page.title,
    accessorFn: (row) => {
      return (
        getTranslation({ translations: row.translations, locale })?.title ?? ''
      )
    },
  },
  {
    accessorKey: 'status',
    header: dictionary.feature.page.status,
    cell: ({ row }) => <Status row={row} />,
    meta: {
      filterConfig: {
        type: 'select',
        options: [
          { label: dictionary.feature.page.published, value: 'published' },
          { label: dictionary.feature.page.draft, value: 'draft' },
        ],
      },
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
