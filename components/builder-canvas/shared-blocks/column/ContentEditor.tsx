// پنل تنظیمات برای این بلاک
import React from 'react'
import { useBuilderStore } from '../../store/useBuilderStore'
import { useDebouncedCallback } from 'use-debounce'
import FileUpload from '@/components/input/file-upload'

type Props = {
  savePage: () => void
}

const ContentEditor = ({ savePage }: Props) => {
  const { updateRowColumns, update, selectedBlock } = useBuilderStore()

  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => update(id, key, form),
    400,
  )

  return (
    <>
      <FileUpload
        key={`image-block-${selectedBlock?.id}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
        name="image"
        title="پس زمینه"
        maxFiles={1}
        defaultValues={
          selectedBlock?.settings?.bgMedia
            ? [selectedBlock?.settings?.bgMedia]
            : null
        }
        updateFileDetailsHandler={(files) => {
          update(selectedBlock?.id as string, 'settings', {
            bgMedia: {
              id: files[0].id,
              srcMedium: files[0].srcMedium,
              srcSmall: files[0].srcSmall,
            },
          })
        }}
        deleteFileHnadler={(fileId) => {
          update(selectedBlock?.id as string, 'settings', {
            ...selectedBlock?.settings,
            bgMedia: null,
          })
          requestAnimationFrame(() => {
            savePage?.()
          })
        }}
        showDeleteButton={true}
        allowedFileTypes={['image', 'video']}
      />
    </>
  )
}

export default ContentEditor
