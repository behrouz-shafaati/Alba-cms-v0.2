import React from 'react'
import postCtrl from '@/lib/features/post/controller'
import { notFound } from 'next/navigation'
import { BreadCrumb } from '@/components/other/breadcrumb'
import { PostForm } from '@/lib/features/post/ui/post-form'
import categoryCtrl from '@/lib/features/category/controller'
import { PostTranslationSchema } from '@/lib/features/post/interface'
import { getSettingsAction } from '@/lib/features/settings/actions'
import { PostFormTranslation } from '@/lib/features/post/ui/post-form-translation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const locale = 'fa' //  from formData
  const resolvedParams = await params
  const { id } = resolvedParams
  let post = null,
    settings,
    allCategories = {}
  let pageBreadCrumb = {
    title: 'افزودن',
    link: '/dashboard/posts/create',
  }
  ;[settings, allCategories] = await Promise.all([
    getSettingsAction(),
    categoryCtrl.findAll({}),
  ])
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
        <PostFormTranslation
          initialData={post}
          allCategories={allCategories.data}
          settings={settings}
        />
      </div>
    </>
  )
}
