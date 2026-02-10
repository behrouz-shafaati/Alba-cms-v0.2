'use client'
import { useActionState, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import roleCtrl from '@/lib/features/role/controller'
import { createPage, deletePagesAction, updatePage } from '../actions'
import { Category } from '@/lib/features/category/interface'
import { Page, PageContent, PageTranslationSchema } from '../interface'
import BuilderPage from '@/components/builder-page'
import { useSession } from '@/components/context/SessionContext'
import authorize from '@/lib/utils/authorize'
import { Option } from '@/lib/types'
import { toast } from 'sonner'
import AccessDenied from '@/components/other/access-denied'
import { AlertModal } from '@/components/other/modal/alert-modal'
import getTranslation from '@/lib/utils/getTranslation'

export const IMG_MAX_LIMIT = 3

interface PageFormProps {
  settings: any
  initialData: Page | null
  allTemplates: PageContent[]
  allCategories: Category[]
}

export const PageForm: React.FC<PageFormProps> = ({
  settings,
  initialData: page,
  allTemplates,
  allCategories,
}) => {
  const searchParams = useSearchParams()

  const { user } = useSession()
  const userRoles = user?.roles || []

  const canCreate = authorize(userRoles, 'page.create')
  const canEdit = authorize(
    userRoles,
    page?.user !== user?.id ? 'page.edit.any' : 'page.edit.own'
  )

  const localedFallback = settings.language?.siteDefault

  const locale = searchParams.get('locale') ?? localedFallback

  const translation: PageTranslationSchema = getTranslation({
    translations: page?.translations,
    locale,
  })
  const initialActionState = {
    message: null,
    errors: {},
    values: { ...page, translation },
  }

  const actionHandler = page
    ? updatePage.bind(null, String(page.id))
    : createPage
  const [state, dispatch] = useActionState(
    actionHandler as any,
    initialActionState
  )
  const roleOptions: Option[] = roleCtrl.getRoles().map((role) => ({
    label: role.title,
    value: role.slug,
  }))

  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const onDelete = async () => {
    try {
      setLoading(true)
      deletePagesAction([String(page?.id)])
      router.replace('/dashboard/pages')
    } catch (error: any) {}
  }

  useEffect(() => {
    console.log('#299 page state:', state)
    if (state?.message && state.message !== null)
      if (state?.success) toast.success(state.message)
      else toast.error(state.message)
    if (state?.success && state?.isCreatedJustNow) {
      router.replace(`/dashboard/pages/${state?.values?.id}`)
    }
  }, [state])
  if (!canCreate && !canEdit) return <AccessDenied />
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <BuilderPage
        settings={settings}
        title="صفحه ساز"
        submitFormHandler={dispatch}
        name="contentJson"
        {...(page || state?.values?.translation?.content
          ? {
              initialContent: {
                ...state?.values?.translation?.content,
                slug: state?.values?.slug,
              },
            }
          : {
              initialContent: { type: 'page', templateFor: ['page'], rows: [] },
            })}
        allTemplates={allTemplates}
        allCategories={allCategories}
        locale={locale}
      />
    </>
  )
}
