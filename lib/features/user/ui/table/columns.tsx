'use client'
import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from './cell-action'
import { Checkbox } from '@/components/ui/checkbox'
import { User } from '@/lib/features/user/interface'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'

export const getColumns = (
  dictionary: DashboardLocaleSchema,
  locale: string,
): ColumnDef<User>[] => [
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
    accessorKey: 'name',
    header: dictionary.feature.user.name,
  },
  {
    accessorKey: 'email',
    header: dictionary.feature.user.email.title,
  },
  {
    accessorKey: 'roles',
    header: dictionary.feature.user.roles.title,
  },
  {
    accessorKey: 'mobile',
    header: dictionary.feature.user.mobile.title,
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
