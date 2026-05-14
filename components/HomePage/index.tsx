import { getSettings } from '@/lib/features/settings/controller'
import { Settings } from '@/lib/features/settings/interface'
import { PageRenderer } from '../builder-canvas/pageRenderer'
import AlbaFallback from '@/pages/AlbaFallback'
import pageCtrl from '@/lib/features/page/controller'

type props = { locale?: string | null }

export default async function HomePage({ locale = null }: props) {
  'use cache'
  const siteSettings: Settings = (await getSettings()) as Settings

  const [homePage] = await Promise.all([pageCtrl?.getHomePage()])
  console.log('#23477 resolvedLocale:', locale)
  const searchParams = {}
  console.log('#234234 homePage:', homePage)
  if (homePage != null) {
    return (
      <PageRenderer
        page={homePage}
        locale={locale}
        searchParams={searchParams}
      />
    )
  }
  return <AlbaFallback siteSettings={siteSettings} />
}
