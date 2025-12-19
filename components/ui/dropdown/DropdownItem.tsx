'use client'

import React from 'react'

interface DropdownItemProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}

export default function DropdownItem({
  children,
  onClick,
  disabled,
}: DropdownItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full text-start px-4 py-2 rounded-md
        text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
        transition-colors duration-150
      `}
    >
      {children}
    </button>
  )
}
