'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Braces as PostCommentIcon,
  Mail as MailIcon,
  Trash,
} from 'lucide-react'
// import { Separator } from "@/components/ui/separator";
import { Heading } from '@/components/other/ui/heading'
// import FileUpload from "@/components/FileUpload";
import {
  createPostComment,
  deletePostCommentAction,
  updatePostComment,
} from '@/lib/features/post-comment/actions'
import { AlertModal } from '@/components/other/modal/alert-modal'
import FileUpload from '@/components/input/file-upload'
import Select from '@/components/input/select'
import Combobox from '@/components/input/combobox'
import {
  Category,
  CategoryTranslationSchema,
} from '@/lib/features/category/interface'
import { Option } from '@/lib/types'
import createCatrgoryBreadcrumb from '@/lib/utils/createCatrgoryBreadcrumb'
import { Braces as CategoryIcon } from 'lucide-react'
import TagInput from '@/components/input/TagInput'
import { searchTags } from '@/lib/features/tag/actions'
import { Tag, TagTranslationSchema } from '@/lib/features/tag/interface'
import MultipleSelect from '@/components/input/multiple-select'
import Link from 'next/link'
import { createPostHref } from '../../post/utils'
import TiptapEditorLazy from '@/components/tiptap-editor/TiptapEditorLazy'

interface PostCommentFormProps {
  initialData: any | null
  allCategories: Category[]
}

export const Form: React.FC<PostCommentFormProps> = ({
  initialData: postComment,
  allCategories,
}) => {
  const locale = 'fa'
  const translation: any =
    postComment?.translations?.find((t: any) => t.lang === locale) ||
    postComment?.translations[0] ||
    {}
  const initialState = {
    message: null,
    errors: {},
    values: { ...postComment, translation },
  }

  const formRef = useRef<HTMLFormElement>(null)

  const actionHandler = postComment
    ? updatePostComment.bind(null, String(postComment.id))
    : createPostComment
  const [state, dispatch] = useActionState(actionHandler as any, initialState)
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)
  const title = postComment ? 'ویرایش  نظر' : 'افزودن نظر'
  const description = postComment ? (
    <Link target="_blank" href={createPostHref(postComment)}>
      مشاهده نظر
    </Link>
  ) : (
    'افزودن نظر'
  )

  const categoryOptions: Option[] = allCategories.map((category: Category) => {
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
      label: 'منتشر شود',
      value: 'published',
    },
    {
      label: 'پیش نویس',
      value: 'draft',
    },
  ]
  const onDelete = async () => {
    try {
      setLoading(true)
      await deletePostCommentAction([postComment?.id])
      router.replace('/dashboard/post-comments')
    } catch (error: any) {}
  }

  useEffect(() => {
    console.log('#sdf postComment state:', state)
    if (state.message && state.message !== null)
      toast({
        variant: state.success ? 'default' : 'destructive',
        description: state.message,
      })
  }, [state])

  const submitManually = () => {
    if (formRef.current) {
      formRef.current.requestSubmit() // بهترین راه
    }
  }
  const categoriesArray = Array.isArray(state.values?.categories)
    ? state.values?.categories
    : []
  const tagsArray = Array.isArray(state.values?.tags) ? state.values?.tags : []
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {postComment && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      {/* <Separator /> */}
      <form action={dispatch} ref={formRef} className="space-y-8 w-full">
        {/* Product Media image */}
        <div className="md:grid md:grid-cols-3 gap-8">
          <div className="col-span-3">
            <input
              type="text"
              name="lang"
              className="hidden"
              value="fa"
              readOnly
            />
          </div>
          {/* category */}
          <Combobox
            title="نویسنده"
            name="author"
            defaultValue={state.values?.mainCategory?.id || null}
            options={categoryOptions}
            placeholder="نویسنده"
            state={state}
            icon={<CategoryIcon className="w-4 h-4" />}
          />
          <div>
            {/* status */}
            <Select
              title="وضعیت"
              name="status"
              defaultValue={state?.values?.status || 'published'}
              options={statusOptions}
              placeholder="وضعیت"
              state={state}
              icon={<MailIcon className="w-4 h-4" />}
            />
          </div>

          {/* categories */}
          <MultipleSelect
            title="سایر دسته‌ها"
            name="categories"
            defaultValues={
              categoriesArray.map((category: Category) => {
                const translation: CategoryTranslationSchema =
                  category?.translations?.find(
                    (t: CategoryTranslationSchema) => t.lang === locale,
                  ) ||
                  category?.translations[0] ||
                  {}
                return { label: translation?.title, value: category.id }
              }) || []
            }
            placeholder="دسته‌ها"
            state={state}
            defaultSuggestions={categoryOptions}
            // icon={ShieldQuestionIcon}
            // maxSelected={1}
          />
          <div>
            <TagInput
              name="tags"
              title="برچسب ها"
              placeholder="برچسب ها را وارد کنید..."
              defaultValues={
                tagsArray.map((tag: Tag) => {
                  const translation: TagTranslationSchema =
                    tag?.translations?.find(
                      (t: CategoryTranslationSchema) => t.lang === locale,
                    ) ||
                    tag?.translations[0] ||
                    {}
                  return { label: translation?.title, value: tag.id }
                }) || []
              }
              fetchOptions={searchTags}
            />
          </div>
          <div>
            <FileUpload
              name="image"
              title="پوستر نظر"
              maxFiles={1}
              defaultValues={state.values?.image || null}
              onChange={submitManually}
            />
          </div>

          <div className="col-span-3">
            {/* contentJson */}
            <TiptapEditorLazy
              name="contentJson"
              defaultContent={
                postComment
                  ? JSON.parse(state?.values?.translation?.contentJson)
                  : {}
              }
              onChangeFiles={submitManually}
              showSubmitButton={true}
            />
          </div>
        </div>
      </form>
    </>
  )
}
