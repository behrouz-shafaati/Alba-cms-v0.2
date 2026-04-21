// کامپوننت نمایشی بلاک

import React from 'react'
import { Block } from '../../types'
import { combineClassNames } from '../../utils/styleUtils'
import { cn } from '@/lib/utils'
import { LinkAlba } from '@/components/other/link-alba'
import { cva, type VariantProps } from 'class-variance-authority'
import IconRender from '../../components/IconRender'
import computedStyles from '../../utils/computedStyles'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap  rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground ',
        destructive:
          'bg-destructive text-white  focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline: 'border  shadow-xs  dark:bg-input/30 dark:border-input ',
        secondary: 'bg-secondary text-secondary-foreground ',
        ghost: '',
        link: 'text-primary underline-offset-4 ',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        xl: 'h-12 rounded-md px-8 has-[>svg]:px-6',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

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

export const ButtonBlock = ({
  widgetName,
  blockData,
  ...props
}: ButtonBlockProps) => {
  const { content, settings } = blockData
  const { className, ...resProps } = props
  console.log('#23403298hiku resProps:', resProps)
  return (
    <LinkAlba
      href={settings?.href}
      className={cn(
        buttonVariants({
          variant: settings?.variant || 'default',
          size: settings?.size || 'default',
        }),
        'items-center align-middle text-center justify-center gap-2 px-4 py-2 rounded-md transition-colors hover:brightness-90',
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
      {settings?.icon && settings?.iconPlace == 'before' && (
        <IconRender
          icon={settings.icon || null}
          className={`w-5 h-5 ${settings?.iconColor}`}
          blockData={blockData}
        />
      )}
      <span className={`${settings.textColor}`}>{settings?.label} </span>
      {settings?.icon && settings?.iconPlace == 'after' && (
        <IconRender
          icon={settings.icon || null}
          className={`w-5 h-5 ${settings?.iconColor}`}
          blockData={blockData}
        />
      )}
    </LinkAlba>
  )
}
