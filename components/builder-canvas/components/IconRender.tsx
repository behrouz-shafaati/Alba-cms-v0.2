'use client'

import { IconValue } from '@/components/input/IconPicker'
import DynamicLucideIcon from './DynamicLucideIcon'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import computedStyles from '../utils/computedStyles'
import { combineClassNames } from '../utils/styleUtils'

interface IconRenderProps {
  icon: IconValue
  className?: string
  size?: number
  strokeWidth?: number
  color?: any
}

export default function IconRender({
  icon,
  className = 'w-6 h-6',
  strokeWidth = 2,
  color = null,
}: IconRenderProps) {
  console.log('#@##4234 icon:', icon)
  if (icon?.file)
    return (
      <div
        className={cn(
          'mx-auto bg-primary',
          combineClassNames(computedStyles({ backgroundColor: color })),
          className,
        )}
        style={{
          mask: `url(${icon.file.srcSmall}) no-repeat center`,
          WebkitMask: `url(${icon.file.srcSmall}) no-repeat center`,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          ...computedStyles({
            backgroundColor: color,
          }),
        }}
      />
    )

  return (
    <DynamicLucideIcon
      name={icon.lucide}
      className={className}
      strokeWidth={strokeWidth}
    />
  )
}
