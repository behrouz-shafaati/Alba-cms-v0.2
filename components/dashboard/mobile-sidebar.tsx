'use client'
import { DashboardNav } from './dashboard-nav'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import getNavItems from './navItems'
import { MenuIcon } from 'lucide-react'
import { useState } from 'react'
import { useLocale } from '@/hooks/useLocale'

// import { Playlist } from "../data/playlists";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  // playlists: Playlist[];
}

export function MobileSidebar({ className }: SidebarProps) {
  const dictionary = useLocale()
  const navItems = getNavItems({ dictionary })
  const [open, setOpen] = useState(false)
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="right" className="!px-0">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Overview
              </h2>
              <div className="space-y-1">
                <DashboardNav items={navItems} setOpen={setOpen} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
