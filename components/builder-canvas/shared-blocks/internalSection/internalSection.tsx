import { Block } from '../../types'
import { combineClassNames } from '../../utils/styleUtils'
import RenderBlock from '../../pageRenderer/RenderBlock'
import { Settings } from '@/lib/features/settings/interface'
import Image from 'next/image'
import ResponsiveStyle from '@/components/other/ResponsiveStyle'
import computedStyles from '../../utils/computedStyles'

type BlockProps = {
  responsiveDesign: boolean
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

export default function InternalSection({
  responsiveDesign,
  widgetName,
  siteSettings,
  blockData,
  ...props
}: BlockProps) {
  const { sections, settings, styles } = blockData
  const classBaseOnResponsiveDesign = responsiveDesign
    ? `col-span-12 md:col-span-${blockData.width}`
    : `col-span-${blockData.width}`
  return (
    <div
      data-InternalSection
      className={`section_${blockData.id} relative flex flex-col ${classBaseOnResponsiveDesign}   ${combineClassNames(styles?.tailwindClasses || {})}`}
      style={{ ...computedStyles(styles), ...computedStyles(settings) }}
    >
      <ResponsiveStyle
        selector={`section_${blockData.id}`}
        styles={blockData.styles?.css}
      />
      {settings?.bgMedia && (
        <Image
          src={settings?.bgMedia?.srcMedium}
          alt="ALBA CMS Hero"
          fill
          priority
          className="object-cover"
        />
      )}

      {blockData?.blocks?.map((el: any, index: number) => (
        <RenderBlock
          siteSettings={siteSettings}
          key={el?.id}
          item={el}
          index={index}
          colId={blockData.id}
          parentType="internalSection"
        />
      ))}
    </div>
  )
}
