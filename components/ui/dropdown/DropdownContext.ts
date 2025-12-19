'use client'

import { createContext, useContext } from 'react'

type DropdownContextType = {
  close: () => void
}

export const DropdownContext = createContext<DropdownContextType | null>(null)

export function useDropdown() {
  const ctx = useContext(DropdownContext)
  if (!ctx) {
    throw new Error('DropdownItem must be used inside Dropdown')
  }
  return ctx
}
