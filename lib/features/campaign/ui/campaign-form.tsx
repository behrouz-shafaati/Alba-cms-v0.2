'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  ArrowUpDown,
  CalendarRange,
  FileText,
  Link,
  MapPin,
  Target,
  ToggleLeft,
  Trash,
  Type,
} from 'lucide-react'
import { Heading } from '@/components/other/ui/heading'
import {
  createCampaign,
  deleteCampaignsAction,
  updateCampaign,
} from '../actions'
import { CampaignTranslation } from '../interface'
import { useSession } from '@/components/context/SessionContext'
import DateRangePicker from '@/components/input/date-range-picker'
import Number from '@/components/input/number'
import { Category } from '@/lib/features/category/interface'
import MultiSelect from '@/components/input/multiple-select'
import { getGoalCampaignOptions } from '../utils'
import authorize from '@/lib/utils/authorize'
import { toast } from 'sonner'
import getTranslation from '@/lib/utils/getTranslation'
import AccessDenied from '@/components/other/access-denied'
import { AlertModal } from '@/components/other/modal/alert-modal'
import Text from '@/components/input/text'
import Select from '@/components/input/select'
import FileUpload from '@/components/input/file-upload'
import SubmitButton from '@/components/input/submit-button'

export const IMG_MAX_LIMIT = 1

interface CampaignFormProps {
  initialData: any | null
  allCategories: Category[]
}

export const CampaignForm: React.FC<CampaignFormProps> = ({
  initialData: campaign,
  allCategories,
}) => {
  const locale = 'fa' //  from formData
  const router = useRouter()
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canCreate = authorize(userRoles, 'campaign.create')
  const canEdit = authorize(
    userRoles,
    campaign?.user.id !== user?.id ? 'campaign.edit.any' : 'campaign.edit.own',
  )
  const canDelete = authorize(
    userRoles,
    campaign?.user.id !== user?.id
      ? 'campaign.delete.any'
      : 'campaign.delete.own',
  )

  const formRef = useRef<HTMLFormElement>(null)
  const initialState = {
    message: null,
    errors: {},
    values: { translations: [{ locale: 'fa', banners: [] }], ...campaign },
  }
  const actionHandler = campaign
    ? updateCampaign.bind(null, String(campaign.id))
    : createCampaign
  const [state, dispatch] = useActionState(actionHandler as any, initialState)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const title = campaign ? 'ویرایش کمپین‌ تبلیغاتی' : 'افزودن کمپین‌ تبلیغاتی'
  const description = campaign
    ? 'ویرایش کمپین‌ تبلیغاتی'
    : 'افزودن کمپین‌ تبلیغاتی'

  const placementOptions = [
    {
      label: 'همه',
      value: 'all',
    },
    {
      label: 'هدر',
      value: 'header',
    },
    {
      label: 'محتوا',
      value: 'content',
    },
    {
      label: 'کناره',
      value: 'sidebar',
    },
    {
      label: 'فوتر',
      value: 'footer',
    },
  ]

  const statusOptions = [
    {
      label: 'پیش‌نویس',
      value: 'draft',
    },
    {
      label: 'فعال',
      value: 'active',
    },
    {
      label: 'غیر فعال',
      value: 'inactive',
    },
  ]

  const aspectKeys = ['1/1', '4/1', '10/1', '20/1', '30/1']

  const goalTemplateOptions = getGoalCampaignOptions({ allCategories })
  const onDelete = async () => {
    try {
      setLoading(true)
      const deleteResult = await deleteCampaignsAction([campaign?.id])
      if (deleteResult?.success) router.replace('/dashboard/campaigns')
      else {
        setOpen(false)
        setLoading(false)
        if (deleteResult?.success) toast.success(deleteResult?.message)
        else toast.error(deleteResult?.message)
      }
    } catch (error: any) {}
  }

  useEffect(() => {
    if (state?.message && state.message !== null) {
      if (state?.success) toast.success(state?.message)
      else toast.error(state?.message)
    }
  }, [state])
  if ((campaign && !canEdit) || !canCreate) return <AccessDenied />
  const translation: CampaignTranslation = getTranslation({
    translations: state?.values?.translations,
  })

  const submitManually = () => {
    if (formRef.current) {
      formRef.current.requestSubmit() // بهترین راه
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {campaign && canDelete && (
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
      <form action={dispatch} className="space-y-8 w-full" ref={formRef}>
        <div className="md:grid md:grid-cols-3 gap-8">
          <input type="hidden" name="lang" value="fa" readOnly />
          {/* Title */}
          <Text
            title="عنوان"
            name="title"
            defaultValue={state?.values?.title || ''}
            placeholder="عنوان"
            state={state}
            icon={<Type className="w-4 h-4" />}
          />
          <DateRangePicker
            title="بازه‌ی اجرا"
            lang="fa"
            fromFieldName="startAt"
            toFieldName="endAt"
            fromDefaultValue={state?.values?.startAt || ''}
            toDefaultValue={state?.values?.endAt || ''}
            state={state}
            icon={<CalendarRange className="w-4 h-4" />}
          />
          {/* placement */}
          <Select
            title="محل نمایش در صفحه"
            name="placement"
            defaultValue={state?.values?.placement}
            options={placementOptions}
            placeholder=""
            state={state}
            icon={<MapPin className="w-4 h-4" />}
          />
          <MultiSelect
            title="بخش‌های هدف کمپین"
            name="goalSections"
            defaultSuggestions={goalTemplateOptions}
            defaultValues={state?.values?.goalSections}
            state={state}
            icon={<Target className="w-4 h-4" />}
          />
          <Number
            title="اولویت"
            name="priority"
            defaultValue={state?.values?.priority || ''}
            placeholder="اولویت"
            state={state}
            icon={<ArrowUpDown className="w-4 h-4" />}
          />

          {/* targetUrl */}
          <Text
            title="لینک مقصد"
            name="targetUrl"
            defaultValue={state?.values?.targetUrl}
            placeholder="لینک مقصد"
            state={state}
            icon={<Link className="w-4 h-4" />}
          />
          {/* description */}
          <Text
            title="توضیحات"
            name="description"
            defaultValue={state?.values?.description}
            placeholder="توضیحات"
            state={state}
            icon={<FileText className="w-4 h-4" />}
          />
          {/* status */}
          <Select
            title="وضعیت"
            name="status"
            defaultValue={state?.values?.status}
            options={statusOptions}
            placeholder="وضعیت"
            state={state}
            icon={<ToggleLeft className="w-4 h-4" />}
          />
        </div>
        {/* نمایش لیست بنرها */}
        <div>
          {aspectKeys.map((aspectKey, index) => {
            const ratio = aspectKey.split('/')
            const defaultValu = translation?.banners?.find(
              (b) => b.aspect === aspectKey,
            )
            return (
              <section
                key={index}
                className="mt-2 rounded-md  p-4 md:mt-0 md:p-6"
              >
                <input
                  type="hidden"
                  name="banners[][aspect]"
                  value={aspectKey}
                />
                <FileUpload
                  title={`نسبت عرض به طول ${ratio[0]}/${ratio[1]}`}
                  name="banners[][file]"
                  state={state}
                  maxFiles={1}
                  allowedFileTypes={['image']}
                  defaultValues={defaultValu?.file ? [defaultValu?.file] : []}
                  onChange={submitManually}
                  onLoading={setLoading}
                />
              </section>
            )
          })}
        </div>
        <SubmitButton loading={loading} />
      </form>
    </>
  )
}
