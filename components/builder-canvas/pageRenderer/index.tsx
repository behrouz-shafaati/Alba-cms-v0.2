// رندر کردن بلاک‌ها از روی JSON

import { Page } from '@/lib/features/page/interface'
import RendererRows from './RenderRows'
import templateCtrl from '@/lib/features/template/controller'
import { getSettings } from '@/lib/features/settings/controller'
import RendererTemplate from '../templateRender/RenderTemplate.server'
import { Settings } from '@/lib/features/settings/interface'
import { generateResponsiveCSS } from '../utils/css-generator'

type Props = {
  locale: string
  page: Page
  searchParams?: any
}

export const PageRenderer = async ({
  page,
  locale = 'fa',
  searchParams = {},
}: Props) => {
  console.log('#@#d43 resolvedLocale in page render:', locale)
  const translation: any =
    page?.translations?.find((t: any) => t.locale === locale) ||
    page?.translations[0] ||
    {}
  const { template: templateId } = translation.content

  const siteSettings = (await getSettings()) as Settings

  if (templateId && templateId !== 'none') {
    const [template] = await Promise.all([
      templateCtrl.findById({ id: templateId }),
    ])

    return (
      <>
        <p>hhhhhhhhhhhhhhhhhhhhhh</p>
        <style id="44558899">{generateResponsiveCSS(translation)}</style>
        <RendererTemplate
          template={template}
          pageSlug={page?.slug}
          siteSettings={siteSettings}
          searchParams={searchParams}
          rows={template.content.rows}
          editroMode={false}
          locale={locale}
          content_all={
            <RendererRows
              rows={translation?.content.rows}
              editroMode={false}
              siteSettings={siteSettings}
              searchParams={searchParams}
              locale={locale}
            />
          }
        />
      </>
    )
  }

  return (
    <>
      <style id="44558899">{generateResponsiveCSS(translation)}</style>
      <RendererRows
        locale={locale}
        siteSettings={siteSettings}
        rows={translation?.content.rows}
        editroMode={false}
        searchParams={searchParams}
      />
    </>
  )
}
