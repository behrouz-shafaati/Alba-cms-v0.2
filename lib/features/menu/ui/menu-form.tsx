'use client'
import { useActionState, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heading as HeadingIcon, Trash } from 'lucide-react'
import { Heading } from '@/components/other/ui/heading'
import { createMenu, deleteMenusAction, updateMenu } from '../actions'
import Text from '@/components/input/text'
import SubmitButton from '@/components/input/submit-button'
import { AlertModal } from '@/components/other/modal/alert-modal'
import MenuBuilder from '@/components/menu-builder'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from '@/components/context/SessionContext'
import AccessDenied from '@/components/other/access-denied'
import { toast } from 'sonner'
import authorize from '@/lib/utils/authorize'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'
import { useLocale } from '@/hooks/useLocale'

interface MenuFormProps {
  initialState: any | null
  settings: any
  menu: any
}

export const MenuForm: React.FC<MenuFormProps> = ({
  menu,
  initialState,
  settings,
}) => {
  const searchParams = useSearchParams()
  const localedFallback = settings.language?.siteDefault
  const dictionary = useLocale() as DashboardLocaleSchema

  const locale = searchParams.get('locale') ?? localedFallback
  const router = useRouter()
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canCreate = authorize(userRoles, 'menu.create')
  const canEdit = authorize(
    userRoles,
    menu?.user !== user?.id ? 'menu.edit.any' : 'menu.edit.own',
  )
  const canDelete = authorize(
    userRoles,
    menu?.user !== user?.id ? 'menu.delete.any' : 'menu.delete.own',
  )

  const isUpdate = menu ? true : false
  const actionHandler = isUpdate
    ? updateMenu.bind(null, String(menu.id))
    : createMenu
  const [state, dispatch] = useActionState(actionHandler as any, initialState)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const title = isUpdate
    ? dictionary.feature.menu.edit
    : dictionary.feature.menu.create
  const description = isUpdate
    ? dictionary.feature.menu.edit
    : dictionary.feature.menu.create

  const onDelete = async () => {
    try {
      setLoading(true)
      deleteMenusAction([menu?.id])
      router.replace('/dashboard/menus')
    } catch (error: any) {}
  }

  useEffect(() => {
    if (state.message && state.message !== null)
      if (state?.success) toast.success(state.message)
      else toast.error(state.message)
  }, [state, toast])

  if ((menu && !canEdit) || !canCreate) return <AccessDenied />

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {isUpdate && canDelete && (
          <>
            <AlertModal
              isOpen={open}
              onClose={() => setOpen(false)}
              onConfirm={onDelete}
              loading={loading}
            />
            <Button
              disabled={loading}
              variant="destructive"
              size="sm"
              onClick={() => setOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      {/* <Separator /> */}
      <form action={dispatch} className="w-full space-y-8">
        <div className="gap-8 md:grid md:grid-cols-3">
          <div className="flex flex-row items-center gap-2  col-span-3">
            <input
              type="text"
              name="lang"
              className="hidden"
              value="fa"
              readOnly
            />
            {/* Title */}
            <Text
              title={dictionary.feature.menu.title}
              name="title"
              defaultValue={state?.values?.translation?.title || ''}
              placeholder={dictionary.feature.menu.title}
              state={state}
              icon={<HeadingIcon className="h-4 w-4" />}
            />
            <SubmitButton />
          </div>

          <MenuBuilder
            name="itemsJson"
            initialMenu={state?.values?.translation?.items || []}
            maxDepth={1}
            className="col-span-3"
            settings={settings}
          />
        </div>
      </form>
    </>
  )
}
