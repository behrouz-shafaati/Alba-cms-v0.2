import { Block } from '../../types'
import InternalSectionEditor from '../internalSection/internalSectionEditor'
import computedStyles from '../../utils/computedStyles'

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
          <InternalSectionEditor
            key={section.id}
            blockData={section}
            widgetName="internalSection"
          />
        ))}
      </div>
    </div>
  )
}
