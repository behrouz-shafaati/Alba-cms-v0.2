// پنل تنظیمات برای این بلاک
import React from 'react'
import { useBuilderStore } from '../../store/useBuilderStore'
import { useDebouncedCallback } from 'use-debounce'
import { Label } from '@radix-ui/react-dropdown-menu'
import ColumnLayoutCombobox from '../row/ui/ColumnLayoutCombobox'
import { Checkbox } from '@radix-ui/react-checkbox'

const ContentEditor = () => {
  const { updateRowColumns, update, selectedBlock } = useBuilderStore()

  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => update(id, key, form),
    400
  )

  return (
    <>
      <div className="flex flex-col gap-3 py-4">
        <Label>چینش ستون</Label>
        <ColumnLayoutCombobox
          key={`block-${selectedBlock.id}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
          value={selectedBlock.settings.sectionColumns}
          onChange={(value) => {
            updateRowColumns(selectedBlock.id as string, value)
            debouncedUpdate(selectedBlock.id as string, 'settings', {
              ...selectedBlock?.settings,
              sectionColumns: value,
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
    </>
  )
}

export default ContentEditor
