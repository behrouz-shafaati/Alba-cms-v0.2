'use client'
import { useSearchParams } from 'next/navigation'
import { ProductCategory } from '@/lib/features/product-category/interface'
import getTranslation from '@/lib/utils/getTranslation'
import { PostCategoryForm } from './category-form'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'

interface PostFormProps {
  initialData: any | null
  allCategories: ProductCategory[]
  settings: any
  dictionary: DashboardLocaleSchema
}

export const PostCategoryFormTranslation: React.FC<PostFormProps> = ({
  initialData: category,
  allCategories,
  settings,
  dictionary,
}) => {
  const searchParams = useSearchParams()
  const localedFallback = settings.language?.siteDefault

  const locale = searchParams?.get('locale') ?? localedFallback

  const translation: any = getTranslation({
    locale,
    translations: category?.translations,
  })
  const initialState = {
    message: null,
    errors: {},
    values: { ...category, translation },
  }
  return (
    <PostCategoryForm
      category={category}
      allCategories={allCategories}
      settings={settings}
      initialState={initialState}
      key={locale}
      dictionary={dictionary}
    />
  )
}
