// ورودی اصلی صفحه‌ساز (ترکیب درگ‌اند‌دراپ و بلاک رندر)
import { Content } from './types'
import BuilderCanvas from '../builder-canvas'
import SettingsPanel from './SettingsPanel'
import { blockRegistry } from './registry/blockRegistry'

type BuilderPageProp = {
  title?: string
  name: string
  submitFormHandler: (prevState: any, formData: FormData) => Promise<any>
  initialContent?: Content
  locale: string
}

export default function BuilderForm({
  title = 'فرم ساز',
  initialContent,
  name = 'contentJson',
  submitFormHandler,
  locale,
}: BuilderPageProp) {
  return (
    <BuilderCanvas
      title={title}
      name={name}
      settingsPanel={<SettingsPanel />}
      submitFormHandler={submitFormHandler}
      initialContent={{ ...initialContent }}
      newBlocks={blockRegistry}
      locale={locale}
    />
  )
}
