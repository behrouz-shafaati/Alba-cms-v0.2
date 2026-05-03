import { Block } from '../../types'
import InternalSection from '../internalSection/internalSection'
import computedStyles from '../../utils/computedStyles'
import { Settings } from '@/lib/features/settings/interface'
import { combineClassNames, getVisibilityClass } from '../../utils/styleUtils'

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
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default function sectionWrapper({
  widgetName,
  siteSettings,
  blockData,
  ...props
}: BlockProps) {
  const { sections, content, styles } = blockData
  const responsiveDesign = content?.responsiveDesign ?? true

  const visibility: any = styles?.visibility
  const visibilityClassName = getVisibilityClass(visibility, {
    display: 'grid',
  })
  return (
    <div
      style={{
        ...computedStyles(blockData.styles),
      }}
      {...props}
      className={`b${blockData.id} ${visibilityClassName} ${combineClassNames(computedStyles(styles))}`}
    >
      <div className="grid grid-cols-12 gap-4">
        {sections.map((section: any) => (
          <InternalSection
            siteSettings={siteSettings}
            key={section.id}
            blockData={section}
            widgetName="internalSection"
            responsiveDesign={responsiveDesign}
          />
        ))}
      </div>
    </div>
  )
}
