'use client'
import { useBuilderStore } from '../store/useBuilderStore'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  pointerWithin,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useEffect, useRef } from 'react'
import { Content } from '../types'
import { blockRegistry } from '../registry/blockRegistry'
import SortableRow from '../shared-blocks/row/SortableRow'
import ToolsSection from './toolsSection' // <==
import { Button } from '@/components/ui/button'
import SubmitButton from '@/components/input/submit-button'
import generateObjectId from '@/lib/utils/objectId'
import findElementContainer from '../utils/findElementContainer'
import moveBetweenContainers from '../utils/moveBetweenContainers'
import addBlockToContainer from '../utils/addBlockToContainer'
import { getDirection } from '@/lib/i18n/utils/getDirection'
import { Plus, PlusIcon, Settings } from 'lucide-react'
import { generateResponsiveCSS } from '../utils/css-generator'

type props = {
  name: string
  submitFormHandler: any
  initialContent?: Content
  SettingsPanel: React.ReactNode
  Header?: React.ReactNode
  newBlocks?: any
  locale: string
}

export default function Builder({
  initialContent,
  name,
  submitFormHandler,
  SettingsPanel,
  Header,
  newBlocks,
  locale,
}: props) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const direction = getDirection(locale)
  const {
    content,
    addRow,
    getJson,
    setActiveElement,
    activeElement,
    reorderRows,
    selectBlock,
    deselectBlock,
    setContent,
    resetContent,
    device,
  } = useBuilderStore()

  const allBlocks = { ...blockRegistry, ...newBlocks }
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    if (!active) return

    // set the dragged item in state
    const elementType = active.data.current?.type as 'text' | 'image'
    const id = active.id as string
    console.log('#000999 elementType: ', active.data.current)
    if (elementType) {
      setActiveElement({
        id,
        type: elementType,
        data: { content: elementType === 'text' ? 'بلوک متن' : undefined },
      })
    }
  }
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveElement(null)
    console.log('#87 drag end')
    const { active, over } = event
    if (!over) return

    console.log('#88 active:', active, ' | #9 overId:', over)

    const activeId = active.id
    const overId = over.id
    const activeData = active.data.current as {
      type:
        | 'text'
        | 'image'
        | 'video'
        | 'gallery'
        | 'form'
        | 'product'
        | 'custom'
    }

    // اگر جابجایی مربوط به ردیف بود
    if (content.rows.find((r) => r.id === activeId)) {
      reorderRows(String(activeId), String(overId))
      return
    }

    const sourceContainer = findElementContainer(content, String(activeId))
    const targetContainer = findElementContainer(content, String(overId))
    const oldIndex = sourceContainer?.blocks?.findIndex(
      (el: any) => el.id === activeId,
    )
    const newIndex = targetContainer.blocks.findIndex(
      (el: any) => el.id === overId,
    )

    console.log('@94 oldIndex:', oldIndex, ' | newIndex:', newIndex)
    console.log('@94 sourceCol:', sourceContainer, ' | over:', over)

    // حالت 1: کشیدن آیتم جدید از نوار ابزار (text-block)
    if (String(activeId)?.endsWith('-block')) {
      const block = allBlocks[activeData.type]
      const defaultSettings =
        typeof block.defaultSettings === 'function'
          ? block.defaultSettings()
          : block.defaultSettings
      console.log('@9**d4 targetContainer:', targetContainer)
      const newContent = addBlockToContainer(
        content,
        targetContainer.id,
        {
          id: generateObjectId(),
          type: activeData.type,
          ...defaultSettings,
        },
        newIndex,
      )
      setContent(newContent)
      return
    }

    // حالت 2: جابجایی آیتم بین کانتینرها یا درون یک کانتینر
    const newContent = moveBetweenContainers(content, active, over, newIndex)
    setContent(newContent)
  }

  useEffect(() => {
    if (initialContent) setContent(initialContent)
    else resetContent()
  }, [setContent, resetContent, initialContent])

  const submitManually = () => {
    if (formRef.current) {
      formRef.current.requestSubmit() // بهترین راه
    }
  }
  return (
    <>
      <style id="445588">{generateResponsiveCSS(content)}</style>
      <div className="w-full fixed top-0 flex justify-between px-4 py-3 bg-slate-950 text-gray-50 z-20">
        <div className="flex gap-3">
          <Settings
            role="button"
            className="hover:brightness-90"
            onClick={() => selectBlock('settings-panel')}
          />
          <Plus
            role="button"
            className="hover:brightness-90"
            onClick={deselectBlock}
          />
        </div>
        <div>{device}</div>
        <div>{Header}</div>
      </div>
      <DndContext
        onDragEnd={handleDragEnd}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
      >
        <div className="flex w-full  mt-12">
          {/* نوار ابزار */}
          <aside className="relative h-[calc(100vh-48px)] overflow-x-hidden overflow-y-auto w-80 max-w-80 shrink-0 bg-slate-900 text-gray-50 z-20 dark">
            <ToolsSection
              SettingsPanel={SettingsPanel}
              savePage={submitManually}
              newBlocks={newBlocks}
            />
            <div className="sticky bottom-0  w-full gap-2 p-2 bg-slate-950">
              <form action={submitFormHandler} ref={formRef}>
                <textarea readOnly name={name} value={getJson()} hidden />
                <textarea readOnly name="locale" value={locale} hidden />
                <div className="w-full flex flex-row justify-between">
                  <SubmitButton />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      deselectBlock()
                      router.back()
                    }}
                  >
                    بازگشت
                  </Button>
                </div>
              </form>
            </div>
          </aside>
          {/* ناحیه ساخت صفحه */}
          <div
            className="flex-1 h-[calc(100vh-48px)] py-8 overflow-y-auto p-4 rtl:pr-10 ltr:pl-10"
            style={{ direction: direction }}
            onClick={() => {
              deselectBlock()
            }}
          >
            {content?.rows && (
              <SortableContext
                items={content?.rows?.map((row) => row.id)}
                strategy={verticalListSortingStrategy}
              >
                <div>
                  {content?.rows?.map((row, index) => (
                    <SortableRow
                      key={row.id}
                      row={row}
                      newBlocks={newBlocks}
                      index={index}
                      locale={locale}
                    />
                  ))}
                </div>
              </SortableContext>
            )}
            <Button
              type="button"
              onClick={() => addRow(null)}
              className="w-full px-4 py-2 mt-10  rounded"
            >
              افزودن ردیف
            </Button>
            {process.env.NODE_ENV === 'development' && (
              <pre className="p-4 mt-4 ltr border rounded ">
                <code>{getJson()}</code>
              </pre>
            )}
          </div>
        </div>
        <DragOverlay>
          {activeElement ? <div>{activeElement.type} </div> : null}
        </DragOverlay>
      </DndContext>
    </>
  )
}
