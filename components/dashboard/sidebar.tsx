'use client'
import { useLocale } from '@/hooks/useLocale'
import { DashboardNav } from './dashboard-nav'
import getNavItems from './navItems'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const dictionary = useLocale()
  const navItems = getNavItems({ dictionary })
  return (
    <nav
      className={cn(`relative hidden h-screen border-l lg:block w-72 mt-12`)}
    >
      <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
        {/* Overview */}
      </h2>
      <DashboardNav items={navItems} />
    </nav>
  )
}
