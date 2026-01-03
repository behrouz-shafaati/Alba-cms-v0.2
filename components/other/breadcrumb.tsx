'use client'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import React from 'react'
import { LinkAlba } from './link-alba'
import { useLocale } from '@/hooks/useLocale'

export type BreadCrumbType = {
  title: string
  link: string
}

type BreadCrumbPropsType = {
  items: BreadCrumbType[]
}

export function BreadCrumb({ items }: BreadCrumbPropsType) {
  const t = useLocale()
  return (
    <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
      {items?.map((item: BreadCrumbType, index: number) => {
        const className =
          index === items.length - 1
            ? 'text-foreground pointer-events-none'
            : 'text-muted-foreground'
        return (
          <React.Fragment key={`${item.title}-${index}`}>
            {index !== 0 &&
              (t.dir == 'ltr' ? (
                <ChevronRightIcon className="h-4 w-4" />
              ) : (
                <ChevronLeftIcon className="h-4 w-4" />
              ))}
            <LinkAlba
              href={item.link}
              className={` 
               font-medium ${className}`}
            >
              {item.title}
            </LinkAlba>
          </React.Fragment>
        )
      })}
    </div>
  )
}
