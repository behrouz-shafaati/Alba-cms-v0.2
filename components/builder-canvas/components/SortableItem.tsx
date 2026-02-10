import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { blockRegistry } from '../registry/blockRegistry'
import { Block } from '../types'
import {
  GripHorizontal,
  GripVertical,
  Settings,
  SlidersVertical,
  Trash,
  X,
} from 'lucide-react'
import { useBuilderStore } from '../store/useBuilderStore'
import { Button } from '@/components/ui/button'
import { combineClassNames, computedStyles } from '../utils/styleUtils'

type SortableItemProp = {
  item: Block
  index: number
  colId: string
  parentType?: string
  newBlocks?: any
}
export default function SortableItem({
  item,
  index,
  colId,
  parentType = 'column',
  newBlocks = {},
}: SortableItemProp) {
  const { selectBlock, deleteItem, selectedBlock } = useBuilderStore()
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.id,
      data: { type: item.type, parentId: colId, parentType },
    })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  const allBlocks = { ...blockRegistry, ...newBlocks }
  const block = allBlocks[item.type]
  const Component = block?.RendererInEditor || block?.Renderer

  let activeClass = ''
  if (selectedBlock?.id == item.id)
    activeClass = ' border-2 border-fuchsia-500 border-opacity-30'

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={style}
      className={` relative group/item border  ${activeClass}`}
      onClick={(e: any) => {
        e.stopPropagation() // جلوگیری از propagate شدن به document
        selectBlock(item)
      }}
    >
      <div
        className={` z-10 flex flex-row align-middle items-center p-1 transition-opacity group-hover/item:opacity-100 bg-amber-50 dark:bg-gray-800  ${
          item.type === 'internalSection' ? '-bottom-6' : '-top-6'
        }`}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={(e: any) => {
            e.stopPropagation() // جلوگیری از propagate شدن به document
            selectBlock(item)
          }}
        >
          <SlidersVertical className="w-5 h-5 text-gray-500" />
        </Button>
        <div {...listeners}>
          <GripVertical className="w-5 h-5  text-gray-400 cursor-grab" />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => deleteItem(item.id)}
        >
          <X className="w-5 h-5 text-gray-500" />
        </Button>
      </div>
      <div className="block-wrapper [&_a]:pointer-events-none [&_a]:cursor-default [&_a]:text-muted-foreground">
        {block ? (
          <Component
            widgetName={block.label}
            blockData={item}
            className={`${combineClassNames(item.classNames || {}, computedStyles(item.styles))}`}
          />
        ) : (
          <span className="rounded bg-red-600 text-gray-50">
            این بلاک مشکل دارد
          </span>
        )}
      </div>
    </div>
  )
}
