import { SupportedLanguage } from '@/lib/types'
import Page from './page/page'

type Props = {
  slugs: string[]
  locale: SupportedLanguage
}

const PageResolver = ({ locale, slugs }: Props) => {
  const firstSlug = slugs?.[0] || null
  const secendSlug = slugs?.[1] || null
  const finalSlug = slugs[slugs.length - 1]
  console.log('#3hy6 firstSlug:', firstSlug)
  console.log('#3hy6 secendSlug:', secendSlug)
  console.log('#3hy6 finalSlug:', finalSlug)
  console.log('#3hy6 locale:', locale)

  switch (firstSlug) {
    case null:
      return <h1>Home page</h1>
    default:
      return <Page locale={locale} pageSlug={finalSlug} />
  }
}

export default PageResolver
