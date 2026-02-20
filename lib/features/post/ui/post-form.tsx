'use client'
import { useActionState, useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Braces as PostIcon,
  Mail as MailIcon,
  Trash,
  Video as VideoIcon,
} from 'lucide-react'
// import { Separator } from "@/components/ui/separator";
import { Heading } from '@/components/other/ui/heading'
// import FileUpload from "@/components/FileUpload";
import {
  createPost,
  deletePostsAction,
  updatePost,
} from '@/lib/features/post/actions'
import Text from '@/components/input/text'
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
// import TagInput from '@/components/form-fields/TagInput'
import { searchTags } from '@/lib/features/tag/actions'
import { Tag, TagTranslationSchema } from '@/lib/features/tag/interface'
import MultipleSelect from '@/components/input/multiple-select'
import Link from 'next/link'
import { createPostHref } from '../utils'
import SubmitButton from '@/components/input/submit-button'
import StickyBox from 'react-sticky-box'
import RelatedPostsDashboard from './dashboard/related-post'
import SeoSnippetForm from './dashboard/seo-snippet-form'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useSession } from '@/components/context/SessionContext'
import AccessDenied from '@/components/other/access-denied'
import VideoEmbed from '@/components/other/VideoEmbed'
import { searchCategories } from '../../category/actions'
import authorize from '@/lib/utils/authorize'
import { toast } from 'sonner'
import { ContentLanguageTabs } from '@/components/input/ContentLanguageTabs'
import { getEmbedUrl } from '@/components/tiptap-editor/utils'
import TiptapEditorLazy from '@/components/tiptap-editor/TiptapEditorLazy'

interface PostFormProps {
  post: any | null
  allCategories: Category[]
  settings: any
  initialState: any
}

export const PostForm: React.FC<PostFormProps> = ({
  post,
  allCategories,
  settings,
  initialState,
}) => {
  const searchParams = useSearchParams()
  const { user } = useSession()

  const userRoles = user?.roles || []
  const localedFallback = settings.language?.siteDefault

  const locale = searchParams.get('locale') ?? localedFallback

  const canCreate = authorize(userRoles, 'post.create')
  const canEdit = authorize(
    userRoles,
    post?.author?.id !== user?.id ? 'post.edit.any' : 'post.edit.own',
  )
  const canDelete = authorize(
    userRoles,
    post?.author?.id !== user?.id ? 'post.delete.any' : 'post.delete.own',
  )
  const canPublish = authorize(
    userRoles,
    post?.author?.id !== user?.id ? 'post.publish.any' : 'post.publish.own',
  )

  const formRef = useRef<HTMLFormElement>(null)

  const actionHandler = post
    ? updatePost.bind(null, String(post.id))
    : createPost
  const [state, dispatch] = useActionState(actionHandler as any, initialState)
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPrimaryVideoError, setShowPrimaryVideoError] = useState(false)
  const [primaryVideoEmbedUrl, setPrimaryVideoEmbedUrl] = useState(
    state.values?.primaryVideoEmbedUrl || '',
  )
  useEffect(() => {
    if (state.message && state.message !== null) {
      if (state.success) toast.success(state.message)
      else toast.error(state.message)
    }
  }, [state])

  if ((post && !canEdit) || !canCreate) return <AccessDenied />

  const title = post ? 'ویرایش  مطلب' : 'افزودن مطلب'
  const description = post ? (
    <Link target="_blank" href={createPostHref(post)}>
      مشاهده مطلب
    </Link>
  ) : (
    'افزودن مطلب'
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
    ...(canPublish ? [{ label: 'منتشر شود', value: 'published' }] : []),
    {
      label: 'پیش نویس',
      value: 'draft',
    },
  ]
  const onDelete = async () => {
    try {
      setLoading(true)
      const deleteResult = await deletePostsAction(post?.id)
      if (deleteResult?.success) router.replace('/dashboard/posts')
      else {
        setOpen(false)
        setLoading(false)
        toast({
          variant: deleteResult?.success ? 'default' : 'destructive',
          description: deleteResult?.message,
        })
      }
    } catch (error: any) {}
  }

  const handleChangePrimaryVideo = (url: string) => {
    const embedUrl = getEmbedUrl(url)
    if (!embedUrl) {
      setPrimaryVideoEmbedUrl('')
      setShowPrimaryVideoError(true)
      return
    }
    setPrimaryVideoEmbedUrl(embedUrl)
  }

  const submitManually = useCallback(() => {
    if (formRef.current) {
      formRef.current.requestSubmit() // بهترین راه
    }
  }, [])
  const categoriesArray = Array.isArray(state.values?.categories)
    ? state.values?.categories
    : []
  const tagsArray = Array.isArray(state.values?.tags) ? state.values?.tags : []

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {post && canDelete && (
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
      <form action={dispatch} ref={formRef} className="space-y-8 w-full">
        {/* Product Media image */}
        <div className=" md:grid md:grid-cols-12 gap-8">
          <input
            type="text"
            name="lang"
            className="hidden"
            value="fa"
            readOnly
          />

          <div className="col-span-12 md:col-span-9">
            {/* Title */}
            <Text
              title="عنوان"
              name="title"
              defaultValue={state?.values?.translation?.title || ''}
              placeholder="عنوان"
              state={state}
              icon={<PostIcon className="w-4 h-4" />}
            />
            {/* contentJson */}
            <TiptapEditorLazy
              attachedFilesTo={[{ feature: 'post', id: post?.id || null }]}
              name="contentJson"
              defaultContent={
                post ? JSON.parse(state?.values?.translation?.contentJson) : {}
              }
              onChangeFiles={submitManually}
              className="h-full"
              onLoading={setLoading}
            />
            <SeoSnippetForm
              defaultValues={state?.values || {}}
              className="mt-6"
            />
            {/* Meta Description */}
            <div className="space-y-1 mt-6">
              <Label htmlFor="metaDescription">اسکیما JSON</Label>
              <Textarea
                id="jsonLd"
                name="jsonLd"
                defaultValue={state?.values?.jsonLd || ''}
                rows={10}
                placeholder={`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "عنوان مطلب",
  "author": {
    "@type": "Person",
    "name": "Behrouz Shafaati"
  }
}`}
              />
            </div>
          </div>
          <div className="relative col-span-12 md:col-span-3 gap-2">
            <StickyBox offsetBottom={0}>
              <SubmitButton
                loading={loading}
                text="ذخیره مطلب"
                className="my-4 w-full"
              />
              <ContentLanguageTabs settings={settings} />
              {/* status */}
              <Select
                title="وضعیت"
                name="status"
                defaultValue={state?.values?.status || 'draft'}
                options={statusOptions}
                placeholder="وضعیت"
                state={state}
                icon={<MailIcon className="w-4 h-4" />}
              />
              {/* category */}
              <Combobox
                title="دسته اصلی"
                name="mainCategory"
                defaultValue={state.values?.mainCategory?.id || null}
                options={categoryOptions}
                placeholder="دسته اصلی"
                state={state}
                icon={<CategoryIcon className="w-4 h-4" />}
                fetchOptions={searchCategories}
              />
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
                placeholder="دسته‌ها را وارد کنید..."
                state={state}
                defaultSuggestions={categoryOptions}
                onSearch={searchCategories}
                // icon={ShieldQuestionIcon}
                // maxSelected={1}
              />
              {/* tags */}
              <MultipleSelect
                title="برچسب ها"
                name="tags"
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
                placeholder="برچسب ها را وارد کنید..."
                state={state}
                onSearch={searchTags}

                // icon={ShieldQuestionIcon}
              />
              {/* <TagInput
                name="tags"
                title="برچسب ها"
                placeholder="برچسب ها را وارد کنید..."
                defaultValues={
                  tagsArray.map((tag: Tag) => {
                    const translation: TagTranslationSchema =
                      tag?.translations?.find(
                        (t: CategoryTranslationSchema) => t.lang === locale
                      ) ||
                      tag?.translations[0] ||
                      {}
                    return { label: translation?.title, value: tag.id }
                  }) || []
                }
                fetchOptions={searchTags}
              /> */}
              <FileUpload
                name="image"
                title="پوستر مطلب"
                maxFiles={1}
                defaultValues={state.values?.image || null}
                onChange={submitManually}
                onLoading={setLoading}
                allowedFileTypes={['image']}
              />
              <Text
                name="primaryVideo"
                title="فیلم اصلی مطلب"
                description="لینک صفحه ی آپارات یا یوتیوب"
                defaultValue={state.values?.primaryVideo || ''}
                icon={<VideoIcon className="w-4 h-4" />}
                className="mt-8"
                onChange={(e) => {
                  handleChangePrimaryVideo(e.target.value)
                }}
              />
              <input
                name="primaryVideoEmbedUrl"
                type="hidden"
                value={primaryVideoEmbedUrl}
              />
              {primaryVideoEmbedUrl && primaryVideoEmbedUrl != '' && (
                <VideoEmbed
                  src={primaryVideoEmbedUrl}
                  title={state?.values?.translation?.title || ''}
                />
              )}
              <RelatedPostsDashboard post={post} className="my-4" />
              <div className="h-2"></div>
            </StickyBox>
          </div>
          <div className="col-span-12 md:col-span-9"></div>
          <div className="col-span-12 md:col-span-3"></div>
        </div>
      </form>
    </>
  )
}
