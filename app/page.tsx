import '@/app/globals.css'
import { getSettings } from '@/lib/features/settings/controller'
import { Settings } from '@/lib/features/settings/interface'
import AlbaFallback from '@/pages/AlbaFallback'

export const dynamic = 'force-static'

export default async function Home() {
  const siteSettings: Settings = (await getSettings()) as Settings

  return (
    <html lang="en">
      <body className={`antialiased`}>
        <AlbaFallback siteSettings={siteSettings} />
      </body>
    </html>
  )
}
