// کامپوننت نمایشی بلاک

import React, { ElementType } from 'react'
import { Block } from '@/components/builder-canvas/types'
import computedStyles from '@/components/builder-canvas/utils/computedStyles'
import TableOfContents from '@/components/post/table-of-contents'

type ContentBlockProps = {
  content: React.ReactNode
  blockData: {
    content: {
      content: string
    }
    type: 'content_post_tablecontent'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const ContentBlock = ({
  blockData,
  content,
  ...props
}: ContentBlockProps) => {
  const { content: blockContent } = blockData
  const { className, ...restProps } = props
  return (
    <div
      style={{
        ...computedStyles(blockData.styles),
      }}
      className={`${className} overflow-y-auto`}
      {...restProps}
    >
      <TableOfContents
        toc={content}
        defaultOpen={blockContent?.listOpen}
        accordion={blockContent?.accordion}
        title={blockContent?.title}
        activeTextColor={blockContent?.activeTextColor || null}
      />
    </div>
  )
}
