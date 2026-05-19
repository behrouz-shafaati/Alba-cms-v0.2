import { Heading } from '@/components/other/ui/heading'
import formSubmissionCtrl from '@/lib/features/form-submission/controller'
import { getSession } from '@/lib/auth/get-session'
import { User } from '@/lib/features/user/interface'
import formCtrl from '@/lib/features/form/controller'
import FormSubmissionClientTable from './FormSubmissionClientTable'
import authorize from '@/lib/utils/authorize'
import { Form } from '@/lib/features/form/interface'
import getTranslation from '@/lib/utils/getTranslation'

interface Props {
  form: Form
  filters: {
    query?: string
  }
  page: number
  locale: string
}

export default async function FormSubmissionTable({
  form,
  filters,
  page,
  locale,
}: Props) {
  const user = (await getSession())?.user as User
  if (!authorize(user.roles, 'formSubmission.view.any')) {
    filters = { ...filters, user: user.id }
  }
  const canCreate = authorize(user.roles, 'formSubmission.create')

  const [formSubmissionResult] = await Promise.all([
    formSubmissionCtrl.find({
      filters,
      pagination: { page, perPage: 6 },
    }),
  ])

  const translation = getTranslation({
    translations: form.translations,
    locale,
  })

  return (
    <FormSubmissionClientTable
      formTranslation={translation}
      findResult={formSubmissionResult}
      locale={locale}
    />
  )
}
