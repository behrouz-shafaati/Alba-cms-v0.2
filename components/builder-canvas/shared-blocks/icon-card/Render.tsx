// کامپوننت نمایشی بلاک

import React from 'react'
import { Block } from '../../types'
import D0 from './design/d0'
import D1 from './design/d1'

type ButtonBlockProps = {
  widgetName: string
  blockData: {
    content: {
      button: string
      label: string
      href: string
      variant?: string
      size?: string
      backgroundColor?: any
    }
    type: 'button'
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const Render = ({
  widgetName,
  blockData,
  ...props
}: ButtonBlockProps) => {
  const { content } = blockData
  const { className, ...resProps } = props
  switch (content.design) {
    case 'default':
      return <D0 blockData={blockData} {...props} />
    case 'd1':
      return <D1 blockData={blockData} {...props} />
  }
}
