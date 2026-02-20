// کامپوننت نمایشی بلاک
import React from 'react'
import { Block } from '../../../builder-canvas/types'
import { Section } from './Template'
import { getSection } from '@/lib/features/section/actions'

type Props = {
  widgetName: string
  blockData: {
    id: string
    type: 'templatePart'
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
  const [template] = await Promise.all([getSection(content?.templateId)])
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
