'use server'
import { getBlocksSafe } from '@/lib/singletonBlockRegistry'
import { Block } from '../types'
import { Settings } from '@/lib/features/settings/interface'

type RestProps = Record<string, unknown>

type RenderBlockProp = {
  siteSettings: Settings
  editroMode: boolean
  item: Block
  pageSlug: string | null
  categorySlug: string | null
  searchParams?: any
  className?: string
  locale: string
}
const RenderBlock = async ({
  siteSettings,
  editroMode = false,
  item,
  pageSlug,
  categorySlug,
  searchParams = {},
  locale,
  className = '',
  ...rest
}: RenderBlockProp) => {
  const blocks = getBlocksSafe() // برای محتوا دار بودن این برای رسیدن به این کامپوننت هیچ کامپوننتی نباید از use client‌ استفاده کرده باشد
  const block = blocks[item.type]
  const Component = block?.Renderer
  if (Component) {
    if (item.type.startsWith('content_')) {
      const node = extractNode(rest, item.type) // محتوای مورد نظر از پراپ های ارسال شده استخراج میشود
      if (node)
        return (
          <>
            <Component
              siteSettings={siteSettings}
              blockData={item}
              className={`b${item.id} ${className}`}
              content={node} // به ویژگی content جهت نمایش در جایگاه مورد نظر پاس داده میشود
              pageSlug={pageSlug}
              categorySlug={categorySlug}
              searchParams={searchParams}
              locale={locale}
            />
          </>
        )
    }
    if (item.type === 'templatePart') {
      return (
        <>
          <Component
            siteSettings={siteSettings}
            blockData={item}
            className={`b${item.id} ${className}}`}
            {...rest} // 👈 همه content_all به صورت داینامیک پاس داده میشه
            pageSlug={pageSlug}
            categorySlug={categorySlug}
            searchParams={searchParams}
            locale={locale}
          />
        </>
      )
    }

    return (
      <>
        <Component
          siteSettings={siteSettings}
          blockData={item}
          className={`b${item.id} ${className}`}
          pageSlug={pageSlug}
          categorySlug={categorySlug}
          searchParams={searchParams}
          locale={locale}
        />
      </>
    )
  }
  return <p>رندر بلاک {item.type} ناموفق بود</p>
  // }
}

export default RenderBlock

function extractNode(rest: RestProps, key: string): React.ReactNode | null {
  if (!key.startsWith('content_')) return null
  const value = rest[key]
  if (!value) return null
  return value as React.ReactNode
}
