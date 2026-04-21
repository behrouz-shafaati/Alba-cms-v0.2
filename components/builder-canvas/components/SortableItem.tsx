import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { blockRegistry } from '../registry/blockRegistry'
import { blockRegistry as pageBlockRegistery } from '@/components/builder-page/registry/blockRegistry'
import { Block } from '../types'
import {
  Copy,
  GripHorizontal,
  GripVertical,
  Settings,
  SlidersVertical,
  Trash,
  X,
} from 'lucide-react'
import { useBuilderStore } from '../store/useBuilderStore'
import { Button } from '@/components/ui/button'
import { combineClassNames } from '../utils/styleUtils'
import addBlockToContainer from '../utils/addBlockToContainer'
import findElementContainer from '../utils/findElementContainer'
import { regenerateAllIds } from '../utils/regenerateAllIds'

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
  const { content, selectBlock, deleteItem, selectedBlock, setContent } =
    useBuilderStore()
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.id,
      data: { type: item.type, parentId: colId, parentType },
    })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  const allBlocks = { ...blockRegistry, ...pageBlockRegistery, ...newBlocks }
  const block = allBlocks[item.type]
  const Component = block?.RendererInEditor || block?.Renderer

  let activeClass = ''
  if (selectedBlock?.id == item.id)
    activeClass = ' border-2 border-fuchsia-500 border-opacity-30'

  const targetContainer = findElementContainer(content, String(item.id))
  const duplicateItem = () => {
    const newContent = addBlockToContainer(
      content,
      targetContainer.id,
      regenerateAllIds(item),
      'end',
    )
    setContent(newContent)
  }
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={style}
      className={` relative group/item border my-2 ${activeClass}`}
      onClick={(e: any) => {
        e.stopPropagation() // جلوگیری از propagate شدن به document
        selectBlock(item)
      }}
    >
      <div
        className={` z-10 flex flex-row justify-between align-middle items-center p-1 transition-opacity group-hover/item:opacity-100 bg-amber-50 dark:bg-gray-800  ${
          item.type === 'internalSection' ? '-bottom-6' : '-top-6'
        }`}
      >
        <div className="flex flex-row align-middle items-center">
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
          <div {...listeners} className="px-2">
            <GripVertical className="w-5 h-5  text-gray-400 cursor-grab" />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => duplicateItem()}
          >
            <Copy className="w-5 h-5 text-gray-500" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={(e) => {
              e.stopPropagation() // جلوگیری از propagate شدن به document
              deleteItem(item.id)
            }}
          >
            <X className="w-5 h-5 text-gray-500" />
          </Button>
        </div>
        <span className="text-xs">{block.label}</span>
      </div>
      <div className="block-wrapper [&_a]:pointer-events-none [&_a]:cursor-default">
        {block ? (
          <Component
            widgetName={block.label}
            blockData={item}
            className={`b${item.id}`}
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
