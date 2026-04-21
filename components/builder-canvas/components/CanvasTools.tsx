import { BlockPalette } from './BlockPalette'

type ToolsSectionProp = {
  settingsPanel: React.ReactNode
  newBlocks: any
}

export default function CanvasTools({ newBlocks = [] }: ToolsSectionProp) {
  return (
    <div className="min-h-screen">
      <BlockPalette newBlocks={newBlocks} />
    </div>
  )
}
