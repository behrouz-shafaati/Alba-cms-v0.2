import { SupportedLanguage } from '@/lib/types'
import PageOrPost from './PostOrPage'
import HomePage from '@/components/HomePage'
import AuthorPage from './(author)/page'
import ArchivePage from './(archive)/page'

type Props = {
  slugs: string[]
  locale: SupportedLanguage
  searchParams: Promise<{
    query?: string
    page?: string
  }>
}

const PageResolver = ({ locale, slugs, searchParams }: Props) => {
  const firstSlug = slugs?.[0] || null
  const secendSlug = slugs?.[1] || null
  const finalSlug = slugs[slugs.length - 1]
  console.log('#3hy6 firstSlug:', firstSlug)
  console.log('#3hy6 secendSlug:', secendSlug)
  console.log('#3hy6 finalSlug:', finalSlug)
  console.log('#3hy6 locale:', locale)

  switch (firstSlug) {
    case null:
      return <HomePage locale={locale} />
    case 'install':
      return <h1>Install page</h1>
    case 'author':
      return (
        <AuthorPage
          locale={locale}
          searchParams={searchParams}
          userName={secendSlug as string}
        />
      )
    case 'archive':
      return (
        <ArchivePage
          locale={locale}
          searchParams={searchParams}
          slugs={slugs}
        />
      )
    default:
      return <PageOrPost locale={locale} slugs={slugs} pageSlug={finalSlug} />
  }
}

export default PageResolver
