'use client'

import { DashboardContextValue } from '@/lib/types/dashboard/types'
import { createContext, useContext } from 'react'

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function AdminProvider({
  value,
  children,
}: {
  value: DashboardContextValue
  children: React.ReactNode
}) {
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) {
    throw new Error('useDashboard must be used inside DashboardProvider')
  }
  return ctx
}
