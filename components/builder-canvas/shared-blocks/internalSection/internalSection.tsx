import { Block } from '../../types'
import { combineClassNames, getVisibilityClass } from '../../utils/styleUtils'
import RenderBlock from '../../pageRenderer/RenderBlock'
import { Settings } from '@/lib/features/settings/interface'
import Image from 'next/image'
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
  const { content, styles } = blockData
  const classBaseOnResponsiveDesign = responsiveDesign
    ? `col-span-12 md:col-span-${blockData.colspan}`
    : `col-span-${blockData.colspan}`

  const visibilityInnerCol: any = styles?.visibility
  const visibilityInnerColClassName = getVisibilityClass(visibilityInnerCol, {
    display: 'flex',
  })
  return (
    <div
      data-InternalSection
      className={`b${blockData.id} relative  ${classBaseOnResponsiveDesign}  ${visibilityInnerColClassName}  ${combineClassNames(computedStyles(styles))}`}
      style={{ ...computedStyles(styles), ...computedStyles(content) }}
    >
      {content?.bgMedia && (
        <Image
          src={content?.bgMedia?.srcMedium}
          alt="ALBA CMS Hero"
          fill
          priority
          className="object-cover"
        />
      )}

      {blockData?.blocks?.map((el: any, index: number) => {
        const visibility: any = el.styles?.visibility
        const visibilityClassName = getVisibilityClass(visibility, {
          display: el?.constValues?.display || 'block',
        })
        return (
          <RenderBlock
            siteSettings={siteSettings}
            key={el?.id}
            item={el}
            index={index}
            colId={blockData.id}
            parentType="internalSection"
            className={`${visibilityClassName} ${combineClassNames(
              computedStyles(el?.styles),
            )}`}
          />
        )
      })}
    </div>
  )
}
