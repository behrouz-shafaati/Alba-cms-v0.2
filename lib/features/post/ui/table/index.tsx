import PostCtrl from '@/lib/features/post/controller'
import GroupAction from './group-action'
import { postUrl } from '../../utils'
import { getSession } from '@/lib/auth/get-session'
import { User } from '@/lib/features/user/interface'
import authorize from '@/lib/utils/authorize'
import { getSettings } from '@/lib/features/settings/controller'
import { resolveLocale } from '@/lib/i18n/utils/resolve-locale'
import {
  DashboardLocaleSchema,
  getDashboardDictionary,
} from '@/lib/i18n/dashboard'
import { ClientPostTable } from './client-table'

interface PostTableProps {
  filters: {
    query?: string
  }
  page: number
  dictionary: DashboardLocaleSchema
  locale: string
}

export default async function PostTable({
  filters,
  page,
  dictionary,
  locale,
}: PostTableProps) {
  const user = (await getSession())?.user as User

  if (!authorize(user.roles, 'post.view.any', false)) {
    filters = { ...filters, author: user.id }
  }

  const canCreate = authorize(user.roles, 'post.create', false)

  const [findResult] = await Promise.all([
    PostCtrl.find({
      filters,
      pagination: { page, perPage: 6 },
    }),
  ])

  return (
    <ClientPostTable
      GroupAction={GroupAction}
      canCreate={canCreate}
      dictionary={dictionary}
      findResult={findResult}
      locale={locale}
      refetchDataUrl={postUrl}
    />
  )
}
