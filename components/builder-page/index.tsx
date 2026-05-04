// ورودی اصلی صفحه‌ساز (ترکیب درگ‌اند‌دراپ و بلاک رندر)
import { PageContent } from './types'
import BuilderCanvas from '../builder-canvas'
import SettingsPanel from './SettingsPanel'
import { Category } from '@/lib/features/category/interface'
import { blockRegistry } from './registry/blockRegistry'
import Header from './Header'
// import { blockRegistry as templatePartBlockregistry } from '../builder-template-part/registry/blockRegistry'

type BuilderPageProp = {
  pageId: string
  settings: any
  title?: string
  name: string
  submitFormHandler: (prevState: any, formData: FormData) => Promise<any>
  initialContent?: PageContent
  allTemplates: PageContent[]
  allCategories: Category[]
  locale: string
}

export default function BuilderPage({
  pageId,
  settings,
  title = 'صفحه ساز',
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
      Header={<Header locale={locale} />}
      SettingsPanel={
        <SettingsPanel
          pageId={pageId}
          siteSettings={settings}
          allCategories={allCategories}
          allTemplates={allTemplates}
          locale={locale}
        />
      }
      submitFormHandler={submitFormHandler}
      initialContent={initialContent}
      newBlocks={{ ...blockRegistry }}
      locale={locale}
      // newBlocks={{ ...blockRegistry, ...templatePartBlockregistry }}
    />
  )
}
