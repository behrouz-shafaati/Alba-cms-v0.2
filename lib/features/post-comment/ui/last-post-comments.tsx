import { commentsUrl } from '../utils'
import { Heading } from '@/components/other/ui/heading'
import { DataTable } from '@/components/other/ui/data-table'
import { getColumns } from './table/columns'
import { LinkButton } from '@/components/other/ui/link-button'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'

interface PostCommentTableProps {
  refetchDataUrl?: string
  locale: string
  dictionary: DashboardLocaleSchema
  findResult: any
}

export default async function LastPostComments({
  refetchDataUrl = commentsUrl,
  locale,
  dictionary,
  findResult,
}: PostCommentTableProps) {
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`نظرات منتظر`} description="" />
      </div>
      {findResult?.totalDocuments ? (
        <>
          <DataTable
            searchTitle="جستجو ..."
            columns={getColumns(dictionary, locale)}
            response={findResult}
            refetchDataUrl={refetchDataUrl}
            showSearch={false}
            showFilters={false}
            showPagination={false}
            showGroupAction={false}
          />
          <LinkButton
            className="text-xs md:text-sm"
            href="/dashboard/post-comments?page=1&status=pending"
          >
            بیشتر
          </LinkButton>
        </>
      ) : (
        <div className="flex text-center text-lg justify-center h-full items-center ">
          همه‌ی نظرات پاسخ داده شدن 🎉
        </div>
      )}
    </>
  )
}
