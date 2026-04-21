// کامپوننت نمایشی بلاک

import React from 'react'
import { Block } from '@/components/builder-canvas/types'
import { User } from '@/lib/features/user/interface'
import { PostBreadcrumb } from '@/components/post/breadcrumb'
import computedStyles from '@/components/builder-canvas/utils/computedStyles'

type ContentBlockProps = {
  content: { author: User; createdAt: string; readingDuration: number }
  blockData: {
    content: {
      content: string
    }
    type: 'content_post_metadata'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const ContentBlock = ({
  blockData,
  content,
  ...props
}: ContentBlockProps) => {
  const locale = 'fa'
  content
  const { settings } = blockData
  return (
    <PostBreadcrumb
      content={content}
      style={{
        ...computedStyles(blockData.styles),
      }}
      {...props}
    />
  )
}
