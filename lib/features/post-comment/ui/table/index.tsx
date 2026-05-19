import PostCommentCtrl from '@/lib/features/post-comment/controller'
import { QueryResponse } from '@/lib/features/core/interface'
import GroupAction from './group-action'
import { PostComment } from '../../interface'
import { commentsUrl } from '../../utils'
import { getSession } from '@/lib/auth/get-session'
import { User } from '@/lib/features/user/interface'
import authorize from '@/lib/utils/authorize'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'
import ClientPostCommentTable from './client-tabel'

interface PostCommentTableProps {
  filters: {
    query?: string
    post?: string
  }
  page?: number
  dictionary: DashboardLocaleSchema
  locale: string
}

export default async function PostCommentTable({
  filters,
  page = 1,
  dictionary,
  locale,
}: PostCommentTableProps) {
  const user = (await getSession())?.user as User
  if (!authorize(user.roles, 'postComment.view.any', false)) {
    filters = { ...filters, author: user.id }
  }

  const canCreate = authorize(user.roles, 'post.create', false)

  const findResult: QueryResponse<PostComment> = await PostCommentCtrl.find(
    {
      filters,
      pagination: { page, perPage: 6 },
    },
    false,
  )
  return (
    <ClientPostCommentTable
      GroupAction={GroupAction}
      canCreate={canCreate}
      dictionary={dictionary}
      findResult={findResult}
      locale={locale}
      refetchDataUrl={commentsUrl}
    />
  )
}
