// کامپوننت نمایشی بلاک

import React, { ElementType } from 'react'
import { Block } from '@/components/builder-canvas/types'
import Text from '@/components/input/text'
import computedStyles from '../../utils/computedStyles'
import IconRender from '../../components/IconRender'

type BlockInEditorProps = {
  widgetName: string
  blockData: {
    content: {
      content: string
    }
    type: 'content_post_title'
    settings: {}
  } & Block
  locale: 'fa'
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const BlockInEditor = ({
  locale = 'fa',
  widgetName,
  blockData,
  ...props
}: BlockInEditorProps) => {
  const { id, content, settings } = blockData

  return (
    <div
      style={{
        ...computedStyles(blockData.styles),
      }}
      {...props}
    >
      <Text
        title={content?.title?.[locale] || ''}
        placeholder={content?.placeholder?.[locale] || ''}
        defaultValue={content?.defaultValue?.[locale] || ''}
        name={id}
        id={id}
        {...(content?.icon
          ? {
              icon: <IconRender icon={content.icon} className={`w-5 h-5`} />,
            }
          : {})}
        description={content?.description?.[locale] || ''}
        required={content?.required || false}
      />
    </div>
  )
}
