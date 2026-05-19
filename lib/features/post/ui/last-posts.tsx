'use client'
import { Plus } from 'lucide-react'
import { Heading } from '@/components/other/ui/heading'
import { LinkButton } from '@/components/other/ui/link-button'
import { DataTable } from '@/components/other/ui/data-table'
import { getColumns } from './table/columns'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'

interface PostTableProps {
  locale: string
  dictionary: DashboardLocaleSchema
  findResult: any
}

export default function LastPosts({
  locale,
  dictionary,
  findResult,
}: PostTableProps) {
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`آخرین مطالب`} description="" />
        <LinkButton
          className="text-xs md:text-sm"
          href="/dashboard/posts/create"
        >
          <Plus className="ml-2 h-4 w-4" /> افزودن مطلب
        </LinkButton>
      </div>
      <DataTable
        searchTitle="جستجو ..."
        columns={getColumns(dictionary, locale)}
        response={findResult}
        showFilters={false}
        showPagination={false}
        showSearch={false}
        showGroupAction={false}
      />
    </>
  )
}
