// کامپوننت نمایشی بلاک

import React, { ElementType } from 'react'
import { Block } from '@/components/builder-canvas/types'
import { PostTitle } from '@/components/post/title'
import computedStyles from '@/components/builder-canvas/utils/computedStyles'

type ContentBlockProps = {
  content: React.ReactNode
  blockData: {
    content: {
      content: string
    }
    type: 'content_post_title'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const ContentBlock = ({
  blockData,
  content,
  ...props
}: ContentBlockProps) => {
  const { settings } = blockData
  return (
    <PostTitle
      title={content}
      style={{
        ...computedStyles(blockData.styles),
      }}
      {...props}
    />
  )
}
