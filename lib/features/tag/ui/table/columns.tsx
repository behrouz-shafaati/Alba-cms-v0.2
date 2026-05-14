'use client'
import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from './cell-action'
import { Checkbox } from '@/components/ui/checkbox'
import { Tag } from '@/lib/features/tag/interface'
import { Status } from '@/components/other/Status'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'
import getTranslation from '@/lib/utils/getTranslation'

export const getPostTagColumns = (
  dictionary: DashboardLocaleSchema,
  locale: string,
): ColumnDef<Tag>[] => [
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
    header: dictionary.feature.tag.title,
    accessorFn: (row) => {
      return (
        getTranslation({ translations: row.translations, locale })?.title ?? ''
      )
    },
  },
  {
    accessorKey: 'status',
    header: dictionary.shared.status,
    cell: ({ row }) => <Status row={row} />,
    meta: {
      filterConfig: {
        type: 'select',
        options: [
          { label: dictionary.shared.active, value: 'active' },
          { label: dictionary.shared.deactive, value: 'deactive' },
        ],
      },
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
