import { useBuilderStore } from '../store/useBuilderStore'
import CanvasTools from './CanvasTools'
import ToolsSectionBlock from './toolsSectionBlock'

type ToolsSectionProp = {
  SettingsPanel: React.ReactNode
  savePage: () => void
  newBlocks?: any
}

export default function ToolsSection({
  SettingsPanel,
  savePage,
  newBlocks = [],
}: ToolsSectionProp) {
  const selectedBlock = useBuilderStore((s) => s.selectedBlock)
  if (selectedBlock == null)
    // Dragable blocks list
    return <CanvasTools newBlocks={newBlocks} />
  if (selectedBlock == 'settings-panel')
    return <div className="min-h-[calc(100vh-104px)] p-4">{SettingsPanel}</div>
  // Settings blocks
  return <ToolsSectionBlock savePage={savePage} newBlocks={newBlocks} />
}
