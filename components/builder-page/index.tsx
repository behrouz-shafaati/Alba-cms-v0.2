// ورودی اصلی صفحه‌ساز (ترکیب درگ‌اند‌دراپ و بلاک رندر)
import { PageContent } from './types'
import BuilderCanvas from '../builder-canvas'
import SettingsPanel from './SettingsPanel'
import { Category } from '@/lib/features/category/interface'
import { blockRegistry } from './registry/blockRegistry'
// import { blockRegistry as templatePartBlockregistry } from '../builder-template-part/registry/blockRegistry'

type BuilderPageProp = {
  settings: any
  title?: string
  name: string
  submitFormHandler: (prevState: any, formData: FormData) => Promise<any>
  initialContent?: PageContent
  allTemplates: PageContent[]
  allCategories: Category[]
  locale: string
}

const defaultInitialValue = {
  title: '',
  type: 'page',
  status: 'published',
  rows: [],
}

export default function BuilderPage({
  settings,
  title = 'صفحه ساز',
  initialContent = defaultInitialValue,
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
      settingsPanel={
        <SettingsPanel
          settings={settings}
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
