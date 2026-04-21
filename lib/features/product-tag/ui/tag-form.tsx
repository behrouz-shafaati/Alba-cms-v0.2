'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Braces as TagIcon, Mail as MailIcon, Trash } from 'lucide-react'
// import { Separator } from "@/components/ui/separator";
import { Heading } from '@/components/other/ui/heading'
// import FileUpload from "@/components/FileUpload";
import {
  createProductTag,
  deleteProductTagsAction,
  updateProductTag,
} from '../actions'
import Text from '@/components/input/text'
import SubmitButton from '@/components/input/submit-button'
import { AlertModal } from '@/components/other/modal/alert-modal'
import { Tag } from '../interface'
import FileUpload from '@/components/input/file-upload'
import Select from '@/components/input/select'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from '@/components/context/SessionContext'
import AccessDenied from '@/components/other/access-denied'
import { Label } from '@/components/ui/label'
import StickyBox from 'react-sticky-box'
import TiptapEditorLazy from '@/components/tiptap-editor/TiptapEditorLazy'
import IconPicker from '@/components/input/IconPicker'
import authorize from '@/lib/utils/authorize'
import { toast } from 'sonner'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'
import { ContentLanguageTabs } from '@/components/input/ContentLanguageTabs'
import { Settings } from '../../settings/interface'

export const IMG_MAX_LIMIT = 1

interface ProductTagFormProps {
  tag: Tag
  initialState: any | null
  settings: Settings
  dictionary: DashboardLocaleSchema
}

export const ProductTagForm: React.FC<ProductTagFormProps> = ({
  tag,
  initialState,
  settings,
  dictionary,
}) => {
  const router = useRouter()
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canCreate = authorize(userRoles, 'productTag.create')
  const canEdit = authorize(
    userRoles,
    tag?.user.id !== user?.id ? 'productTag.edit.any' : 'productTag.edit.own',
  )
  const canDelete = authorize(
    userRoles,
    tag?.user.id !== user?.id
      ? 'productTag.delete.any'
      : 'productTag.delete.own',
  )

  const formRef = useRef<HTMLFormElement>(null)
  const actionHandler = tag
    ? updateProductTag.bind(null, String(tag.id))
    : createProductTag
  const [state, dispatch] = useActionState(actionHandler as any, initialState)

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (state.message && state.message !== null)
      if (state.success) toast.success(state.message)
      else toast.error(state.message)
  }, [state])
  if ((tag && !canEdit) || !canCreate) return <AccessDenied />
  const title = tag
    ? dictionary.feature.productTag.edit
    : dictionary.feature.productTag.create
  const description = tag
    ? dictionary.feature.productTag.editDescription
    : dictionary.feature.productTag.createDescription

  const statusOptions = [
    {
      label: dictionary.feature.productTag.active,
      value: 'active',
    },
    {
      label: dictionary.feature.productTag.deactive,
      value: 'inactive',
    },
  ]

  const onDelete = async () => {
    try {
      setLoading(true)
      const deleteResult = await deleteProductTagsAction([tag?.id])
      if (deleteResult?.success) router.replace('/dashboard/product-tags')
      else {
        setOpen(false)
        setLoading(false)
        if (deleteResult?.success) toast.success(deleteResult?.message)
        else toast.error(deleteResult?.message)
      }
    } catch (error: any) {}
  }

  const submitManually = () => {
    if (formRef.current) {
      formRef.current.requestSubmit() // بهترین راه
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {tag && canDelete && (
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
      <form
        action={dispatch}
        className="md:grid md:grid-cols-12 gap-8"
        ref={formRef}
      >
        <div className="col-span-12 md:col-span-9">
          {/* Title */}
          <Text
            title={dictionary.feature.productTag.form.title}
            name="title"
            defaultValue={state?.values?.translation?.title || ''}
            placeholder={dictionary.feature.productTag.form.titlePlaceholder}
            state={state}
            icon={<TagIcon className="w-4 h-4" />}
          />
          <Text
            title={dictionary.feature.productTag.form.slug}
            name="slug"
            defaultValue={state?.values?.slug || ''}
            placeholder={dictionary.feature.productTag.form.slugPlaceholder}
            state={state}
            icon={<TagIcon className="w-4 h-4" />}
          />
          {/* description contentJson*/}

          <Label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            {dictionary.feature.productTag.form.description}
          </Label>
          <TiptapEditorLazy
            attachedFilesTo={[{ feature: 'productTag', id: tag?.id || null }]}
            name="description"
            defaultContent={
              tag ? JSON.parse(state?.values?.translation?.description) : {}
            }
            onChangeFiles={submitManually}
            className="h-full"
            onLoading={setLoading}
          />
        </div>
        <div className="relative col-span-12 md:col-span-3 gap-2">
          <StickyBox offsetBottom={0}>
            <ContentLanguageTabs settings={settings} />
            {/* status */}
            <Select
              title={dictionary.feature.productTag.form.status}
              name="status"
              defaultValue={state?.values?.translation?.status || 'active'}
              options={statusOptions}
              placeholder={dictionary.feature.productTag.form.slugPlaceholder}
              state={state}
              icon={<MailIcon className="w-4 h-4" />}
            />
            <IconPicker
              title={dictionary.feature.productTag.form.icon}
              name="icon"
              defaultValue={state?.values?.icon}
            />
            <FileUpload
              title={dictionary.feature.productTag.form.image}
              name="image"
              state={state}
              maxFiles={1}
              allowedFileTypes={['image']}
              defaultValues={state?.values?.image}
              onLoading={setLoading}
            />
            <SubmitButton loading={loading} className="my-4 w-full" />
          </StickyBox>
        </div>
      </form>
    </>
  )
}
