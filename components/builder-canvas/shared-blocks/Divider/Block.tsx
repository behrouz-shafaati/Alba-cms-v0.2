// کامپوننت نمایشی بلاک

import React from 'react'
import { Block as BlockType } from '../../types'
import { cn } from '@/lib/utils'
import computedStyles from '../../utils/computedStyles'
import { combineClassNames } from '../../utils/styleUtils'

type ButtonBlockProps = {
  widgetName: string
  blockData: {
    content: {
      button: string
    }
    type: 'button'
    settings: {
      orientation?: 'horizontal' | 'vertical'
      label?: string
      dashed?: boolean
      thickness?: number
      color?: string
    }
  } & BlockType
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const Block = ({
  widgetName,
  blockData,
  ...props
}: ButtonBlockProps) => {
  const { content, settings } = blockData
  const { className, ...resProps } = props
  if (settings?.orientation === 'vertical') {
    return (
      <div
        className={cn(
          className,
          combineClassNames(computedStyles(blockData.styles)),
        )}
        style={{
          width: settings?.thickness,
          height: '100%',
          ...computedStyles(blockData.styles),
        }}
      />
    )
  }

  if (settings?.label && settings?.label != '') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div
          className={cn(
            `flex-1`,
            className,
            combineClassNames(computedStyles(blockData.styles)),
          )}
          style={{
            height: settings?.thickness,
            borderStyle: settings?.dashed ? 'dashed' : 'solid',
            ...computedStyles(blockData.styles),
          }}
        />

        <span className="text-sm text-gray-500 whitespace-nowrap">
          {settings?.label}
        </span>

        <div
          className={cn(
            `flex-1`,
            className,
            combineClassNames(computedStyles(blockData.styles)),
          )}
          style={{
            height: settings?.thickness,
            borderStyle: settings?.dashed ? 'dashed' : 'solid',
            ...computedStyles(blockData.styles),
          }}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        className,
        combineClassNames(computedStyles(blockData.styles)),
      )}
      style={{
        height: settings?.thickness,
        width: '100%',
        borderStyle: settings?.dashed ? 'dashed' : 'solid',
        ...computedStyles(blockData.styles),
      }}
    />
  )
}
