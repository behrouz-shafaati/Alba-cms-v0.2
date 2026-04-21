import insertWithPosition from '@/lib/utils/insertWithPosition'
import findElementContainer from './findElementContainer'

export default function addBlockToContainer(
  content: any,
  goalContainerId: string,
  movedBlock: any,
  position: 'start' | 'end' | number = 'end',
) {
  const updatedContent = { ...content }

  // 1️⃣ container واقعی را پیدا می‌کنیم (column یا section)
  const container = findElementContainer(updatedContent, goalContainerId)
  if (!container) return updatedContent

  // 2️⃣ blocks کنونی container را می‌گیریم
  const currentBlocks = container.blocks || []

  // 3️⃣ بلوک جدید را در جای درست اضافه می‌کنیم
  container.blocks = insertWithPosition(currentBlocks, movedBlock, position)

  return updatedContent
}
