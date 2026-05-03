import { LinkAlba } from '@/components/other/link-alba'
import { PostNavigationContent } from '@/lib/features/post/actions'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type props = {
  widgetName: string
  user: User
  blockData: {
    content: {}
    type: 'postNavigation'
  } & Block
  postNavigationContent: PostNavigationContent
} & React.HTMLAttributes<HTMLParagraphElement>

export function RenderBlock({
  widgetName,
  blockData,
  postNavigationContent,
  ...props
}: props) {
  const { className, ...res } = props
  const { content, styles } = blockData || {}
  return (
    <nav
      aria-label="pagination"
      className="relative flex justify-between flex-wrap items-start w-full [&_a]:no-underline my-12 border-t border-gray-200 pt-8"
    >
      {postNavigationContent?.pre && (
        <LinkAlba
          aria-label={`Go to previous page: ${postNavigationContent?.pre?.title}`}
          className="group p-1 rounded-md pe-2 ps-7"
          href={postNavigationContent?.pre?.url || '#'}
        >
          <span className="!text-[var(--ds-gray-900)] mb-0.5 transition-colors duration-200 ease-in-out group-hover:!text-[var(--geist-foreground)]">
            Previous
          </span>
          <div className="relative flex [&>span]:max-w-[20em] [&>span]:inline-block [&>span]:truncate [&>span]:break-words focus-visible:outline-none focus-visible:shadow-[var(--ds-focus-ring)]">
            <span className="text-[16px] leading-[24px] font-medium">
              {postNavigationContent?.pre?.title}
            </span>
            <ChevronLeft className="absolute mt-0.5 text-[var(--ds-gray-900)] transition-colors duration-200 ease-in-out -start-[26px] group-hover:text-[var(--geist-foreground)]" />
          </div>
        </LinkAlba>
      )}
      <div className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-2 max-xl:hidden"></div>
      {postNavigationContent?.nex && (
        <LinkAlba
          aria-label={`Go to next page: ${postNavigationContent?.nex?.title}`}
          className="group p-1 rounded-md ps-2 pe-7"
          href={postNavigationContent?.nex?.url || '#'}
        >
          <span className=" !text-[var(--ds-gray-900)] mb-0.5 transition-colors duration-200 ease-in-out group-hover:!text-[var(--geist-foreground)]">
            Next
          </span>
          <div className="relative flex [&>span]:max-w-[20em] [&>span]:inline-block [&>span]:truncate [&>span]:break-words focus-visible:outline-none focus-visible:shadow-[var(--ds-focus-ring)]">
            <span className="text-[16px] leading-[24px] font-medium">
              {postNavigationContent?.nex?.title}
            </span>
            <ChevronRight className="absolute mt-0.5 text-[var(--ds-gray-900)] transition-colors duration-200 ease-in-out -end-[26px] group-hover:text-[var(--geist-foreground)]" />
          </div>
        </LinkAlba>
      )}
    </nav>
  )
}
