import HelloUser from '@/components/other/HelloUser'
import StatCard from '@/components/other/ui/stateCard'
import { Card } from '@/components/ui/card'
import { getSession } from '@/lib/auth/get-session'
import formSubmissionCtrl from '@/lib/features/form-submission/controller'
import LastForms from '@/lib/features/form/ui/last-forms'
import postCommentCtrl from '@/lib/features/post-comment/controller'
import LastPostComments from '@/lib/features/post-comment/ui/last-post-comments'
import { commentsUrl } from '@/lib/features/post-comment/utils'
import postCtrl from '@/lib/features/post/controller'
import LastPosts from '@/lib/features/post/ui/last-posts'
import userCtrl from '@/lib/features/user/controller'
import { resolveLocale } from '@/lib/i18n/utils/resolve-locale'
import authorize from '@/lib/utils/authorize'
import { FileText, MessageSquare, User } from 'lucide-react'

const getStats = async () => {
  const totalUsers = await userCtrl.countAll()
  const totalPosts = await postCtrl.countAll()
  const pendingComments = await postCommentCtrl.countAll({
    status: 'pending',
  })
  const publishedWeek = await postCtrl.countThisWeek()
  return {
    totalUsers,
    totalPosts,
    pendingComments,
    publishedWeek,
  }
}

export default async function DashboardPage() {
  const page = 1
  const [
    session,
    stats,
    postFindResult,
    postCommentFindResult,
    formSubmissionFindResult,
  ] = await Promise.all([
    getSession(),
    getStats(),
    postCtrl.find({
      filters: { query: '' },
      pagination: { page, perPage: 6 },
    }),
    postCommentCtrl.find(
      {
        filters: { status: 'pending' },
        pagination: { page, perPage: 4 },
      },
      false,
    ),
    formSubmissionCtrl.find({
      filters: { status: 'unread' },
      pagination: { page, perPage: 4 },
    }),
  ])
  const user = session?.user
  const { dictionary, resolvedLocale: locale } = await resolveLocale({ user })
  const userRoles = user?.roles || []
  console.log('#82374 user:', user)
  const canViewPost = authorize(userRoles, 'post.view.any', false)
  const canViewUser = authorize(userRoles, 'user.view.any', false)
  const canViewPostComment = authorize(userRoles, 'postComment.view.any', false)
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <HelloUser />
      <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-4">
        {canViewPost && (
          <StatCard
            title="تعداد مطالب"
            value={stats.totalPosts}
            icon={<FileText />}
          />
        )}
        {canViewPost && (
          <StatCard
            title="مطالب منتشر شده این هفته"
            value={stats.publishedWeek}
            icon={<FileText />}
          />
        )}
        {canViewUser && (
          <StatCard
            title="تعداد کاربران"
            value={stats.totalUsers}
            icon={<User />}
          />
        )}
        {canViewPostComment && (
          <StatCard
            title="نظرات در انتظار"
            value={stats.pendingComments}
            icon={<MessageSquare />}
          />
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1  lg:grid-cols-2 gap-4">
        {canViewPost && (
          <Card className="p-4">
            <LastPosts
              dictionary={dictionary}
              locale={locale}
              findResult={postFindResult}
            />
          </Card>
        )}
        {canViewPostComment && (
          <Card className="p-4">
            <LastPostComments
              dictionary={dictionary}
              locale={locale}
              findResult={postCommentFindResult}
              refetchDataUrl={`${commentsUrl}?page=1&status=pending`}
            />
          </Card>
        )}
        {canViewPostComment && (
          <Card className="p-4">
            <LastForms
              dictionary={dictionary}
              locale={locale}
              findResult={formSubmissionFindResult}
            />
          </Card>
        )}
      </div>
    </div>
  )
}
