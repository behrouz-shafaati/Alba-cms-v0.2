import '@/app/globals.css'
import { resolveLocale } from '@/lib/i18n/utils/resolve-locale'
import getSlugsWithoutLocale from '@/lib/utils/getSlugsWithoutLocale'
import PageResolver from '@/app/(client)/[...slugs]/resolver'
import { SupportedLanguage } from '@/lib/types'
import { getDirection } from '@/lib/i18n/utils/getDirection'
import localFont from 'next/font/local'
import { ServerProviders } from '@/components/context/ServerProviders'
import { Toaster } from '@/components/ui/sonner'

const iransans = localFont({
  src: [
    {
      path: '../../../public/fonts/IRANSansX-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/IRANSansX-Medium.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/IRANSansX-DemiBold.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-iransans',
})

type Props = {
  params: Promise<{ slugs: string[] }>
  searchParams: Promise<{
    query?: string
    page?: string
  }>
}

export default async function Page({ params, searchParams }: Props) {
  const resolvedParams = await params
  let { slugs } = resolvedParams
  slugs = slugs.map((slug) => decodeURI(slug))
  const firstSlug = slugs?.[0] || null
  const locale = firstSlug || ''
  const resolvedLocale = (await resolveLocale({ locale })) as SupportedLanguage
  const slugsWithoutLocale = getSlugsWithoutLocale(slugs)
  // console.log('#234987 slugs:', slugs)
  console.log('#234987 resolvedLocale:', resolvedLocale)
  // console.log('#234987 slugsWithoutLocale:', slugsWithoutLocale)
  const dir = getDirection(resolvedLocale)

  return (
    <html lang={resolvedLocale} dir={dir}>
      <body className={iransans.className}>
        {/* <ServerProviders dictionary={dictionary}>{children}</ServerProviders> */}
        <ServerProviders locale={resolvedLocale}>
          <PageResolver
            locale={resolvedLocale}
            slugs={slugsWithoutLocale}
            searchParams={searchParams}
          />
        </ServerProviders>
        <Toaster />
      </body>
    </html>
  )
}
