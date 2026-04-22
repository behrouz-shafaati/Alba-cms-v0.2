// رندر کردن بلاک‌ها از روی JSON
// RenderRows.tsx
import React from 'react'
import type { Row } from '@/components/builder-canvas/types'
import { combineClassNames, getVisibilityClass } from '../utils/styleUtils'
import RenderBlock from './RenderBlock'
import { Settings } from '@/lib/features/settings/interface'
import Image from 'next/image'
import computedStyles from '../utils/computedStyles'
import { cn } from '@/lib/utils'

type Props = {
  siteSettings: Settings
  editroMode: boolean
  rows: Row[]
  pageSlug?: string | null
  categorySlug?: string | null
  searchParams?: any
  [key: string]: any // اجازه props داینامیک مثل content_1, content_2
  locale: string
}

const RendererRows = async ({
  siteSettings,
  editroMode = false,
  rows,
  pageSlug = null,
  categorySlug = null,
  searchParams = {},
  locale,
  ...rest
}: Props) => {
  console.log('#@#s43 resolvedLocale in render rows:', locale)
  // فیلتر کردن propsهایی که content_ شروع میشن
  const contents = Object.entries(rest)
    .filter(([key]) => key.startsWith('content_'))
    .map(([key, value]) => ({
      key, // مثل "content_main" یا "content_title"
      node: value as React.ReactNode,
    }))
  const contentProps = contents.reduce(
    (acc, { key, node }) => {
      acc[key] = node
      return acc
    },
    {} as Record<string, React.ReactNode>,
  )
  return (
    <>
      {rows?.map((row: any) => {
        const visibility: any = row.styles?.visibility
        const className = getVisibilityClass(visibility, { display: 'grid' })
        let stickyClass = ''
        // این نوع چسبان فقط مخصوص ردیف است صله ی آن تا بالای ویو پورت همیشه صفر است. تنها یک ردیف این قابلیت را باید داشته باشد
        if (row?.content?.sticky || false) stickyClass = 'sticky top-0 z-50'
        console.log(
          `#${row.id} row.styles:`,
          row.styles,
          `\n`,
          computedStyles(row.styles),
        )
        return (
          <div
            data-row
            key={row.id}
            style={{ ...computedStyles(row.styles) }}
            className={`b${row.id} relative grid grid-cols-12 gap-4 ${combineClassNames(
              computedStyles(row.styles),
            )} ${className} ${stickyClass} `}
          >
            {row?.content?.bgMedia && (
              <Image
                src={row?.content?.bgMedia?.srcMedium}
                alt="ALBA CMS Hero"
                fill
                priority
                className="object-cover"
              />
            )}
            {row.columns.map((col: any) => {
              const visibilityClassName = getVisibilityClass(
                col.styles?.visibility,
                { display: col.content?.display },
              )
              delete col.content?.visibility
              // as default columns content is sticky
              col.content = { sticky: true, ...col?.content }
              const responsiveDesign = row?.content?.responsiveDesign ?? true
              const classBaseOnResponsiveDesign = responsiveDesign
                ? `col-span-12 md:col-span-${col.width}`
                : `col-span-${col.width}`

              return (
                <div
                  data-column
                  key={col.id}
                  className={`relative  ${classBaseOnResponsiveDesign} ${combineClassNames(
                    col?.tailwindClasses || {},
                    computedStyles(col.styles),
                  )} ${visibilityClassName}`}
                  style={{
                    ...computedStyles(col.styles),
                    ...computedStyles(col.content),
                  }}
                >
                  {col?.content?.bgMedia && (
                    <Image
                      src={col?.content?.bgMedia?.srcMedium}
                      alt="ALBA CMS Hero"
                      fill
                      priority
                      className="object-cover"
                    />
                  )}
                  <div
                    data-block-wrapper
                    //When the row is sticky don't need sticky column
                    className={cn(
                      `b${col.id}`,
                      row?.content?.sticky || col.content?.sticky == false
                        ? ''
                        : 'w-full sticky [--header-top:var(--header-top-mobile)] sm:[--header-top:var(--header-top-tablet)] md:[--header-top:var(--header-top-desktop)]',
                    )}
                    style={{
                      ...computedStyles({
                        ...col.styles,
                        top: 'var(--header-top)',
                        ['--header-top-mobile' as any]: `${siteSettings?.appearance?.mobileHeaderHeight}px`,
                        ['--header-top-tablet' as any]: `${siteSettings?.appearance?.tabletHeaderHeight}px`,
                        ['--header-top-desktop' as any]: `${siteSettings?.appearance?.desktopHeaderHeight}px`,
                      }),
                      ...computedStyles(col.settings),
                    }}
                  >
                    {col.blocks.map((el: any, index: number) => {
                      const visibility: any = el.styles?.visibility
                      const visibilityClassName = getVisibilityClass(
                        visibility,
                        {
                          display: el?.settings?.display || 'block',
                        },
                      )

                      return (
                        <RenderBlock
                          siteSettings={siteSettings}
                          key={el.id}
                          item={el}
                          editroMode={editroMode}
                          pageSlug={pageSlug}
                          categorySlug={categorySlug}
                          searchParams={searchParams}
                          locale={locale}
                          className={`${visibilityClassName} ${combineClassNames(
                            computedStyles(el?.styles),
                          )}`}
                          {...contentProps}
                        />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </>
  )
}
export default RendererRows
