import { BreadCrumb } from '@/components/other/breadcrumb'
import { getSession } from '@/lib/auth/get-session'
import Table from '@/lib/features/form-submission/ui/table'
import formCtrl from '@/lib/features/form/controller'
import { User } from '@/lib/features/user/interface'
import { resolveLocale } from '@/lib/i18n/utils/resolve-locale'
import getTranslation from '@/lib/utils/getTranslation'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    query?: string
    page?: number
  }>
}

export default async function Page({ searchParams, params }: Props) {
  const user = (await getSession())?.user as User
  const { resolvedLocale, dictionary } = await resolveLocale({ user })
  const resolvedParams = await params
  const { id } = resolvedParams
  const resolvedSearchParams = await searchParams
  const { page = '1', ...filters } = resolvedSearchParams

  const [form] = await Promise.all([formCtrl.findById({ id })])

  const translation = getTranslation({
    translations: form.translations,
    locale: resolvedLocale,
  })

  const breadcrumbItems = [
    { title: dictionary.shared.dashboard, link: '/dashboard' },
    { title: dictionary.feature.form.title, link: '/dashboard/forms' },
    { title: translation.title, link: `/dashboard/forms/${form.id}` },
    {
      title: dictionary.feature.form.inboxMessages,
      link: `/dashboard/forms/${form.id}/submissions`,
    },
  ]
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <Table
        locale={resolvedLocale}
        filters={filters}
        page={Number(page)}
        form={form}
      />
    </div>
  )
}
