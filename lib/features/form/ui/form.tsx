'use client'
import { useActionState, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createForm, deleteFormAction, updateForm } from '../actions'
import { AlertModal } from '@/components/other/modal/alert-modal'
import BuilderForm from '@/components/builder-form'
import { Form as FormType, FromTranslation } from '../interface'
import { useSession } from '@/components/context/SessionContext'
import AccessDenied from '@/components/other/access-denied'
import authorize from '@/lib/utils/authorize'
import { toast } from 'sonner'
import getTranslation from '@/lib/utils/getTranslation'

export const IMG_MAX_LIMIT = 3

interface FormProps {
  initialData: FormType | null
  settings: any
}

export const Form: React.FC<FormProps> = ({ initialData: form, settings }) => {
  const searchParams = useSearchParams()
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canCreate = authorize(userRoles, 'form.create')
  const canEdit = authorize(
    userRoles,
    form?.user !== user?.id ? 'form.edit.any' : 'form.edit.own',
  )

  const localedFallback = settings.language?.siteDefault

  const locale = searchParams.get('locale') ?? localedFallback
  const translation: FromTranslation = getTranslation({
    translations: form?.translations,
    locale,
  })
  const initialState = {
    message: null,
    errors: {},
    values: { ...form, translation },
  }

  const actionHandler = form
    ? updateForm.bind(null, String(form.id))
    : createForm
  const [state, dispatch] = useActionState(actionHandler as any, initialState)

  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const onDelete = async () => {
    try {
      setLoading(true)
      deleteFormAction([String(form?.id)])
      router.replace('/dashboard/forms')
    } catch (error: any) {}
  }

  useEffect(() => {
    if (state?.message && state.message !== null)
      if (state?.success) toast.success(state.message)
      else toast.error(state.message)
    if (state?.success && state?.isCreatedJustNow) {
      router.replace(`/dashboard/forms/${state?.values?.id}`)
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
      <BuilderForm
        formId={form?.id}
        settings={settings}
        title="فرم ساز"
        name="contentJson"
        submitFormHandler={dispatch}
        {...(form || state?.values?.translation?.content
          ? {
              initialContent: {
                ...state?.values?.translation?.content,
              },
            }
          : {
              // initialContent: { type: 'form', templateFor: ['form'], rows: [] },
              initialContent: { type: 'form', templateFor: ['form'], rows: [] },
            })}
        locale={locale}
      />
    </>
  )
}
