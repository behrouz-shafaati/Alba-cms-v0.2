'use client'
import { useDraggable } from '@dnd-kit/core'

export default function DraggableLink({
  type,
  label,
  id,
}: {
  type: string
  label: string
  id: string
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: {
      type: type,
      label,
    },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-grab rounded bg-blue-100 dark:bg-blue-950 p-2 text-center"
    >
      {label}
    </div>
  )
}
