// ورودی اصلی صفحه‌ساز (ترکیب درگ‌اند‌دراپ و بلاک رندر)
import { PageContent } from './types'
import BuilderCanvas from '../builder-canvas'
import SettingsPanel from './SettingsPanel'
import { Category } from '@/lib/features/category/interface'
import { blockRegistry } from './registry/blockRegistry'
import { blockRegistry as pageBlockregistry } from '../builder-page/registry/blockRegistry'
import { Template } from '@/lib/features/template/interface'

type BuilderPageProp = {
  templateId: string
  settings: any
  title?: string
  name: string
  submitFormHandler: (prevState: any, formData: FormData) => Promise<any>
  initialContent?: PageContent
  allTemplates: Template[]
  allCategories: Category[]
  locale: string
}

export default function BuilderTemplate({
  templateId,
  settings,
  title = 'قالب ساز',
  initialContent,
  name = 'contentJson',
  submitFormHandler,
  allTemplates,
  allCategories,
  locale,
}: BuilderPageProp) {
  return (
    <BuilderCanvas
      title={title}
      name={name}
      Header={null}
      SettingsPanel={
        <SettingsPanel
          templateId={templateId}
          siteSettings={settings}
          allCategories={allCategories}
          allTemplates={allTemplates}
          locale={locale}
        />
      }
      submitFormHandler={submitFormHandler}
      initialContent={initialContent}
      newBlocks={{ ...pageBlockregistry, ...blockRegistry }}
      locale={locale}
    />
  )
}
