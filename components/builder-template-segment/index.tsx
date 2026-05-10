import BuilderCanvas from '../builder-canvas'
import SettingsPanel from './SettingsPanel'
import { blockRegistry } from './registry/blockRegistry'

type BuilderHeadreProps = {
  templateSegmentId: string
  settings: any
  name: string
  submitFormHandler: (prevState: any, formData: FormData) => Promise<any>
  initialContent?: any
  locale: string
}

const BuilderTemplateSegment = ({
  templateSegmentId,
  settings,
  name = 'contentJson',
  submitFormHandler,
  initialContent,
  locale,
}: BuilderHeadreProps) => {
  console.log('#234 initialContent in BuilderTemplateSegment:', initialContent)
  return (
    <BuilderCanvas
      title="قطعه قالب ساز"
      name={name}
      Header={null}
      initialContent={initialContent}
      SettingsPanel={
        <SettingsPanel
          templateSegmentId={templateSegmentId}
          siteSettings={settings}
          locale={locale}
        />
      }
      submitFormHandler={submitFormHandler}
      newBlocks={blockRegistry}
      locale={locale}
    />
  )
}

export default BuilderTemplateSegment
