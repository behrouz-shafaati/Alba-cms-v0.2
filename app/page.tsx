import '@/app/globals.css'
import { ClientProviders } from '@/components/context/ClientProviders'
import HomePage from '@/components/HomePage'
import { getDashboardDictionary } from '@/lib/i18n/dashboard'
import { resolveLocale } from '@/lib/i18n/utils/resolve-locale'
import { SupportedLanguage } from '@/lib/types'

export const dynamic = 'force-static'
import localFont from 'next/font/local'

const iransans = localFont({
  src: [
    {
      path: '../public/fonts/IRANSansX-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/IRANSansX-Medium.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/IRANSansX-DemiBold.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-iransans',
})
export default async function Home() {
  const resolvedLocale = (await resolveLocale({
    locale: '',
  })) as SupportedLanguage
  const dictionary = getDashboardDictionary(resolvedLocale)
  const dir = dictionary.dir

  return (
    <html lang={resolvedLocale} dir={dir}>
      <body className={`antialiased ${iransans.className}`}>
        <ClientProviders>
          <HomePage locale={resolvedLocale} />
        </ClientProviders>
      </body>
    </html>
  )
}
