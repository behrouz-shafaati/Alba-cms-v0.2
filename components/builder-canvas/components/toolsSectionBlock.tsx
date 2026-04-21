import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BlockSettingsForm } from '../settings-panel/BlockSettingsForm'
import { PublicStylesForm } from '../settings-panel/SharedStylesPanel'
import { useBuilderStore } from '../store/useBuilderStore'
import { blockRegistry } from '../registry/blockRegistry'

type ToolsSectionBlockProps = {
  savePage: () => void
  newBlocks: any
}

export default function ToolsSectionBlock({
  savePage,
  newBlocks,
}: ToolsSectionBlockProps) {
  const { selectedBlock } = useBuilderStore()
  if (!selectedBlock) return null
  const allBlocks = { ...blockRegistry, ...newBlocks }
  const blockDef = allBlocks[selectedBlock.type]
  console.log('#234 bkjhb selectedBlock ', selectedBlock)
  return (
    <>
      <span className="sticky top-0 flex justify-center bg-slate-900 py-2 z-10">
        {blockDef?.label}
      </span>
      <Tabs
        defaultValue="special-settings"
        className="rtl relative min-h-screen"
      >
        <TabsList className="sticky top-10 w-full z-10">
          <TabsTrigger value="special-settings">اختصاصی</TabsTrigger>
          <TabsTrigger value="public-settings">عمومی</TabsTrigger>
        </TabsList>
        <TabsContent value="special-settings" className="p-4">
          <BlockSettingsForm savePage={savePage} blockDef={blockDef} />
        </TabsContent>
        <TabsContent value="public-settings" className="p-4">
          <PublicStylesForm />
        </TabsContent>
      </Tabs>
    </>
  )
}
