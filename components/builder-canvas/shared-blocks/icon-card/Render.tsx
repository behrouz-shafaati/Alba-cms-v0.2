// کامپوننت نمایشی بلاک

import React from 'react'
import { Block } from '../../types'
import { combineClassNames } from '../../utils/styleUtils'
import { cn } from '@/lib/utils'
import { LinkAlba } from '@/components/other/link-alba'
import { cva, type VariantProps } from 'class-variance-authority'
import IconRender from '../../components/IconRender'
import computedStyles from '../../utils/computedStyles'

const buttonVariants = cva('', {
  variants: {
    variant: {
      default: 'border ',
      destructive:
        'bg-destructive text-white  focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
      outline: 'border  shadow-xs  dark:bg-input/30 dark:border-input ',
      secondary: 'bg-secondary text-secondary-foreground ',
      ghost: '',
      link: 'text-primary underline-offset-4 ',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

type ButtonBlockProps = {
  widgetName: string
  blockData: {
    content: {
      button: string
    }
    type: 'button'
    settings: {
      label: string
      href: string
      variant?: string
      size?: string
    }
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const Render = ({
  widgetName,
  blockData,
  ...props
}: ButtonBlockProps) => {
  const { content, settings } = blockData
  const { className, ...resProps } = props
  return (
    <LinkAlba
      href={settings?.href}
      className={cn(
        'flex flex-col justify-center w-full p-4 rounded-2xl',
        buttonVariants({
          variant: settings?.variant || 'default',
        }),
        className || '',
        settings?.backgroundColor?.default || '',
        settings?.backgroundColor?.hover || '',
        settings?.backgroundColor?.focus || '',
        settings?.backgroundColor?.active || '',
        combineClassNames(computedStyles(blockData.styles)),
      )}
      style={{
        ...computedStyles(blockData.styles),
      }}
      {...resProps}
    >
      {settings?.icon && (
        <IconRender
          icon={settings.icon || null}
          className="w-20 h-20"
          color={settings?.iconColor}
        />
      )}
      <span className="text-center text-lg font-bold leading-10">
        {settings?.title}{' '}
      </span>
      <span className="text-center text-sm">{settings?.subtitle} </span>
    </LinkAlba>
  )
}
