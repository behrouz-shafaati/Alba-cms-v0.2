// کامپوننت نمایشی بلاک

import React, { ElementType } from 'react'
import { Block } from '../../types'
import computedStyles from '../../utils/computedStyles'

type TextBlockProps = {
  widgetName: string
  blockData: {
    content: {
      text: string
      fontSize?: {
        sm?: string
        md?: string
        lg?: string
      }
      fontWeight?: string
      textAlign?: 'left' | 'right' | 'center' | 'justify'
      color?: string
    }
    type: 'text'
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const TextBlock = ({
  widgetName,
  blockData,
  ...props
}: TextBlockProps) => {
  const { content, id } = blockData

  const tagMap: Record<string, ElementType> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    p: 'p',
    div: 'div',
    span: 'span',
    // هر تگ دیگه‌ای که بخوای اضافه کن
  }

  const Tag: ElementType = tagMap[content.tag] || 'div'
  return (
    <Tag
      style={{
        ...computedStyles(blockData.styles),
      }}
      {...props}
    >
      {content.text || 'متن پیش‌فرض'}
    </Tag>
  )
}
