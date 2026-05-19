import Header from '@/components/dashboard/header'
import Sidebar from '@/components/dashboard/sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getSession } from '@/lib/auth/get-session'
import { getSettingsAction } from '@/lib/features/settings/actions'
import { resolveLocale } from '@/lib/i18n/utils/resolve-locale'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const [settings, user] = await Promise.all([
    getSettingsAction(),
    getSession()?.user,
  ])
  const { resolvedLocale: locale, dir } = await resolveLocale({ user })
  return (
    <>
      <Header siteSettings={settings} locale={locale} />
      <div className="flex md:h-screen auto-rows-max">
        <ScrollArea>
          <Sidebar />
        </ScrollArea>
        <ScrollArea className="w-full mt-[54px]">{children}</ScrollArea>
      </div>
    </>
  )
}
