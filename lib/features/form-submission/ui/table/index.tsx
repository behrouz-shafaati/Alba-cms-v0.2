import { Heading } from '@/components/other/ui/heading'
import formSubmissionCtrl from '@/lib/features/form-submission/controller'
import { getSession } from '@/lib/auth/get-session'
import { User } from '@/lib/features/user/interface'
import formCtrl from '@/lib/features/form/controller'
import FormSubmissionClientTable from './FormSubmissionClientTable'
import authorize from '@/lib/utils/authorize'

interface CategoriesTableProps {
  formId: string
  query: string
  page: number
}

export default async function FormSubmissionTable({
  formId,
  query,
  page,
}: CategoriesTableProps) {
  let filters = { query }
  const user = (await getSession())?.user as User
  if (!authorize(user.roles, 'formSubmission.view.any')) {
    filters = { ...filters, user: user.id }
  }
  const canCreate = authorize(user.roles, 'formSubmission.create')

  const [formSubmissionResult, form] = await Promise.all([
    formSubmissionCtrl.find({
      filters,
      pagination: { page, perPage: 6 },
    }),
    formCtrl.findById({ id: formId }),
  ])

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`پیام‌های دریافتی ${form.title} (${
            formSubmissionResult?.totalDocuments || 0
          })`}
          description={`مدیریت  پیام‌های دریافتی فرم ${form.title}`}
        />
        {/* {canCreate && (
          <LinkButton
            className="text-xs md:text-sm"
            href="/dashboard/formSubmissions/create"
          >
            <Plus className="ml-2 h-4 w-4" /> افزودن فرم
          </LinkButton>
        )} */}
      </div>
      <FormSubmissionClientTable
        fields={form?.fields}
        response={formSubmissionResult}
      />
    </>
  )
}
