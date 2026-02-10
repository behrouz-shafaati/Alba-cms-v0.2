import { resolveLocale } from '@/lib/i18n/utils/resolve-locale'
import getSlugsWithoutLocale from '@/lib/utils/getSlugsWithoutLocale'
import PageResolver from '@/pages/resolver'

type Props = {
  params: Promise<{ slugs: string[] }>
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params
  const { slugs } = resolvedParams
  const firstSlug = slugs?.[0] || null
  const locale = firstSlug || ''
  const resolvedLocale = resolveLocale({ locale })
  const slugsWithoutLocale = getSlugsWithoutLocale(slugs)
  console.log('#234987 slugs:', slugs)
  console.log('#234987 resolvedLocale:', resolvedLocale)
  console.log('#234987 slugsWithoutLocale:', slugsWithoutLocale)
  return <PageResolver locale={resolvedLocale} slugs={slugsWithoutLocale} />
}
