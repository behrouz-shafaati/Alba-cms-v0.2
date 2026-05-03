'use client'

import { useState, useRef, useEffect } from 'react'
import { HeadingItem } from '../tiptap-editor/utils'
import { useLocale } from '@/hooks/useLocale'
import Link from 'next/link'
import computedStyles from '../builder-canvas/utils/computedStyles'
import { combineClassNames } from '../builder-canvas/utils/styleUtils'

type Props = {
  toc: HeadingItem[]
  defaultOpen: boolean
  accordion: boolean
  title: string
  activeTextColor: any
}

type Heading = {
  level: number
  text: string
  id: string
  children: Heading[]
}

// تابع استخراج id ها خارج از کامپوننت
function getAllIds(items: Heading[]): string[] {
  return items.flatMap((item) => [item.id, ...getAllIds(item.children)])
}

function RenderTree(items: HeadingItem[], activeTextColor: any) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150
      const allIds = getAllIds(items)

      let currentActiveId = ''
      let minDistance = Infinity

      for (const id of allIds) {
        const element = document.getElementById(id)
        if (!element) continue

        const distance = Math.abs(element.offsetTop - scrollPosition)

        if (element.offsetTop <= scrollPosition && distance < minDistance) {
          minDistance = distance
          currentActiveId = id
        }
      }

      setActiveId(currentActiveId)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [items])

  const renderHeading = (heading: Heading) => {
    const isActive = activeId === heading.id
    const paddingLeft = `${(heading.level - 2) * 12}px`
    return (
      <div key={heading.id}>
        <Link
          href={`#${heading.id}`}
          className={`block py-1.5 text-sm transition-colors opacity-80 hover:opacity-100 ${
            isActive
              ? `${combineClassNames(
                  computedStyles({ textColor: activeTextColor }),
                )} font-bold`
              : ''
          }`}
          style={{
            paddingLeft,
            ...computedStyles({ textColor: activeTextColor }),
          }}
          onClick={(e) => {
            // e.preventDefault()
            document.getElementById(heading.id)?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }}
        >
          {heading.text}
        </Link>
        {heading.children.length > 0 &&
          heading.children.map((child) => renderHeading(child))}
      </div>
    )
  }

  return (
    <nav className="sticky top-24 space-y-1">
      {items.map((item) => renderHeading(item))}
    </nav>
  )
}

export default function TableOfContents({
  toc,
  title = '',
  accordion = true,
  defaultOpen = false,
  activeTextColor = null,
}: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | 'auto'>(0)
  const dic = useLocale()

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? contentRef.current.scrollHeight : 0)
    }
  }, [open, toc])

  console.log('#34555 toc:', toc)

  if (!toc || toc.length === 0) return null

  return accordion ? (
    <nav
      data-tabel-of-content
      className="
        border border-gray-200 dark:border-gray-700
        rounded-xl bg-white dark:bg-gray-800
        shadow-sm
        my-4
      "
    >
      <button
        className="flex justify-between w-full items-center font-semibold text-lg text-gray-900 dark:text-gray-100 p-4 focus:outline-none"
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>

        <svg
          className={`w-4 h-4 transition-transform duration-300 ${
            open ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        ref={contentRef}
        style={{
          height: height === 'auto' ? 'auto' : height,
          overflow: 'hidden',
          transition: 'height 0.3s ease',
        }}
      >
        <div className="p-4 pt-0">{RenderTree(toc, activeTextColor)}</div>
      </div>
    </nav>
  ) : (
    <nav data-tabel-of-content>
      <span>{title}</span>
      <div>{RenderTree(toc, activeTextColor)}</div>
    </nav>
  )
}
