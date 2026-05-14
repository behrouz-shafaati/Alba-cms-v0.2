// /app/[..slugs]/[[...filters]]/page.tsx
import ArchivePost from '@/components/archive'
import RendererRows from '@/components/builder-canvas/pageRenderer/RenderRows'
import { getSettings } from '@/lib/features/settings/controller'
import templateCtrl from '@/lib/features/template/controller'
import extractFiltersFromParams from '@/lib/utils/extractFiltersFromParams'

type Prop = {
  locale: string
  slugs?: string[]
  searchParams: Promise<{
    query?: string
    page?: string
    perPage?: string
  }>
}

export default async function ArchivePage({
  locale,
  slugs,
  searchParams,
}: Prop) {
  const resolvedSearchParams = await searchParams
  const { query = '', page = '1', perPage = '10' } = resolvedSearchParams
  const filters: Record<string, string[]> = extractFiltersFromParams(
    slugs?.slice(1),
  )
  const [siteSettings, template] = await Promise.all([
    getSettings(),
    templateCtrl.getTemplate({ slug: 'archive', locale }),
  ])
  if (template) {
    return (
      <>
        <RendererRows
          siteSettings={siteSettings}
          rows={template.content.rows}
          editroMode={false}
          content_all={
            <ArchivePost
              locale={locale}
              filters={filters}
              page={parseInt(page)}
              perPage={parseInt(perPage)}
            />
          }
        />
      </>
    )
  }
  return (
    <ArchivePost
      locale={locale}
      filters={filters}
      page={parseInt(page)}
      perPage={parseInt(perPage)}
    />
  )
}
