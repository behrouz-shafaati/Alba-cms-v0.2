'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Braces as CategoryIcon,
  ListTree,
  Mail as MailIcon,
  Tag,
  ToggleLeft,
  Trash,
} from 'lucide-react'
// import { Separator } from "@/components/ui/separator";
import { Heading } from '@/components/other/ui/heading'
// import FileUpload from "@/components/FileUpload";
import {
  createProductCategory,
  deleteProductCategorysAction,
  updateProductCategory,
} from '../actions'
import Text from '@/components/input/text'
import SubmitButton from '@/components/input/submit-button'
import { Option } from '@/lib/types'
import { AlertModal } from '@/components/other/modal/alert-modal'
import Combobox from '@/components/input/combobox'
import { ProductCategory, ProductCategoryTranslationSchema } from '../interface'
import createCatrgoryBreadcrumb from '@/lib/utils/createCatrgoryBreadcrumb'
import FileUpload from '@/components/input/file-upload'
import Select from '@/components/input/select'
import { useSession } from '@/components/context/SessionContext'
import AccessDenied from '@/components/other/access-denied'
import StickyBox from 'react-sticky-box'
import { Label } from '@/components/ui/label'
import TiptapEditorLazy from '@/components/tiptap-editor/TiptapEditorLazy'
import IconPicker from '@/components/input/IconPicker'
import authorize from '@/lib/utils/authorize'
import { toast } from 'sonner'
import { ContentLanguageTabs } from '@/components/input/ContentLanguageTabs'
import { Settings } from '../../settings/interface'

export const IMG_MAX_LIMIT = 1

interface CategoryFormProps {
  category: ProductCategory
  initialState: any | null
  allCategories: ProductCategory[]
  settings: Settings
  dictionary: any
}

export const ProductCategoryForm: React.FC<CategoryFormProps> = ({
  category,
  initialState,
  allCategories,
  settings,
  dictionary,
}) => {
  const searchParams = useSearchParams()
  const locale = searchParams.get('locale') ?? settings.language?.siteDefault
  const router = useRouter()
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canCreate = authorize(userRoles, 'productCategory.create')
  const canEdit = authorize(
    userRoles,
    category?.user.id !== user?.id
      ? 'productCategory.edit.any'
      : 'productCategory.edit.own',
  )
  const canDelete = authorize(
    userRoles,
    category?.user.id !== user?.id
      ? 'productCategory.delete.any'
      : 'productCategory.delete.own',
  )

  const formRef = useRef<HTMLFormElement>(null)
  const actionHandler = category
    ? updateProductCategory.bind(null, String(category.id))
    : createProductCategory
  const [state, dispatch] = useActionState(actionHandler as any, initialState)

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const title = category
    ? dictionary.feature.productCategory.edit
    : dictionary.feature.productCategory.create
  const description = category
    ? dictionary.feature.productCategory.dictionary.feature.productCategory.edit
    : dictionary.feature.productCategory.addDescription

  const parentOptions: Option[] = allCategories.map(
    (category: ProductCategory) => {
      const translation: any =
        category?.translations?.find((t: any) => t.locale === locale) ||
        category?.translations[0] ||
        {}

      return {
        value: String(category.id),
        label: createCatrgoryBreadcrumb(category, translation?.title),
      }
    },
  )

  const statusOptions = [
    {
      label: dictionary.feature.productCategory.active,
      value: 'active',
    },
    {
      label: dictionary.feature.productCategory.deactive,
      value: 'inactive',
    },
  ]
  const onDelete = async () => {
    try {
      setLoading(true)
      const deleteResult = await deleteProductCategorysAction([category?.id])
      if (deleteResult?.success) router.replace('/dashboard/product-categories')
      else {
        setOpen(false)
        setLoading(false)
        if (deleteResult?.success) toast.success(deleteResult?.message)
        else toast.error(deleteResult?.message)
      }
    } catch (error: any) {}
  }

  useEffect(() => {
    if (state.message && state.message !== null)
      if (state.success) toast.success(state.message)
      else toast.error(state.message)
  }, [state])
  const submitManually = () => {
    if (formRef.current) {
      formRef.current.requestSubmit() // بهترین راه
    }
  }

  if ((category && !canEdit) || !canCreate) return <AccessDenied />
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {category && canDelete && (
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
      <form action={dispatch} className="grid grid-cols-12 gap-8" ref={formRef}>
        <div className="col-span-12 md:col-span-9">
          {/* Title */}
          <Text
            title={dictionary.feature.productCategory.form.title}
            name="title"
            defaultValue={state?.values?.translation?.title || ''}
            placeholder={
              dictionary.feature.productCategory.form.titlePlaceholder
            }
            state={state}
            icon={<CategoryIcon className="w-4 h-4" />}
          />
          <Text
            title={dictionary.feature.productCategory.form.slug}
            name="slug"
            defaultValue={state?.values?.slug || ''}
            placeholder={
              dictionary.feature.productCategory.form.slugPlaceholder
            }
            state={state}
            icon={<Tag className="w-4 h-4" />}
          />
          {/* Parent */}
          <Combobox
            title={dictionary.feature.productCategory.form.parent}
            name="parent"
            defaultValue={state?.values?.parent?.id}
            options={parentOptions}
            placeholder={
              dictionary.feature.productCategory.form.parentPlaceholdert
            }
            state={state}
            icon={<ListTree className="w-4 h-4" />}
          />
          {/* description contentJson*/}

          <Label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            {dictionary.feature.productCategory.form.description}
          </Label>
          <TiptapEditorLazy
            attachedFilesTo={[
              { feature: 'productCategory', id: category?.id || null },
            ]}
            name="description"
            defaultContent={
              category
                ? JSON.parse(state?.values?.translation?.description)
                : {}
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
              title={dictionary.feature.productCategory.form.status}
              name="status"
              defaultValue={state?.values?.status}
              options={statusOptions}
              placeholder={
                dictionary.feature.productCategory.form.statusPlaceholder
              }
              state={state}
              icon={<ToggleLeft className="w-4 h-4" />}
            />
            <IconPicker
              title={dictionary.feature.productCategory.form.icon}
              name="icon"
              defaultValue={state?.values?.icon}
            />
            <FileUpload
              title={dictionary.feature.productCategory.form.image}
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
