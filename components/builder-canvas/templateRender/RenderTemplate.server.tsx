'use server'
import templateCtrl from '@/lib/features/template/controller'
import { Template } from '@/lib/features/template/interface'
import RendererRows from '../pageRenderer/RenderRows'
import { Settings } from '@/lib/features/settings/interface'
import { generateResponsiveCSS } from '../utils/css-generator'

type Props = {
  template: Template
  siteSettings: Settings
  content_all: any
  editroMode: boolean
  [key: string]: any // اجازه props داینامیک مثل content_1, content_2
  pageSlug: string | null
  categorySlug?: string | null
  searchParams?: any
  locale: string
}

const RendererTemplate = async ({
  template,
  siteSettings,
  content_all,
  editroMode = false,
  pageSlug = null,
  categorySlug = null,
  searchParams = {},
  locale,
  ...rest
}: Props) => {
  const parentTemplateId = template.parent
  if (parentTemplateId) {
    const [parentTemplate] = await Promise.all([
      templateCtrl.findById({ id: parentTemplateId }),
    ])
    return (
      <>
        RendererTemplate #87687
        <style>{generateResponsiveCSS(parentTemplate)}</style>
        <RendererRows
          siteSettings={siteSettings}
          rows={parentTemplate?.content.rows}
          editroMode={false}
          pageSlug={pageSlug}
          categorySlug={categorySlug}
          searchParams={searchParams}
          locale={locale}
          content_all={
            <RendererRows
              siteSettings={siteSettings}
              rows={template?.content.rows}
              editroMode={false}
              content_all={content_all}
              pageSlug={pageSlug}
              categorySlug={categorySlug}
              searchParams={searchParams}
              locale={locale}
              {...rest}
            />
          }
        />
      </>
    )
  }

  return (
    <>
      <style>{generateResponsiveCSS(template)}</style>
      <RendererRows
        siteSettings={siteSettings}
        rows={template?.content.rows}
        editroMode={false}
        content_all={content_all}
        pageSlug={pageSlug}
        categorySlug={categorySlug}
        searchParams={searchParams}
        locale={locale}
        {...rest}
      />
    </>
  )
}

export default RendererTemplate
