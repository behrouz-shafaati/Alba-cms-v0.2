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
    400
  )
  const defaultValu =
    selectedBlock?.content?.srcMedium !== null ? selectedBlock?.content : null
  console.log(
    '#345 selectedBlock?.settings?.responsiveDesign:',
    selectedBlock?.settings?.responsiveDesign
  )
  return (
    <>
      <div className="flex flex-col gap-3 py-4">
        <Label>چینش ستون</Label>
        <ColumnLayoutCombobox
          key={`block-${selectedBlock.id}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
          value={selectedBlock.settings.rowColumns}
          onChange={(value) => {
            updateRowColumns(selectedBlock.id as string, value)
            debouncedUpdate(selectedBlock.id as string, 'settings', {
              ...selectedBlock?.settings,
              rowColumns: value,
            })
          }}
        />
      </div>

      {/* responsive design  */}

      <Checkbox
        name="responsiveDesign"
        title="طراحی ریسپانسیو"
        defaultChecked={selectedBlock?.settings?.responsiveDesign ?? true}
        onChange={(value: boolean) => {
          debouncedUpdate(selectedBlock?.id as string, 'settings', {
            ...selectedBlock?.settings,
            responsiveDesign: value,
          })
        }}
      />
      {/* sticky  */}

      <Checkbox
        name="sticky"
        title="چسبان"
        defaultChecked={selectedBlock?.settings?.sticky ?? false}
        onChange={(value: boolean) => {
          debouncedUpdate(selectedBlock?.id as string, 'settings', {
            ...selectedBlock?.settings,
            sticky: value,
          })
        }}
      />

      <FileUpload
        key={`image-block-${selectedBlock?.id}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
        name="image"
        title="پس زمینه"
        maxFiles={1}
        defaultValues={defaultValu}
        updateFileDetailsHandler={(files) => {
          // console.log('#88237 updaTED DATA: ', files)
          update(selectedBlock?.id as string, 'bgMedia', { id: files[0].id })
        }}
        deleteFileHnadler={(fileId) => {
          update(selectedBlock?.id as string, 'bgMedia', {})
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
