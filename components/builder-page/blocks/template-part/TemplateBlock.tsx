// کامپوننت نمایشی بلاک
import React from 'react'
import { Block } from '../../../builder-canvas/types'
import { Section } from './Template'
import { getTemplateSegment } from '@/lib/features/templateSegment/actions'

type Props = {
  widgetName: string
  blockData: {
    id: string
    type: 'templateSegment'
    content: {
      templateId: string
    }
    settings: {
      stickyTemplate: boolean
    }
  } & Block
  pageSlug: string | null
  categorySlug: string | null
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default async function TemplateBlock({
  widgetName,
  blockData,
  ...props
}: Props) {
  const { content } = blockData
  const [template] = await Promise.all([
    getTemplateSegment(content?.templateId),
  ])
  return (
    <Section
      template={template}
      blockData={blockData}
      {...props}
      editroMode={false}
      pageSlug={props.pageSlug}
      categorySlug={props.categorySlug}
    />
  )
}
