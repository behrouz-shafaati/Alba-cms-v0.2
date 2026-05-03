import { Block } from '../../types'
import InternalSectionEditor from '../internalSection/internalSectionEditor'
import computedStyles from '../../utils/computedStyles'
import { combineClassNames } from '../../utils/styleUtils'

type BlockProps = {
  widgetName: string
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

export default function sectionWrapperEditor({
  widgetName,
  blockData,
  ...props
}: BlockProps) {
  const { id, sections, settings, styles } = blockData
  const responsiveDesign = settings?.responsiveDesign ?? true
  return (
    <div
      style={{
        ...computedStyles(blockData.styles),
      }}
      {...props}
      className={` ${combineClassNames(computedStyles(styles))}`}
    >
      <div className={`b${id} grid grid-cols-12`}>
        {sections.map((section: any) => (
          <InternalSectionEditor
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
