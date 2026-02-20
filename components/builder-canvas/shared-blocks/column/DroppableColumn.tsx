import { Column } from '../../types'
import { Settings, SlidersVertical } from 'lucide-react'
import { useBuilderStore } from '../../store/useBuilderStore'
import { Button } from '@/components/ui/button'
import { useDroppable } from '@dnd-kit/core'
import SortableItem from '../../components/SortableItem'
import { combineClassNames, computedStyles } from '../../utils/styleUtils'

type DroppableColumnProp = {
  rowId: string
  col: Column
  newBlocks: any
}

export default function DroppableColumn({
  rowId,
  col,
  newBlocks,
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
      ref={setNodeRef}
      className={`flex flex-col relative border border-amber-700   col-span-${
        col.width
      }   min-h-[100px] transition-all ${combineClassNames(
        col.classNames || {},
        computedStyles(col.styles),
      )} ${isOver ? 'bg-green-100' : ''} group/column ${activeClass}`}
      style={{ ...computedStyles(col.styles), ...computedStyles(col.settings) }}
    >
      <div
        key={`div-${col?.id}`}
        className="align-middle items-center justify-between pl-2 gap-2 z-10  group-hover/column:opacity-100 transition-opacity bg-amber-50 dark:bg-gray-800"
      >
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
              settings: col?.settings,
            })
          }}
        >
          <SlidersVertical className="h-5 w-5 text-gray-500" />
        </Button>
      </div>

      {col.blocks.map((el: any, index: number) => (
        <SortableItem
          key={el.id}
          item={el}
          index={index}
          colId={col.id}
          newBlocks={newBlocks}
        />
      ))}
    </div>
  )
}
