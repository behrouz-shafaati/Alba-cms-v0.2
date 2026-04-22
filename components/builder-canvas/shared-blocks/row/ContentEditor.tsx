// پنل تنظیمات برای این بلاک
import { useBuilderStore } from '../../store/useBuilderStore'
import { useDebouncedCallback } from 'use-debounce'
import Checkbox from '@/components/input/checkbox'
import ColumnLayoutCombobox from './ui/ColumnLayoutCombobox'
import { Label } from '@/components/ui/label'
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
  console.log(
    '#345 selectedBlock?.content?.responsiveDesign:',
    selectedBlock?.content?.responsiveDesign,
  )
  return (
    <>
      <div className="flex flex-col gap-3 py-4">
        <Label>چینش ستون</Label>
        <ColumnLayoutCombobox
          key={`block-${selectedBlock.id}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
          value={selectedBlock?.content?.rowColumns}
          onChange={(value) => {
            updateRowColumns(selectedBlock.id as string, value)
            debouncedUpdate(selectedBlock.id as string, 'content', {
              ...selectedBlock?.content,
              rowColumns: value,
            })
          }}
        />
      </div>

      {/* responsive design  */}

      <Checkbox
        name="responsiveDesign"
        title="طراحی ریسپانسیو"
        defaultChecked={selectedBlock?.content?.responsiveDesign ?? true}
        onChange={(value: boolean) => {
          debouncedUpdate(selectedBlock?.id as string, 'content', {
            ...selectedBlock?.content,
            responsiveDesign: value,
          })
        }}
      />
      {/* sticky  */}

      <Checkbox
        name="sticky"
        title="چسبان"
        defaultChecked={selectedBlock?.content?.sticky ?? false}
        onChange={(value: boolean) => {
          debouncedUpdate(selectedBlock?.id as string, 'content', {
            ...selectedBlock?.content,
            sticky: value,
          })
        }}
      />

      <FileUpload
        key={`image-block-${selectedBlock?.id}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
        name="image"
        title="پس زمینه"
        maxFiles={1}
        defaultValues={
          selectedBlock?.content?.bgMedia
            ? [selectedBlock?.content?.bgMedia]
            : null
        }
        updateFileDetailsHandler={(files) => {
          console.log('#88237 updaTED DATA: ', files)
          update(selectedBlock?.id as string, 'content', {
            ...selectedBlock?.content,
            bgMedia: {
              id: files[0].id,
              srcMedium: files[0].srcMedium,
              srcSmall: files[0].srcSmall,
            },
          })
        }}
        deleteFileHnadler={(fileId) => {
          update(selectedBlock?.id as string, 'content', {
            ...selectedBlock?.content,
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
