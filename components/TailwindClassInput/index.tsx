// components/ui/TailwindClassInput/TailwindClassInput.tsx
'use client'

import {
  useState,
  useRef,
  useCallback,
  useId,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react'
import { SuggestionList } from './SuggestionList'
import { getSuggestions, type Suggestion } from './suggest'

function getCurrentWord(value: string, cursorPos: number) {
  const before = value.slice(0, cursorPos)
  const lastSpace = before.lastIndexOf(' ')
  const start = lastSpace + 1
  const word = before.slice(start)
  return { word, start }
}

export interface TailwindClassInputProps {
  value?: string
  placeholder?: string
  label?: string
  disabled?: boolean
  onChange?: (value: string) => void
  className?: string
}

export default function TailwindClassInput({
  value = '',
  placeholder = 'md:flex hover:bg-blue-500 ...',
  label = 'Tailwind Classes',
  disabled = false,
  onChange,
  className = '',
}: TailwindClassInputProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const [inputValue, setInputValue] = useState(value)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isOpen, setIsOpen] = useState(false)

  const updateSuggestions = useCallback((val: string, cursorPos: number) => {
    const { word } = getCurrentWord(val, cursorPos)
    const results = getSuggestions(word)
    setSuggestions(results)
    setActiveIndex(-1)
    setIsOpen(results.length > 0)
  }, [])

  const insertSuggestion = useCallback(
    (suggestionValue: string) => {
      const input = inputRef.current
      if (!input) return

      const cursor = input.selectionStart ?? inputValue.length
      const { start } = getCurrentWord(inputValue, cursor)
      const before = inputValue.slice(0, start)
      const after = inputValue.slice(cursor)

      // اگر variant-only بود (مثلا "md:") فاصله نمی‌ذاریم
      const isVariantOnly = suggestionValue.endsWith(':')
      const separator = isVariantOnly ? '' : ' '
      const newValue = before + suggestionValue + separator + after.trimStart()
      const newCursor = (before + suggestionValue + separator).length

      setInputValue(newValue)
      onChange?.(newValue)
      setIsOpen(false)
      setSuggestions([])
      setActiveIndex(-1)

      requestAnimationFrame(() => {
        input.focus()
        input.setSelectionRange(newCursor, newCursor)
        // بعد از انتخاب variant، بلافاصله پیشنهاد base class بده
        if (isVariantOnly) {
          const results = getSuggestions(suggestionValue)
          setSuggestions(results)
          setIsOpen(results.length > 0)
        }
      })
    },
    [inputValue, onChange],
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    const cursor = e.target.selectionStart ?? val.length
    setInputValue(val)
    onChange?.(val)
    updateSuggestions(val, cursor)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((p) => (p < suggestions.length - 1 ? p + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((p) => (p > 0 ? p - 1 : suggestions.length - 1))
        break
      case 'Enter':
      case 'Tab':
        if (activeIndex >= 0) {
          e.preventDefault()
          insertSuggestion(suggestions[activeIndex].value)
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setActiveIndex(-1)
        break
    }
  }

  const handleBlur = () => setTimeout(() => setIsOpen(false), 150)

  const handleFocus = () => {
    const cursor = inputRef.current?.selectionStart ?? inputValue.length
    updateSuggestions(inputValue, cursor)
  }

  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none select-none"
        >
          🎨
        </span>

        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={`${inputId}-listbox`}
          aria-activedescendant={
            activeIndex >= 0 ? `${inputId}-option-${activeIndex}` : undefined
          }
          disabled={disabled}
          value={inputValue}
          placeholder={placeholder}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={handleFocus}
          spellCheck={false}
          autoComplete="off"
          className={`
            w-full pl-9 pr-8 py-2.5 text-sm font-mono
            bg-white border rounded-lg text-gray-800 placeholder-gray-400
            transition-colors duration-150
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
            ${
              isOpen
                ? 'border-blue-400 ring-2 ring-blue-100 outline-none'
                : 'border-gray-300 hover:border-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none'
            }
          `}
        />

        {inputValue && !disabled && (
          <button
            type="button"
            aria-label="Clear"
            onClick={() => {
              setInputValue('')
              onChange?.('')
              setIsOpen(false)
              inputRef.current?.focus()
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && (
        <SuggestionList
          suggestions={suggestions}
          activeIndex={activeIndex}
          onSelect={insertSuggestion}
          onHover={setActiveIndex}
          inputId={inputId}
        />
      )}

      {/* Badges */}
      {inputValue.trim() && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {inputValue
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .map((cls, i) => {
              // رنگ‌بندی badge بر اساس وجود variant
              const hasVariant = cls.includes(':')
              return (
                <span
                  key={`${cls}-${i}`}
                  className={`
                    inline-flex items-center gap-1
                    px-2 py-0.5 rounded-md text-xs font-mono
                    border
                    ${
                      hasVariant
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }
                  `}
                >
                  {cls}
                  <button
                    type="button"
                    aria-label={`Remove ${cls}`}
                    onClick={() => {
                      const updated = inputValue
                        .split(/\s+/)
                        .filter((_, idx) => idx !== i)
                        .join(' ')
                      setInputValue(updated)
                      onChange?.(updated)
                    }}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-3 h-3"
                      aria-hidden="true"
                    >
                      <path d="M5.28 4.22a.75.75 0 00-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 101.06 1.06L8 9.06l2.72 2.72a.75.75 0 101.06-1.06L9.06 8l2.72-2.72a.75.75 0 00-1.06-1.06L8 6.94 5.28 4.22z" />
                    </svg>
                  </button>
                </span>
              )
            })}
        </div>
      )}
    </div>
  )
}
