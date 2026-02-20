import { Block } from '../../types'
import { combineClassNames, computedStyles } from '../../utils/styleUtils'
import RenderBlock from '../../pageRenderer/RenderBlock'
import { Settings } from '@/lib/features/settings/interface'
import Image from 'next/image'

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

export default function InternalSection({
  widgetName,
  siteSettings,
  blockData,
  ...props
}: BlockProps) {
  const { sections, settings, styles } = blockData

  return (
    <div
      className={`relative flex flex-col relative col-span-${
        blockData?.width || 1
      }   ${combineClassNames(props?.className || {}, computedStyles(styles))}`}
      style={{ ...computedStyles(styles) }}
    >
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
