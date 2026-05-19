import { QueryResponse } from '@/lib/features/core/interface'
import { PostComment } from '../../interface'
import { Post } from '@/lib/features/post/interface'
import { PostCommentItem } from './post-comment-item'
import { getClientDictionary } from '@/lib/i18n/client'
// import { useCustomSWR } from '@/hooks/use-custom-swr'

interface PostCommentTableProps {
  post: Post
  postCommentsResult: QueryResponse<PostComment>
  locale: string
}

export default function PostCommentList({
  post,
  postCommentsResult,
  locale,
}: PostCommentTableProps) {
  const initialPostComments = postCommentsResult
  const postComments = postCommentsResult.data
  // const { data: postComments, isLoading } = useCustomSWR({
  //   url: `/api/comments?post=${post.id}`,
  //   initialData: initialPostComments,
  // })
  const dictionary = getClientDictionary(locale)
  return (
    <>
      <div className="">
        {(postComments ?? []).map((postComment: PostComment) => {
          return (
            <PostCommentItem
              key={postComment.id}
              postComment={postComment}
              dictionary={dictionary}
            />
          )
        })}
      </div>
    </>
  )
}
