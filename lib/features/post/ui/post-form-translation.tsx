'use client'
import { useSearchParams } from 'next/navigation'
import { Category } from '@/lib/features/category/interface'
import getTranslation from '@/lib/utils/getTranslation'
import { PostForm } from './post-form'

interface PostFormProps {
  initialData: any | null
  allCategories: Category[]
  settings: any
}

export const PostFormTranslation: React.FC<PostFormProps> = ({
  initialData: post,
  allCategories,
  settings,
}) => {
  const searchParams = useSearchParams()
  const localedFallback = settings.language?.siteDefault

  const locale = searchParams.get('locale') ?? localedFallback

  const translation: any = getTranslation({
    locale,
    translations: post?.translations,
  })
  const initialState = {
    message: null,
    errors: {},
    values: { ...post, translation },
  }

  return (
    <PostForm
      post={post}
      allCategories={allCategories}
      settings={settings}
      initialState={initialState}
      key={locale}
    />
  )
}
