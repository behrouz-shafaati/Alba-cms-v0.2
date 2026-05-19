'use client'
import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from './cell-action'
import { Checkbox } from '@/components/ui/checkbox'
import { Campaign } from '@/lib/features/campaign/interface'
import { Status } from '@/components/other/Status'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'

export const getColumns = (
  dictionary: DashboardLocaleSchema,
  locale: string,
): ColumnDef<Campaign>[] => [
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
    header: dictionary.feature.adCampaign.title,
    accessorKey: 'title',
  },
  {
    accessorKey: 'status',
    header: dictionary.feature.adCampaign.status,
    cell: ({ row }) => <Status row={row} />,
    meta: {
      filterConfig: {
        type: 'select',
        options: [
          { label: dictionary.feature.adCampaign.active, value: 'active' },
          {
            label: dictionary.feature.adCampaign.scheduled,
            value: 'scheduled',
          },
          { label: dictionary.feature.adCampaign.draft, value: 'draft' },
          { label: dictionary.feature.adCampaign.inactive, value: 'inactive' },
          { label: dictionary.feature.adCampaign.ended, value: 'ended' },
        ],
      },
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
