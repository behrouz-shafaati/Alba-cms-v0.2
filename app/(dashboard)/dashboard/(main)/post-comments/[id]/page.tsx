import postCtrl from '@/lib/features/post/controller'
import { notFound } from 'next/navigation'
import { BreadCrumb } from '@/components/other/breadcrumb'
import { Form } from '@/lib/features/post-comment/ui/form'
import categoryCtrl from '@/lib/features/category/controller'
import { PostTranslationSchema } from '@/lib/features/post/interface'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const locale = 'fa' //  from formData
  const resolvedParams = await params
  const { id } = resolvedParams
  let post = null
  let pageBreadCrumb = {
    title: 'افزودن',
    link: '/dashboard/posts/create',
  }
  const [allCategories] = await Promise.all([categoryCtrl.findAll({})])
  if (id !== 'create') {
    ;[post] = await Promise.all([postCtrl.findById({ id })])

    if (!post) {
      notFound()
    }
    const translation: PostTranslationSchema =
      post?.translations?.find(
        (t: PostTranslationSchema) => t.lang === locale,
      ) ||
      post?.translations[0] ||
      {}

    pageBreadCrumb = {
      title: translation?.title,
      link: `/dashboard/posts/${id}`,
    }
  }

  const breadcrumbItems = [
    { title: 'مطلب', link: '/dashboard/posts' },
    pageBreadCrumb,
  ]

  const defaultC = JSON.parse(
    '{"contentJson":{"type":"doc","content":[{"type":"paragraph","attrs":{"dir":"rtl","textAlign":null},"content":[{"type":"text","text":"سلام"}]},{"type":"paragraph","attrs":{"dir":"rtl","textAlign":null},"content":[{"type":"text","text":"s"}]},{"type":"paragraph","attrs":{"dir":"rtl","textAlign":"left"},"content":[{"type":"text","marks":[{"type":"bold"}],"text":"خوبی"}]}]}}',
  )
  console.log('defaultC:', defaultC)
  return (
    <>
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <Form initialData={post} allCategories={allCategories?.data} />
      </div>
    </>
  )
}
