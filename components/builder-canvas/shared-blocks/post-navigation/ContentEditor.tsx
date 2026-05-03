// پنل تنظیمات برای این بلاک
'use client'
import React, { useEffect, useState } from 'react'
import { useBuilderStore } from '@/components/builder-canvas/store/useBuilderStore'
import MultipleSelector from '@/components/input/multiple-select'
import { Option } from '@/lib/types'
import {
  Category,
  CategoryTranslationSchema,
} from '@/lib/features/category/interface'
import createCatrgoryBreadcrumb from '@/lib/utils/createCatrgoryBreadcrumb'
import { getAllCategories } from '@/lib/features/category/actions'
import { getAllTags, searchTags } from '@/lib/features/tag/actions'
import Text from '@/components/input/text'
import { Tag, TagTranslationSchema } from '@/lib/features/tag/interface'
import Switch from '@/components/input/switch'
import { getAllMenus } from '@/lib/features/menu/actions'
import { Menu, MenuTranslationSchema } from '@/lib/features/menu/interface'
import { useLocale } from '@/hooks/useLocale'
import getTranslation from '@/lib/utils/getTranslation'
import Combobox from '@/components/input/combobox'

type Props = {
  initialData: any
  savePage: () => void
}

export const ContentEditor = ({ initialData, savePage }: Props) => {
  const dic = useLocale()
  const locale = dic.lang
  const { selectedBlock, update } = useBuilderStore()
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([])
  const [menuOptions, setMenuOptions] = useState<Option[]>([])
  const [tagOptions, setTagOptions] = useState<Option[]>([])
  useEffect(() => {
    const fetchData = async () => {
      const [allMenus, allCategories, allTags] = await Promise.all([
        getAllMenus(),
        getAllCategories(),
        getAllTags(),
      ])
      const categoryOptions: Option[] = allCategories.data.map(
        (category: Category) => {
          const translation: CategoryTranslationSchema =
            category?.translations?.find(
              (t: CategoryTranslationSchema) => t.lang === locale,
            ) ||
            category?.translations[0] ||
            {}
          return {
            value: String(category.id),
            label: createCatrgoryBreadcrumb(category, translation?.title),
            slug: category.slug,
          }
        },
      )

      const tagOptions: Option[] = allTags.data.map((tag: Tag) => {
        const translation: TagTranslationSchema = getTranslation({
          translations: tag?.translations,
          locale,
        })
        return {
          value: String(tag.id),
          label: createCatrgoryBreadcrumb(tag, translation?.title),
          slug: tag.slug,
        }
      })
      setCategoryOptions(categoryOptions)
      setTagOptions(tagOptions)

      const menuOptions: Option[] = allMenus.data.map((menu: Menu) => {
        const translation: MenuTranslationSchema = getTranslation({
          translations: menu?.translations,
          locale,
        })
        return {
          value: String(menu.id),
          label: translation?.title,
        }
      })
      setMenuOptions([{ value: '', label: 'None' }, ...menuOptions])
    }
    fetchData()
  }, [selectedBlock?.content?.tags])

  return (
    <div key={categoryOptions.length}>
      <Combobox
        key={`menu-block-${menuOptions.length}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
        title="فهرست"
        name="menuId"
        defaultValue={selectedBlock?.content?.menuId || ''}
        options={menuOptions}
        placeholder="انتخاب فهرست"
        onChange={(e) =>
          update(selectedBlock?.id as string, 'content', {
            ...selectedBlock?.content,
            menuId: e.value,
          })
        }
      />
      {!selectedBlock?.content?.menuId && (
        <>
          {/* categories */}
          <MultipleSelector
            title="دسته"
            name="categories"
            defaultValues={selectedBlock?.content?.categories ?? []}
            placeholder="دسته های هدف"
            defaultSuggestions={categoryOptions}
            onChange={(values) => {
              update(selectedBlock?.id as string, 'content', {
                ...selectedBlock?.content,
                categories: values,
              })
            }}
            disabled={selectedBlock?.content?.usePageCategory ?? false}
            // icon={ShieldQuestionIcon}
          />
          <Switch
            name="usePageCategory"
            title="مطالب مرتبط با دسته‌ی صفحه‌ی جاری"
            defaultChecked={selectedBlock?.content?.usePageCategory ?? false}
            onChange={(values) => {
              update(selectedBlock?.id as string, 'content', {
                ...selectedBlock?.content,
                usePageCategory: values,
              })
            }}
          />
          {/* tags */}
          <MultipleSelector
            title="برچسب"
            name="tags"
            defaultValues={selectedBlock?.content?.tags ?? []}
            placeholder="برچسب های هدف"
            defaultSuggestions={tagOptions}
            onChange={(values) => {
              update(selectedBlock?.id as string, 'content', {
                ...selectedBlock?.content,
                tags: values,
              })
            }}
            onSearch={searchTags}
            // icon={ShieldQuestionIcon}
          />
        </>
      )}
    </div>
  )
}
