import { DndSortable } from '../types'
import addBlockToContainer from './addBlockToContainer'
import extractMovedBlockContent from './extractMovedBlockContent'
import findElementContainer from './findElementContainer'
import removeBlockFromContainer from './removeBlockFromContainer'

const moveBetweenContainers = (
  content: any,
  active: DndSortable,
  over: DndSortable,
  position: 'start' | 'end' | number = 'end'
) => {
  let goalContainerId
  const movedBlockId = active.id
  const sourceContainer = findElementContainer(content, movedBlockId)

  if (
    over.data.current.type === 'internalSection' ||
    over.data.current.type === 'column'
  ) {
    goalContainerId = over.id
  } else {
    // اگر بلاک روی یک بلاک دیگر رها شده باشد، کانتینر آن بلاک را پیدا کن
    const overBlockContainer = findElementContainer(content, over.id)
    if (!overBlockContainer) return content
    goalContainerId = overBlockContainer.id
  }

  if (!sourceContainer || !active) return content
  // استخراج محتوای بلاک منتقل شده
  const movedBlock = extractMovedBlockContent(sourceContainer, movedBlockId)
  console.log('movedBlock:', movedBlock)
  if (!movedBlock) return content
  // حذف بلاک از کانتینر مبدا
  let newContent = removeBlockFromContainer(content, movedBlockId)
  // اضافه کردن بلاک به کانتینر مقصد
  newContent = addBlockToContainer(
    newContent,
    goalContainerId,
    movedBlock,
    position
  )
  return newContent
}

export default moveBetweenContainers
