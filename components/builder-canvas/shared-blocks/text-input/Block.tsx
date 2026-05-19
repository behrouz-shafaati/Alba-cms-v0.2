// کامپوننت نمایشی بلاک

import React, { ElementType } from 'react'
import { Block as BlockType } from '@/components/builder-canvas/types'
import Text from '@/components/input/text'
import computedStyles from '../../utils/computedStyles'
import IconRender from '../../components/IconRender'

type BlockProps = {
  content: React.ReactNode
  blockData: {
    content: {
      content: string
    }
    type: 'content_post_title'
    settings: {}
  } & BlockType
  locale: 'fa'
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const Block = ({ blockData, locale = 'fa', ...props }: BlockProps) => {
  const { id, settings, content } = blockData
  const { className, ...restProps } = props

  console.log(content?.title?.[locale] || content?.title?.fa || '')
  return (
    <Text
      style={{
        ...computedStyles(blockData?.styles),
      }}
      title={content?.title?.[locale] || ''}
      placeholder={content?.placeholder?.[locale] || ''}
      name={id}
      id={id}
      {...(content?.icon
        ? {
            icon: <IconRender icon={content.icon} className={`w-5 h-5`} />,
          }
        : {})}
      description={content?.description?.[locale] || ''}
      required={content?.required || false}
      className={className}
      readOnly={content?.readOnly || false}
      defaultValue={content?.defaultValue?.[locale] || ''}
      {...restProps}
    />
  )
}
