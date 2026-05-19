import formCtrl from '../controller'
import { Heading } from '@/components/other/ui/heading'
import { DataTable } from '@/components/other/ui/data-table'
import { getColumns } from './table/columns'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'

interface FormTableProps {
  locale: string
  dictionary: DashboardLocaleSchema
  findResult: any
}

export default async function LastForms({
  locale,
  dictionary,
  findResult,
}: FormTableProps) {
  const formWithUnreadSubmissionIds = []

  for (const formSubmission of findResult.data) {
    if (!formWithUnreadSubmissionIds.includes(formSubmission?.form)) {
      formWithUnreadSubmissionIds.push(formSubmission?.form)
    }
  }

  const formResult = await formCtrl.find({
    filters: { _id: { $in: formWithUnreadSubmissionIds } },
  })

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`پیام های دریافتی فرم‌ها`} description="" />
      </div>
      {findResult?.totalDocuments ? (
        <>
          <DataTable
            searchTitle="جستجو ..."
            columns={getColumns(dictionary, locale)}
            response={formResult}
            showSearch={false}
            showFilters={false}
            showPagination={false}
            showGroupAction={false}
          />
          {/* <LinkButton
            className="text-xs md:text-sm"
            href="/dashboard/forms?page=1&status=unread"
          >
            بیشتر
          </LinkButton> */}
        </>
      ) : (
        <div className="flex text-center text-lg justify-center h-full items-center pb-8 ">
          پیام تازه ای دریافت نشده است
        </div>
      )}
    </>
  )
}
