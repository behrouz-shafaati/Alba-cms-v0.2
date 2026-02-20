'use client'
import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from './cell-action'
import { Checkbox } from '@/components/ui/checkbox'
import { Campaign } from '@/lib/features/campaign/interface'
import { Status } from '@/components/other/Status'

export const columns: ColumnDef<Campaign>[] = [
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
    header: 'نام',
    accessorKey: 'title',
  },
  {
    accessorKey: 'status',
    header: 'وضعیت',
    cell: ({ row }) => <Status row={row} />,
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
