import { BreadCrumbType } from '@/components/other/breadcrumb'
import RenderedHtml from '@/components/tiptap-editor/render/RenderedHtml.server'
import { Post, PostTranslationSchema } from '../../interface'
import { PostCover } from '@/components/post/cover'
import { PostComments } from '@/components/post/comments'
import { PostCommentForm } from '@/components/post/comment-form'
import { PostContent } from '@/components/post/content'
import { PostTitle } from '@/components/post/title'
import ShareButtons from '@/components/share/share-buttons'
import { Settings } from '@/lib/features/settings/interface'
import { PostTags } from '@/components/post/tags'
import { PostAuthorCard } from '@/components/post/author-card'
import { CommentsHeader } from '@/components/post/comments-header'
import PostMetaDataLazy from '@/components/post/meta-data-lazy'
import getTranslation from '@/lib/utils/getTranslation'
import { PostBreadcrumbServer } from '@/components/post/breadcrumb.server'

type props = {
  locale?: string
  siteSettings: Settings
  breadcrumbItems: BreadCrumbType[]
  post: Post
  readingDuration: number
  tableOfContent?: any
  comments?: any
  searchParams?: any
}

const DefaultSinglePageBlog = ({
  breadcrumbItems,
  post,
  siteSettings,
  locale = 'fa',
  readingDuration,
  tableOfContent = null,
  comments = null,
  searchParams = {},
}: props) => {
  const translation: PostTranslationSchema = getTranslation({
    translations: post?.translations,
  })

  return (
    <div className=" max-w-4xl m-auto text-justify p-2">
      <PostBreadcrumbServer content={breadcrumbItems} locale={locale} />

      {post?.image && (
        <PostCover
          file={post?.image}
          postType={post?.type ?? null}
          primaryVideoEmbedUrl={post?.primaryVideoEmbedUrl ?? null}
        />
      )}
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between overflow-hidden">
        <PostMetaDataLazy
          author={post?.author || post?.user || null}
          createdAt={post.createdAt}
          readingDuration={readingDuration}
        />
        <ShareButtons
          url={`${siteSettings.site_url}${post.href}`}
          title={translation?.title}
        />
      </div>
      <PostTitle title={translation?.title} />

      {tableOfContent}
      <PostContent
        content={<RenderedHtml contentJson={translation?.contentJson} />}
      />
      <PostTags tags={post.tags} />
      <PostAuthorCard author={post.author} />
      <div>
        <CommentsHeader />
        {comments && <PostComments content={comments} />}
        <PostCommentForm post={post} />
      </div>
    </div>
  )
}

export default DefaultSinglePageBlog
