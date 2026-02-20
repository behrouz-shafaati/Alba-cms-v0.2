'use client'
import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from './cell-action'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/lib/features/form/interface'
import { Status } from '@/components/other/Status'

export const columns: ColumnDef<Form>[] = [
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
    accessorKey: 'title',
    header: 'عنوان',
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
