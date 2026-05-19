'use client'
import { AlertModal } from '@/components/other/modal/alert-modal'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu } from '@/lib/features/menu/interface'
import { Edit, MoreHorizontal, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteMenusAction } from '../../actions'
import { useSession } from '@/components/context/SessionContext'
import authorize from '@/lib/utils/authorize'
import { useLocale } from '@/hooks/useLocale'

interface CellActionProps {
  data: Menu
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const dictionary = useLocale()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const { user } = useSession()
  const userRoles = user?.roles || []

  const canEdit = authorize(
    userRoles,
    data?.user !== user?.id ? 'menu.edit.any' : 'menu.edit.own',
  )
  const canDelete = authorize(
    userRoles,
    data?.user !== user?.id ? 'menu.delete.any' : 'menu.delete.own',
  )
  if (!canDelete && !canEdit) return null
  const onConfirm = async () => {
    setLoading(true)
    deleteMenusAction([data.id])
    router.refresh()
    setOpen(false)
    setLoading(false)
  }

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
              onClick={() => router.push(`/dashboard/menus/${data.id}`)}
            >
              <Edit className="me-1 h-4 w-4" /> {dictionary.shared.update}
            </DropdownMenuItem>
          )}
          {canDelete && (
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Trash className="me-1 h-4 w-4" /> {dictionary.shared.delete}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
