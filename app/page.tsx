import '@/app/globals.css'
import { ClientProviders } from '@/components/context/ClientProviders'
import HomePage from '@/components/HomePage'
import { getDashboardDictionary } from '@/lib/i18n/dashboard'
import { resolveLocale } from '@/lib/i18n/utils/resolve-locale'
import { SupportedLanguage } from '@/lib/types'

import localFont from 'next/font/local'
import { Suspense } from 'react'

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
const Page_ = async () => {
  const resolvedLocale = (await resolveLocale({
    locale: '',
  })) as SupportedLanguage
  const dictionary = getDashboardDictionary(resolvedLocale)
  const dir = dictionary.dir

  return (
    <html lang={resolvedLocale} dir={dir}>
      <body className={`antialiased ${iransans.className}`}>
        <ClientProviders locale={resolvedLocale}>
          <HomePage locale={resolvedLocale} />
        </ClientProviders>
      </body>
    </html>
  )
}

export default async function Page() {
  return (
    <html lang="en" dir="ltr">
      <body className={`antialiased ${iransans.className}`}>
        <Suspense fallback="loading Home page...">
          <Page_ />
        </Suspense>
      </body>
    </html>
  )
}
