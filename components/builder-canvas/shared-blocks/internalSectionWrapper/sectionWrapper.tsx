import { Block } from '../../types'
import InternalSection from '../internalSection/internalSection'
import computedStyles from '../../utils/computedStyles'
import { Settings } from '@/lib/features/settings/interface'

type BlockProps = {
  widgetName: string
  siteSettings: Settings
  blockData: {
    content: {
      title: string
      alt: string
      description: string
      src: string
      href: string
    }
    type: 'image'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default function sectionWrapper({
  widgetName,
  siteSettings,
  blockData,
  ...props
}: BlockProps) {
  const { sections, settings, styles } = blockData
  return (
    <div
      style={{
        ...computedStyles(blockData.styles),
      }}
      {...props}
      className=""
    >
      <div className="grid grid-cols-12">
        {sections.map((section: any) => (
          <InternalSection
            siteSettings={siteSettings}
            key={section.id}
            blockData={section}
            widgetName="internalSection"
          />
        ))}
      </div>
    </div>
  )
}
