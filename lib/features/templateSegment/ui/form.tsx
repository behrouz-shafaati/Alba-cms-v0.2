'use client'
import { useActionState, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  createTemplateSegment,
  deleteTemplateSegmentAction,
  updateTemplateSegment,
} from '../actions'
import { AlertModal } from '@/components/other/modal/alert-modal'
import BuilderTemplateSegment from '@/components/builder-template-segment'
import { Section, TemplateSegmentTranslation } from '../interface'
import { useSession } from '@/components/context/SessionContext'
import AccessDenied from '@/components/other/access-denied'
import authorize from '@/lib/utils/authorize'
import { toast } from 'sonner'
import getTranslation from '@/lib/utils/getTranslation'

export const IMG_MAX_LIMIT = 3

interface SectionFormProps {
  initialData: Section | null
  settings: any
}

export const Form: React.FC<SectionFormProps> = ({
  initialData: templateSegment,
  settings,
}) => {
  const searchParams = useSearchParams()
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canCreate = authorize(userRoles, 'template.create')
  const canEdit = authorize(
    userRoles,
    templateSegment?.user !== user?.id
      ? 'template.edit.any'
      : 'template.edit.own',
  )

  const localedFallback = settings.language?.siteDefault

  const locale = searchParams.get('locale') ?? localedFallback
  const translation: TemplateSegmentTranslation = getTranslation({
    translations: templateSegment?.translations,
    locale,
  })

  console.log('#234098 locale:', locale)

  const initialState = {
    message: null,
    errors: {},
    values: { ...templateSegment, translation },
  }

  const actionHandler = templateSegment
    ? updateTemplateSegment.bind(null, String(templateSegment.id))
    : createTemplateSegment
  const [state, dispatch] = useActionState(actionHandler as any, initialState)

  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const defaultInitialValue = {
    title: '',
    type: 'templateSegment',
    status: 'active',
    rows: [],
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      deleteTemplateSegmentAction([String(templateSegment?.id)])
      router.replace('/dashboard/templateSegments')
    } catch (error: any) {}
  }

  useEffect(() => {
    console.log('#299 templateSegment state:', state)
    if (state?.message && state.message !== null)
      if (state?.success) toast.success(state.message)
      else toast.error(state.message)
    if (state?.success && state?.isCreatedJustNow) {
      router.replace(`/dashboard/templateSegments/${state?.values?.id}`)
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
      <BuilderTemplateSegment
        templateSegmentId={templateSegment?.id}
        settings={settings}
        name="contentJson"
        submitFormHandler={dispatch}
        {...(templateSegment || state?.values?.translation?.content
          ? {
              initialContent: {
                ...state?.values?.translation?.content,
              },
            }
          : {
              initialContent: defaultInitialValue,
            })}
        locale={locale}
      />
    </>
  )
}
