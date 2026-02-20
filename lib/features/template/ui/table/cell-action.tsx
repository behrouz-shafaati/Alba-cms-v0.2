'use client'
import { AlertModal } from '@/components/other/modal/alert-modal'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Template } from '@/lib/features/template/interface'
import { Edit, MoreHorizontal, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteTemplatesAction } from '../../actions'
import { useSession } from '@/components/context/SessionContext'
import authorize from '@/lib/utils/authorize'

interface CellActionProps {
  data: Template
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const { user } = useSession()
  const userRoles = user?.roles || []

  const canEdit = authorize(
    userRoles,
    data?.user !== user?.id ? 'template.edit.any' : 'template.edit.own',
  )
  const canDelete = authorize(
    userRoles,
    data?.user !== user?.id ? 'template.delete.any' : 'template.delete.own',
  )

  const onConfirm = async () => {
    setLoading(true)
    deleteTemplatesAction([data.id])
    router.refresh()
    setOpen(false)
    setLoading(false)
  }
  if (!canDelete && !canEdit) return null
  return (
    <>
      {canDelete && (
        <AlertModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onConfirm={onConfirm}
          loading={loading}
        />
      )}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {/* <DropdownMenuLabel dir="rtl">عملیات</DropdownMenuLabel> */}

          {canEdit && (
            <DropdownMenuItem
              onClick={() => router.push(`/dashboard/templates/${data.id}`)}
            >
              <Edit className="ml-2 h-4 w-4" /> بروزرسانی
            </DropdownMenuItem>
          )}
          {canDelete && (
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Trash className="ml-2 h-4 w-4" /> حذف
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
