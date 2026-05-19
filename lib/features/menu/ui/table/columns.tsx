'use client'
import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from './cell-action'
import { Checkbox } from '@/components/ui/checkbox'
import { Menu } from '@/lib/features/menu/interface'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'

export const getColumns = (
  dictionary: DashboardLocaleSchema,
  locale: string,
): ColumnDef<Menu>[] => [
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
    header: dictionary.feature.menu.title,
    accessorFn: (row) => {
      return row.translations?.find((t) => t.locale === locale)?.title ?? ''
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
