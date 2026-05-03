'use client'
import computedStyles from '@/components/builder-canvas/utils/computedStyles'
import { combineClassNames } from '@/components/builder-canvas/utils/styleUtils'
import { MenuItem } from '@/lib/features/menu/interface'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import hasActiveSubMenu from '../utils/hasActiveSubMenu'

export default function MobileMenuList({
  items,
  ...props
}: {
  items: MenuItem[]
}) {
  console.log('#234908723498723 props menu:', props)
  console.log('#234908723498723 props menu:', props)
  const { content, pageSlug } = props
  return (
    <div className="flex flex-col gap-4">
      {(items || []).map((item, index) => {
        const isActive = item.url.endsWith(pageSlug)
        const isChildActive = hasActiveSubMenu(item.subMenu, pageSlug)
        return (
          <MobileMenuItem
            key={index}
            item={item}
            isActive={isActive}
            activeTextColor={content?.activeTextColor}
            openMenu={isChildActive}
            content={content}
            pageSlug={pageSlug}
          />
        )
      })}
    </div>
  )
}

function MobileMenuItem({
  item,
  isActive,
  activeTextColor = null,
  openMenu = false,
  pageSlug,
  content,
}: {
  item: MenuItem
  isActive: boolean
  activeTextColor: any
  openMenu: boolean
  pageSlug: string
  content: { activeTextColor: any }
}) {
  // const router = useRouter()
  const [open, setOpen] = useState(openMenu)
  const hasSubMenu = item.subMenu && item.subMenu.length > 0
  /** Prefetch when menu opens */
  // useEffect(() => {
  //   if (item?.url) {
  //     console.log('#234987 prefetch:', item.url)
  //     router.prefetch(item.url)
  //   }
  //   if (hasSubMenu) {
  //     // Prefetch top-level links
  //     item.subMenu.forEach((item) => {
  //       {
  //         console.log('#234987 prefetch:', item.url)
  //         router.prefetch(item.url)
  //       }
  //     })
  //   }
  // }, [router])
  return item?.url ? (
    <div>
      <div className="flex items-center justify-between">
        <Link
          href={item.url}
          className={cn(
            'font-thin text-sm',
            isActive
              ? combineClassNames(
                  computedStyles({ textColor: activeTextColor }),
                )
              : '',
          )}
          style={{ ...computedStyles({ textColor: activeTextColor }) }}
        >
          {item.label}
        </Link>
        {hasSubMenu && (
          <button className=" hover:opacity-70" onClick={() => setOpen(!open)}>
            {open ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronLeft className="w-3 h-3" />
            )}
          </button>
        )}
      </div>
      {hasSubMenu && open && (
        <div className="flex flex-col gap-1 mt-4 ms-4">
          <MobileMenuList
            items={item.subMenu!}
            content={content}
            pageSlug={pageSlug}
          />
        </div>
      )}
    </div>
  ) : (
    <></>
  )
}
