'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface DropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
}

export default function Dropdown({ trigger, children }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  })
  const triggerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggle = () => setOpen(!open)

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        dropdownRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  useEffect(() => {
    if (!open || !triggerRef.current || !dropdownRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const dropdownRect = dropdownRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth

    let top = triggerRect.bottom
    let left = triggerRect.left

    // بررسی overflow عمودی
    if (triggerRect.bottom + dropdownRect.height > viewportHeight) {
      top = triggerRect.top - dropdownRect.height
    }

    // بررسی overflow افقی
    if (triggerRect.left + dropdownRect.width > viewportWidth) {
      left = viewportWidth - dropdownRect.width - 8 // 8px margin
    }

    setPosition({ top: Math.max(top, 8), left: Math.max(left, 8) })
  }, [open])

  return (
    <div className="relative inline-block">
      <div ref={triggerRef} onClick={toggle} className="cursor-pointer">
        {trigger}
      </div>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="absolute z-50 bg-white shadow-lg rounded-md border border-gray-200 p-2"
            style={{
              top: position.top + window.scrollY,
              left: position.left + window.scrollX,
              minWidth: triggerRef.current?.offsetWidth,
            }}
          >
            {children}
          </div>,
          document.body
        )}
    </div>
  )
}
