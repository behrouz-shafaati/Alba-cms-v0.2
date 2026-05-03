import { User } from '@/lib/features/user/interface'
import { Block } from '../../types'
import { LinkAlba } from '@/components/other/link-alba'
import computedStyles from '../../utils/computedStyles'
import { getPostNavigationContentAction } from '@/lib/features/post/actions'
import { RenderBlock } from './Render'
type props = {
  widgetName: string
  user: User
  blockData: {
    content: {}
    type: 'postNavigation'
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement>

export async function RenderServerBlock({
  widgetName,
  blockData,
  user,
  ...props
}: props) {
  const { className, locale, pageSlug, ...res } = props
  const { content, settings, styles } = blockData || {}

  const getPostNavigationprops = {
    locale,
    slug: pageSlug || null,
    menuId: content?.menuId || null,
    categories: (content?.categories || []).map((cate) => cate.value) || null,
    usePageCategory: content?.usePageCategory || false,
    tags: (content?.tags || []).map((tag) => tag.value) || null,
  }
  const postNavigationContent = await getPostNavigationContentAction(
    getPostNavigationprops,
  )

  return (
    <RenderBlock
      blockData={blockData}
      widgetName={widgetName}
      postNavigationContent={postNavigationContent}
    />
  )
}
