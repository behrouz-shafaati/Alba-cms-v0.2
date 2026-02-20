'use client'
import * as z from 'zod'
import { useActionState, useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import roleCtrl from '@/lib/features/role/controller'
import { createSection, deleteSectionAction, updateSection } from '../actions'
import { Option } from '@/lib/types'
import { AlertModal } from '@/components/other/modal/alert-modal'
import BuilderSection from '@/components/builder-section'
import { Section } from '../interface'
import { useSession } from '@/components/context/SessionContext'
import AccessDenied from '@/components/other/access-denied'
import authorize from '@/lib/utils/authorize'
import { toast } from 'sonner'

export const IMG_MAX_LIMIT = 3
const formSchema = z.object({
  title: z.string().min(3, { message: 'عنوان معتبر وارد کنید' }),
})

type SectionFormValues = z.infer<typeof formSchema>

interface SectionFormProps {
  initialData: Section | null
  settings: any
}

export const Form: React.FC<SectionFormProps> = ({
  initialData: Section,
  settings,
}) => {
  const searchParams = useSearchParams()
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canCreate = authorize(userRoles, 'template.create')
  const canEdit = authorize(
    userRoles,
    Section?.user !== user?.id ? 'template.edit.any' : 'template.edit.own',
  )
  const initialState = { message: null, errors: {} }
  const actionHandler = Section
    ? updateSection.bind(null, String(Section.id))
    : createSection
  const [state, dispatch] = useActionState(actionHandler as any, initialState)
  const roleOptions: Option[] = roleCtrl.getRoles().map((role) => ({
    label: role.title,
    value: role.slug,
  }))

  const localedFallback = settings.language?.siteDefault

  const locale = searchParams.get('locale') ?? localedFallback

  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)
  const title = Section ? 'ویرایش قطعه قالب' : 'افزودن قطعه قالب'
  const description = Section ? 'ویرایش قطعه قالب' : 'افزودن قطعه قالب'
  const toastMessage = Section ? 'قطعه قالب بروزرسانی شد' : 'قطعه قالب اضافه شد'
  const action = Section ? 'ذخیره تغییرات' : 'ذخیره'

  const defaultInitialValue = {
    title: '',
    type: 'templatePart',
    status: 'active',
    rows: [],
  }

  console.log('#299 Section:', Section?.content.rows)
  const onDelete = async () => {
    try {
      setLoading(true)
      deleteSectionAction([String(Section?.id)])
      router.replace('/dashboard/template-parts')
    } catch (error: any) {}
  }

  useEffect(() => {
    if (state?.message && state.message !== null)
      if (state?.success) toast.success(state.message)
      else toast.error(state.message)
    if (state?.success && state?.isCreatedJustNow) {
      router.replace(`/dashboard/template-parts/${state?.values?.id}`)
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
      {/* <div className="flex items-center justify-between">
        {/* <Heading title={title} description={description} /> * /}
        {Section && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div> * /}
      {/* <Separator /> */}
      <BuilderSection
        initialContent={Section ? Section.content : defaultInitialValue}
        name="contentJson"
        submitFormHandler={dispatch}
        locale={locale}
      />
    </>
  )
}
