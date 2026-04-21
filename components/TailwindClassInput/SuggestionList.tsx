// components/ui/TailwindClassInput/SuggestionList.tsx
'use client'

import { useEffect, useRef } from 'react'
import type { Suggestion } from './suggest'

interface SuggestionListProps {
  suggestions: Suggestion[]
  activeIndex: number
  onSelect: (value: string) => void
  onHover: (index: number) => void
  inputId: string
}

export function SuggestionList({
  suggestions,
  activeIndex,
  onSelect,
  onHover,
  inputId,
}: SuggestionListProps) {
  const activeItemRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    activeItemRef.current?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  if (suggestions.length === 0) return null

  return (
    <ul
      id={`${inputId}-listbox`}
      role="listbox"
      className="
        absolute z-50 top-full left-0 right-0 mt-1
        bg-white border border-gray-200 rounded-lg shadow-lg
        max-h-60 overflow-y-auto py-1
      "
    >
      {suggestions.map((suggestion, index) => {
        const isVariantOnly = suggestion.baseClass === ''
        const isActive = index === activeIndex

        return (
          <li
            key={`${suggestion.value}-${index}`}
            id={`${inputId}-option-${index}`}
            ref={isActive ? activeItemRef : null}
            role="option"
            aria-selected={isActive}
            onMouseDown={(e) => {
              e.preventDefault()
              onSelect(suggestion.value)
            }}
            onMouseEnter={() => onHover(index)}
            className={`
              flex items-center justify-between
              px-3 py-1.5 text-sm cursor-pointer
              transition-colors duration-100
              ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}
            `}
          >
            <span className="font-mono flex items-center gap-1.5">
              {/* نمایش variant با رنگ متفاوت */}
              {suggestion.variant && (
                <>
                  <span
                    className={`
                      ${isActive ? 'text-purple-600' : 'text-purple-500'}
                      font-semibold
                    `}
                  >
                    {suggestion.variant}
                  </span>
                  <span className="text-gray-300">:</span>
                </>
              )}

              {/* base class یا نشانه variant-only */}
              {isVariantOnly ? (
                <span
                  className={`${isActive ? 'text-purple-700' : 'text-purple-600'}`}
                >
                  {suggestion.value}
                  <span className="text-gray-400 text-xs ml-1">(variant)</span>
                </span>
              ) : (
                <span
                  className={`${isActive ? 'text-blue-700' : 'text-gray-700'}`}
                >
                  {suggestion.baseClass}
                </span>
              )}
            </span>

            {/* نشانگر نوع match */}
            <span className="text-xs text-gray-300 shrink-0 ml-2">
              {suggestion.matchType === 'exact-start' && '✦'}
              {suggestion.matchType === 'start' && '→'}
              {suggestion.matchType === 'includes' && '⊂'}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
