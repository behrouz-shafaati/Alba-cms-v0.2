// کامپوننت نمایشی بلاک

import React from 'react'
import { Block } from '../../types'
import computedStyles from '../../utils/computedStyles'
import { LinkAlba } from '@/components/other/link-alba'
import { combineClassNames } from '../../utils/styleUtils'
import IconRender from '../../components/IconRender'
import { cn } from '@/lib/utils'

type BlockProps = {
  widgetName: string
  blockData: {
    content: {
      title: string
      alt: string
      description: string
      src: string
      href: string
    }
    type: 'icon'
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const Render = ({ widgetName, blockData, ...props }: BlockProps) => {
  const { id, content, styles } = blockData
  props.className = props?.className
    ? `${props?.className} w-full h-auto max-w-full`
    : 'w-full h-auto max-w-full'

  const imageElement = (
    <div
      data-icon-wrapper
      className={`relative  `}
      style={{
        ...computedStyles(styles),
      }}
    >
      {content?.href ? (
        <LinkAlba
          href={content?.href}
          className={cn(
            'flex flex-col justify-center w-full p-4 rounded-2xl',
            combineClassNames(computedStyles(blockData.styles)),
          )}
          style={{
            ...computedStyles(blockData.styles),
          }}
          {...props}
        >
          {content?.icon && (
            <IconRender
              icon={content?.icon || 'Infinity'}
              className={`b${id}`}
              color={content?.iconColor}
            />
          )}
        </LinkAlba>
      ) : (
        <IconRender
          icon={content?.icon || 'Infinity'}
          className={`b${id}`}
          color={content?.iconColor}
        />
      )}
    </div>
  )

  return imageElement
}
