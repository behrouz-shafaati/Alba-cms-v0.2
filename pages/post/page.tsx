import RendererTemplate from '@/components/builder-canvas/templateRender/RenderTemplate.server'
import TableOfContents from '@/components/post/table-of-contents'
import RenderedHtml from '@/components/tiptap-editor/render/RenderedHtml.server'
import { QueryResponse } from '@/lib/features/core/interface'
import { getPostCommentsForClient } from '@/lib/features/post-comment/actions'
import { PostComment } from '@/lib/features/post-comment/interface'
import PostCommentListLazy from '@/lib/features/post-comment/ui/list/PostCommentListLazy'
import { getPostAction } from '@/lib/features/post/actions'
import { PostTranslationSchema } from '@/lib/features/post/interface'
import DefaultSinglePageBlog from '@/lib/features/post/ui/page/single'
import {
  generateFAQSchema,
  generatePostSchema,
} from '@/lib/features/post/utils'
import { getSettingsAction } from '@/lib/features/settings/actions'
import templateCtrl from '@/lib/features/template/controller'
import { buildBreadcrumbsArray } from '@/lib/utils/buildBreadcrumbsArray'
import calculateReadingTime from '@/lib/utils/calculateReadingTime'
import { generateTableOfContents } from '@/lib/utils/generateTableOfContents'
import getTranslation from '@/lib/utils/getTranslation'
import { notFound } from 'next/navigation'

type Props = {
  slugs: string[]
  postSlug: string
  locale: string
}
export default async function PostPage({ locale, postSlug, slugs }: Props) {
  const [post, template, siteSettings] = await Promise.all([
    getPostAction({ locale, slug: postSlug }), // از cache میاد اگه قبلاً در metadata گرفته شده
    templateCtrl.getTemplate({ slug: 'post' }),
    getSettingsAction(),
  ])

  if (!post) {
    notFound()
  }

  const postCommentsResult: QueryResponse<PostComment> =
    await getPostCommentsForClient({
      filters: { post: post.id },
    })

  const translation: PostTranslationSchema = getTranslation({
    translations: post?.translations,
    locale,
  })

  // تبدیل contentJson به متن ساده
  const json = JSON.parse(translation?.contentJson)
  const plainText =
    json.content
      ?.filter((block: any) => block.type === 'paragraph')
      ?.map((block: any) =>
        block.content?.map((c: any) => c.text || '').join(''),
      )
      .join('\n') || ''

  const readingDuration = calculateReadingTime(plainText)

  const metadata = {
    author: post?.author || post?.user,
    createdAt: post.createdAt,
    readingDuration,
  }

  // ساخت TOC سمت سرور
  const toc = generateTableOfContents(JSON.parse(translation?.contentJson))
  const breadcrumbItems = buildBreadcrumbsArray(post)

  const postSchema = generatePostSchema({ post, locale: 'fa' })
  const faqSchema = generateFAQSchema(translation.contentJson)

  const writeJsonLd = () => (
    <>
      {postSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(postSchema) }}
        />
      )}

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {translation?.jsonLd && translation?.jsonLd == '' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: translation?.jsonLd }}
        />
      )}
    </>
  )

  if (post.status !== 'published')
    return (
      <div className="h-screen w-full flex justify-center items-center align-middle">
        مطلب هنوز منتشر نشده است!
      </div>
    )

  if (template)
    return (
      <>
        {writeJsonLd()}
        <>
          <RendererTemplate
            template={template}
            siteSettings={siteSettings}
            pageSlug={postSlug}
            categorySlug={post?.mainCategory?.slug || null}
            // searchParams={resolvedSearchParams}
            editroMode={false}
            content_all={
              <DefaultSinglePageBlog
                siteSettings={siteSettings}
                post={post}
                breadcrumbItems={breadcrumbItems}
                readingDuration={readingDuration}
                tableOfContent={<TableOfContents toc={toc} />}
                comments={
                  <PostCommentListLazy
                    post={post}
                    postCommentsResult={postCommentsResult}
                  />
                }
                locale={locale}
              />
            }
            content_post_title={translation?.title}
            content_post_cover={{
              image: post?.image ?? null,
              postType: post?.type ?? 'article',
              primaryVideoEmbedUrl: post?.primaryVideoEmbedUrl ?? null,
            }}
            content_post_share={{
              url: `${siteSettings?.site_url ?? ''}${post?.href}`,
              title: translation?.title ?? '',
            }}
            content_post_tags={{
              tags: post?.tags ?? [],
            }}
            content_post_author_card={{
              author: post?.author ?? null,
            }}
            content_post_metadata={metadata}
            content_post_breadcrumb={breadcrumbItems}
            content_post_content={
              <RenderedHtml contentJson={translation?.contentJson} />
            }
            content_post_tablecontent={<TableOfContents toc={toc} />}
            content_post_comments={
              <PostCommentListLazy
                post={post}
                postCommentsResult={postCommentsResult}
              />
            }
            content_post_comment_form={{ post }}
          />
        </>
      </>
    )

  return (
    <>
      {writeJsonLd()}
      <>
        <DefaultSinglePageBlog
          // searchParams={resolvedSearchParams}
          post={post}
          siteSettings={siteSettings}
          breadcrumbItems={breadcrumbItems}
          readingDuration={readingDuration}
          tableOfContent={<TableOfContents toc={toc} />}
          comments={
            <PostCommentListLazy
              post={post}
              postCommentsResult={postCommentsResult}
            />
          }
          locale={locale}
        />
      </>
    </>
  )
}
