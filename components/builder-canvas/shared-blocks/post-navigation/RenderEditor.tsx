// // کامپوننت نمایشی بلاک
//UserNavBlock.tsx
'use client'
import React, { useEffect, useState } from 'react'
import { Block } from '../../types'
import { RenderBlock } from './Render'
import { Skeleton } from '@/components/ui/skeleton'
import { getPostNavigationContentAction } from '@/lib/features/post/actions'

type props = {
  locale: string
  blockData: {
    content: {}
    type: 'postNavigation'
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

const RenderEditorBlock = ({ blockData, locale, ...props }: props) => {
  const [loading, setLoading] = useState(true)
  const { content } = blockData
  const postNavigationContent = {
    nex: { title: 'Next post', url: '#' },
    pre: { title: 'Previous post', url: '#' },
  }
  return (
    <RenderBlock
      blockData={blockData}
      postNavigationContent={postNavigationContent}
    />
  )
}
export default RenderEditorBlock
