import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Row } from '../../types'
import {
  Copy,
  GripVertical,
  Plus,
  Settings,
  SlidersVertical,
  Trash,
  X,
} from 'lucide-react'
import DroppableColumn from '../column/DroppableColumn'
import { useBuilderStore } from '../../store/useBuilderStore'
import { Button } from '@/components/ui/button'
import { combineClassNames } from '../../utils/styleUtils'
import computedStyles from '../../utils/computedStyles'
import ResponsiveStyle from '@/components/other/ResponsiveStyle'
import { regenerateAllIds } from '../../utils/regenerateAllIds'

export default function SortableRow({
  row,
  newBlocks,
  index,
}: {
  row: Row
  newBlocks: any
  index: number
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: row.id,
      data: {
        type: 'row',
      },
    })

  const { deleteItem, selectBlock, activeElement, selectedBlock, addRow } =
    useBuilderStore()
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: activeElement?.type === 'row' ? '16px' : '0',
  }

  let activeClass = ''
  if (selectedBlock?.id == row.id)
    activeClass = ' border-2 border-fuchsia-500 border-opacity-30'

  let stickyClass = ''
  if (row?.settings?.sticky || false) stickyClass = 'sticky top-0 z-50'
  return (
    <div className={`${stickyClass} ${activeClass}`}>
      {/* <ResponsiveStyle selector={`row_${row.id}`} styles={row.styles?.css} /> */}
      <div
        ref={setNodeRef}
        {...attributes}
        style={{
          ...style,
          ...computedStyles(row.styles),
        }}
        key={`${row.id}`}
        className={`row_${row.id} border rounded cursor-default relative group/row transition-all duration-300 ease-in-out ${combineClassNames(
          computedStyles(row.styles),
        )}`}
      >
        <div
          key={`div-${row.id}`}
          className=" top-1 flex  align-middle items-center justify-between pl-2 z-10 group-hover/row:opacity-100 transition-opacity bg-amber-50 dark:bg-gray-800"
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
                  id: row.id,
                  type: 'row',
                  styles: row.styles,
                  settings: row.settings,
                })
              }}
            >
              <SlidersVertical className="h-5 w-5 text-gray-500" />
            </Button>
            <div {...listeners} className="p-1.5">
              <GripVertical
                className="h-5 w-5  text-gray-400 cursor-grab "
                key={`gri-${row.id}`}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => addRow(index)}
              className="size-8"
            >
              <Plus className="h-5 w-5 text-gray-500" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => addRow(index, regenerateAllIds(row))}
            >
              <Copy className="w-5 h-5 text-gray-500" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => deleteItem(row.id)}
            >
              <X className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
          <span className="text-xs">سطر</span>
        </div>

        <div key={`div-col-${row.id}`} className="grid grid-cols-12 p-1">
          {row.columns.map((col) => (
            <DroppableColumn
              key={`drop-${col.id}`}
              rowId={row.id}
              col={col}
              newBlocks={newBlocks}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
