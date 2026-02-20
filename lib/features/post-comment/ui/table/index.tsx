import { DataTable } from '@/components/other/ui/data-table'
import { Heading } from '@/components/other/ui/heading'
import PostCommentCtrl from '@/lib/features/post-comment/controller'
import { columns } from './columns'
import { QueryResponse } from '@/lib/features/core/interface'
import GroupAction from './group-action'
import { PostComment } from '../../interface'
import { commentsUrl } from '../../utils'
import { getSession } from '@/lib/auth/get-session'
import { User } from '@/lib/features/user/interface'
import authorize from '@/lib/utils/authorize'

interface PostCommentTableProps {
  filters: {
    query?: string
    post?: string
  }
  page?: number
}

export default async function PostCommentTable({
  filters,
  page = 1,
}: PostCommentTableProps) {
  const user = (await getSession())?.user as User
  if (!authorize(user.roles, 'postComment.view.any', false)) {
    filters = { ...filters, author: user.id }
  }

  const findResult: QueryResponse<PostComment> = await PostCommentCtrl.find(
    {
      filters,
      pagination: { page, perPage: 6 },
    },
    false,
  )
  console.log('#2340987 findResult:', findResult)
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`دیدگاه ها (${findResult?.totalDocuments || 0})`}
          description="مدیریت مطالب"
        />
        {/* <LinkButton
          className="text-xs md:text-sm"
          href="/dashboard/post-comments/create"
        >
          <Plus className="ml-2 h-4 w-4" /> افزودن دیدگاه
        </LinkButton> */}
      </div>
      <DataTable
        searchTitle="جستجو ..."
        columns={columns}
        response={findResult}
        refetchDataUrl={commentsUrl}
        groupAction={GroupAction}
      />
    </>
  )
}
