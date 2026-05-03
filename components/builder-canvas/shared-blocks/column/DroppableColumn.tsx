import { Column } from '../../types'
import { SlidersVertical } from 'lucide-react'
import { useBuilderStore } from '../../store/useBuilderStore'
import { Button } from '@/components/ui/button'
import { useDroppable } from '@dnd-kit/core'
import SortableItem from '../../components/SortableItem'
import { combineClassNames } from '../../utils/styleUtils'
import computedStyles from '../../utils/computedStyles'

type DroppableColumnProp = {
  rowId: string
  col: Column
  newBlocks: any
  locale: string
}

export default function DroppableColumn({
  rowId,
  col,
  newBlocks,
  locale,
}: DroppableColumnProp) {
  const { isOver, setNodeRef } = useDroppable({
    id: col.id,
    data: {
      type: 'column',
      parentId: rowId,
    },
  })

  const { selectBlock, activeElement, selectedBlock } = useBuilderStore()

  let activeClass = ''
  if (selectedBlock?.id == col.id)
    activeClass = 'border-2 border-fuchsia-500 border-opacity-30'
  return (
    <div
      data-col
      ref={setNodeRef}
      className={`flex flex-col relative border border-amber-700 my-1 col-span-${
        col.colspan
      }   min-h-[100px] transition-all ${combineClassNames(
        col.classNames || {},
        computedStyles(col.styles),
      )} ${isOver ? 'bg-green-100' : ''} group/column ${activeClass}`}
    >
      <div className="flex align-middle items-center justify-between  pl-2 gap-2 z-10  group-hover/column:opacity-100 transition-opacity bg-amber-50 dark:bg-gray-800">
        <div className="flex align-middle items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={(e) => {
              e.stopPropagation() // جلوگیری از propagate شدن به document
              selectBlock({
                id: col?.id,
                type: 'column',
                styles: col?.styles,
                content: col?.content,
              })
            }}
          >
            <SlidersVertical className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
        <span className="text-xs">ستون</span>
      </div>
      <div
        className={`b${col.id} p-1`}
        style={{
          ...computedStyles(col.styles),
          ...computedStyles(col?.content),
        }}
      >
        {col.blocks.map((el: any, index: number) => (
          <SortableItem
            key={el.id}
            item={el}
            index={index}
            colId={col.id}
            newBlocks={newBlocks}
            locale={locale}
          />
        ))}
      </div>
    </div>
  )
}
