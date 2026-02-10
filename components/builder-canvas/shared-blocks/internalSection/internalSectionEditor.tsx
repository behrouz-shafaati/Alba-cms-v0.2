import { Block, Column } from '../../types'
import { Settings, SlidersVertical, X } from 'lucide-react'
import { useBuilderStore } from '../../store/useBuilderStore'
import { Button } from '@/components/ui/button'
import { useDroppable } from '@dnd-kit/core'
import SortableItem from '../../components/SortableItem'
import { combineClassNames, computedStyles } from '../../utils/styleUtils'

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

export default function InternalSection({
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
  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col relative border m-2  col-span-${
        blockData?.width || 1
      }  rounded min-h-[100px] transition-all ${combineClassNames(
        props?.className || {},
        computedStyles(styles),
      )} ${isOver ? 'bg-green-100' : ''} group/column ${activeClass}`}
      style={{ ...computedStyles(styles) }}
    >
      <div
        key={`div-${blockData.id}`}
        className=" top-1   flex  align-middle items-center  pl-2  z-10   group-hover/row:opacity-100 transition-opacity "
      >
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
              settings: blockData.settings,
            })
          }}
        >
          <SlidersVertical className="h-5 w-5 text-gray-500" />
        </Button>
        {/* <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => addRow(index)}
            className="size-8"
          >
            <Plus className="h-5 w-5 text-gray-500" />
          </Button> */}

        {/* <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => deleteItem(blockData.id)}
        >
          <X className="h-5 w-5 text-gray-500" />
        </Button> */}
      </div>

      {blockData?.blocks?.map((el: any, index: number) => (
        <SortableItem
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
