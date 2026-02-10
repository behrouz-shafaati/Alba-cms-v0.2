// ❌ بدون "use client" — این کامپوننت کاملاً Server Component است
import { PostCover } from '@/components/post/cover'
import { PostTitle } from '@/components/post/title'
import { PostExcerpt } from '@/components/post/excerpt'
import PostHorizontalCard from '../card/ArticalHorizontalCard'
import getTranslation from '@/lib/utils/getTranslation'
import { Post } from '@/lib/features/post/interface'
import { Option } from '@/lib/types'
import { Block } from '@/components/builder-canvas/types'
import { LinkAlba } from '@/components/other/link-alba'

type PostListProps = {
  posts: Post[]
  showMoreHref: string
  blockData: {
    id: string
    type: 'postList'
    content: {
      tags: Option[]
      categories: Option[]
    }
    settings: {
      showArrows: boolean
      loop: boolean
      autoplay: boolean
      autoplayDelay: number
    }
  } & Block
} & React.HTMLAttributes<HTMLDivElement>

export const PostListHeroVertical = ({
  posts,
  showMoreHref,
  blockData,
  ...props
}: PostListProps) => {
  if (!posts?.length) return null
  const firstPost = posts[0]
  const t = getTranslation({ translations: firstPost.translations })

  const restPosts = posts.slice(1)

  return (
    <div className="container mx-auto p-4">
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-[2fr_1fr]
          gap-4
        "
      >
        {/* ستون اصلی — همیشه ستون مرجع ارتفاع */}
        <div className="relative overflow-hidden rounded-xl  bg-card">
          <LinkAlba href={firstPost.href}>
            <PostCover
              file={firstPost.image}
              postType={firstPost.type}
              primaryVideoEmbedUrl={firstPost.primaryVideoEmbedUrl}
              zoomable={false}
              isLCP={blockData?.settings?.isLCP || false}
              aspectRatio={16 / 9}
            />
            <PostTitle title={t.title} />
            <PostExcerpt content={t.excerpt} />
          </LinkAlba>
        </div>

        {/* ستون لیست — تطابق ارتفاع با چپ + اسکرول اگر بیشتر شد */}
        {/* <div
          className="
            rounded-xl
            border
            bg-card
            overflow-y-auto
          "
        > */}
        <div className="divide-y divide-border">
          {restPosts.slice(0, 4).map((p) => (
            <PostHorizontalCard
              key={p.id}
              post={p}
              options={{
                showExcerpt:
                  blockData?.settings?.showExcerpt == true ? true : false,
              }}
            />
          ))}
        </div>
        {/* </div> */}
      </div>
    </div>
  )
}
