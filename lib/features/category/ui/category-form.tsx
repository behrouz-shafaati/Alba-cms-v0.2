'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
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
  createCategory,
  deleteCategorysAction,
  updateCategory,
} from '../actions'
import Text from '@/components/input/text'
import SubmitButton from '@/components/input/submit-button'
import { Option } from '@/lib/types'
import { AlertModal } from '@/components/other/modal/alert-modal'
import Combobox from '@/components/input/combobox'
import { Category, CategoryTranslationSchema } from '../interface'
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

export const IMG_MAX_LIMIT = 1

interface CategoryFormProps {
  initialData: any | null
  allCategories: Category[]
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData: category,
  allCategories,
}) => {
  const locale = 'fa' //  from formData
  const router = useRouter()
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canCreate = authorize(userRoles, 'category.create')
  const canEdit = authorize(
    userRoles,
    category?.user.id !== user?.id ? 'category.edit.any' : 'category.edit.own',
  )
  const canDelete = authorize(
    userRoles,
    category?.user.id !== user?.id
      ? 'category.delete.any'
      : 'category.delete.own',
  )
  const translation: CategoryTranslationSchema =
    category?.translations?.find(
      (t: CategoryTranslationSchema) => t.lang === locale,
    ) ||
    category?.translations[0] ||
    {}
  const formRef = useRef<HTMLFormElement>(null)
  const initialState = {
    message: null,
    errors: {},
    values: { ...category, translation },
  }
  const actionHandler = category
    ? updateCategory.bind(null, String(category.id))
    : createCategory
  const [state, dispatch] = useActionState(actionHandler as any, initialState)

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const title = category ? 'ویرایش دسته بندی' : 'افزودن دسته بندی'
  const description = category ? 'ویرایش دسته بندی' : 'افزودن دسته بندی'

  const parentOptions: Option[] = allCategories.map((category: Category) => {
    const translation: any =
      category?.translations?.find((t: any) => t.lang === locale) ||
      category?.translations[0] ||
      {}

    return {
      value: String(category.id),
      label: createCatrgoryBreadcrumb(category, translation?.title),
    }
  })

  const statusOptions = [
    {
      label: 'فعال',
      value: 'active',
    },
    {
      label: 'غیر فعال',
      value: 'inactive',
    },
  ]
  const onDelete = async () => {
    try {
      setLoading(true)
      const deleteResult = await deleteCategorysAction([category?.id])
      if (deleteResult?.success) router.replace('/dashboard/categories')
      else {
        setOpen(false)
        setLoading(false)
        if (deleteResult?.success) toast.success(deleteResult?.message)
        else toast.error(deleteResult?.message)
      }
    } catch (error: any) {}
  }

  useEffect(() => {
    console.log('#234kuiyh state:', state)
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
          <input
            type="text"
            name="lang"
            className="hidden"
            value="fa"
            readOnly
          />

          {/* Title */}
          <Text
            title="عنوان"
            name="title"
            defaultValue={state?.values?.translation?.title || ''}
            placeholder="عنوان"
            state={state}
            icon={<CategoryIcon className="w-4 h-4" />}
          />
          <Text
            title="نامک"
            name="slug"
            defaultValue={state?.values?.slug || ''}
            placeholder="نامک"
            state={state}
            icon={<Tag className="w-4 h-4" />}
          />
          {/* Parent */}
          <Combobox
            title="دسته والد"
            name="parent"
            defaultValue={state?.values?.parent?.id}
            options={parentOptions}
            placeholder="دسته والد"
            state={state}
            icon={<ListTree className="w-4 h-4" />}
          />
          {/* description contentJson*/}

          <Label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            توضیحات
          </Label>
          <TiptapEditorLazy
            attachedFilesTo={[
              { feature: 'category', id: category?.id || null },
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
            <SubmitButton loading={loading} className="my-4 w-full" />
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
            <IconPicker
              title="آیکون"
              name="icon"
              defaultValue={state?.values?.icon}
            />
            <FileUpload
              title="تصویر شاخص دسته بندی"
              name="image"
              state={state}
              maxFiles={1}
              allowedFileTypes={['image']}
              defaultValues={state?.values?.image}
              onLoading={setLoading}
            />
          </StickyBox>
        </div>
      </form>
    </>
  )
}
