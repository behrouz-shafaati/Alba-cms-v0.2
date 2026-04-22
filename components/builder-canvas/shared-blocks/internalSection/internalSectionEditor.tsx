import { Block, Column } from '../../types'
import { Settings, SlidersVertical, X } from 'lucide-react'
import { useBuilderStore } from '../../store/useBuilderStore'
import { Button } from '@/components/ui/button'
import { useDroppable } from '@dnd-kit/core'
import SortableItem from '../../components/SortableItem'
import { combineClassNames } from '../../utils/styleUtils'
import computedStyles from '../../utils/computedStyles'

type BlockProps = {
  responsiveDesign: boolean
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

export default function InternalSection({
  responsiveDesign,
  widgetName,
  blockData,
  ...props
}: BlockProps) {
  const { sections, settings, styles } = blockData
  const { selectedBlock, selectBlock, deleteItem } = useBuilderStore()
  const { isOver, setNodeRef } = useDroppable({
    id: blockData.id,
    data: {
      type: 'internalSection',
    },
  })

  let activeClass = ''
  if (selectedBlock?.id == blockData.id)
    activeClass = ' border-2 border-fuchsia-500 border-opacity-30'

  const classBaseOnResponsiveDesign = responsiveDesign
    ? `col-span-12 md:col-span-${blockData.width}`
    : `col-span-${blockData.width}`
  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col relative border m-2 ${
        classBaseOnResponsiveDesign
      }  rounded min-h-[100px] transition-all ${combineClassNames(
        props?.className || {},
        computedStyles(styles),
      )} ${isOver ? 'bg-green-100' : ''} group/column ${activeClass}`}
    >
      <div
        key={`div-${blockData.id}`}
        className=" top-1   flex  align-middle items-center justify-between  pl-2  z-10   group-hover/row:opacity-100 transition-opacity "
      >
        <div className="flex  align-middle items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={(e) => {
              e.stopPropagation() // جلوگیری از propagate شدن به document
              selectBlock({
                id: blockData.id,
                type: 'internalSection',
                styles: blockData.styles,
                content: blockData.content,
              })
            }}
          >
            <SlidersVertical className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
        <span className="text-xs">ستون داخلی</span>
      </div>

      <div
        style={{ ...computedStyles(styles), ...computedStyles(settings) }}
        className={`b${blockData.id} ${combineClassNames(computedStyles(styles))}`}
      >
        {blockData?.blocks?.map((el: any, index: number) => (
          <div key={el?.id} className="p-1">
            <SortableItem
              item={el}
              index={index}
              colId={blockData.id}
              parentType="internalSection"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
