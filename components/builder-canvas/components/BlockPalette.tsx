import getTemplateFor from '@/lib/utils/getTemplateFor'
import { blockRegistry } from '../registry/blockRegistry'
import { useBuilderStore } from '../store/useBuilderStore'
import DraggableWrapper from './DraggableWrapper'

type BlockDefinition = {
  label: string
  showInBlocksList?: boolean
  inTemplateFor?: string[]
  notTemplateFor?: string[]
}

type BlockRegistry = Record<string, BlockDefinition>

type BlockPaletteProp = {
  newBlocks: BlockRegistry
}
export const BlockPalette = ({ newBlocks }: BlockPaletteProp) => {
  const { getJson } = useBuilderStore()
  const documnet = JSON.parse(getJson())
  const allBlocks: BlockRegistry = { ...blockRegistry, ...newBlocks }
  return (
    <div className="flex flex-col gap-2 p-2 max-w-80 ">
      {Object.entries(allBlocks).map(([key, block]) => {
        let visibleBlock = false
        const templateFor = getTemplateFor(documnet.templateFor)
        const exist_InTemplateFor = !!block?.inTemplateFor
        const exist_NotTemplateFor = !!block?.notTemplateFor
        if (!exist_InTemplateFor && !exist_NotTemplateFor) visibleBlock = true
        if (exist_InTemplateFor) {
          const prefix = templateFor.split('-')[0]
          if (block.inTemplateFor!.includes(prefix)) visibleBlock = true
        }
        if (exist_NotTemplateFor) {
          const prefix = templateFor.split('-')[0]
          if (!block.notTemplateFor!.includes(prefix)) visibleBlock = true
        }

        if (block.showInBlocksList && visibleBlock)
          return <DraggableWrapper key={key} type={key} label={block.label} />
      })}
    </div>
  )
}
