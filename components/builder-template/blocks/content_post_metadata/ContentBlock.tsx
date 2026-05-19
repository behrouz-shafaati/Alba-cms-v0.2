// کامپوننت نمایشی بلاک

import React from 'react'
import { Block } from '@/components/builder-canvas/types'

import { User } from '@/lib/features/user/interface'
import computedStyles from '@/components/builder-canvas/utils/computedStyles'
import PostMetaDataLazy from '@/components/post/meta-data-lazy'
import { getClientDictionary } from '@/lib/i18n/client'

type ContentBlockProps = {
  siteSettings: any
  locale: string
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
  siteSettings,
  locale,
  blockData,
  content,
  ...props
}: ContentBlockProps) => {
  const { author, createdAt, readingDuration } = content
  const { settings } = blockData
  const dictionary = getClientDictionary(locale)
  return content ? (
    <PostMetaDataLazy
      author={author}
      createdAt={createdAt}
      readingDuration={readingDuration}
      dictionary={dictionary}
      style={{
        ...computedStyles(blockData.styles),
      }}
      {...props}
    />
  ) : (
    <></>
  )
}
