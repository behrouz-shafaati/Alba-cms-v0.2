import Header from '@/components/dashboard/header'
import Sidebar from '@/components/dashboard/sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getSettingsAction } from '@/lib/features/settings/actions'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const settings = await getSettingsAction()
  return (
    <>
      <Header siteSettings={settings} />
      <div className="flex md:h-screen auto-rows-max">
        <ScrollArea>
          <Sidebar />
        </ScrollArea>
        <ScrollArea className="w-full mt-[54px]">{children}</ScrollArea>
      </div>
    </>
  )
}
