// پنل تنظیمات برای این بلاک
import React from 'react'
import { useBuilderStore } from '../../store/useBuilderStore'
import { useDebouncedCallback } from 'use-debounce'
import { Label } from '@radix-ui/react-dropdown-menu'
import ColumnLayoutCombobox from '../row/ui/ColumnLayoutCombobox'
import CheckboxInput from '@/components/input/checkbox'

const ContentEditor = () => {
  const { updateRowColumns, update, selectedBlock } = useBuilderStore()

  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => update(id, key, form),
    400,
  )

  return (
    <>
      <div className="flex flex-col gap-3 py-4">
        <Label>چینش ستون</Label>
        <ColumnLayoutCombobox
          key={`block-${selectedBlock.id}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
          value={selectedBlock.content.colspans}
          onChange={(value) => {
            updateRowColumns(selectedBlock.id as string, value)
            debouncedUpdate(selectedBlock.id as string, 'content', {
              ...selectedBlock?.content,
              colspans: value,
            })
          }}
        />
      </div>
      {/* responsive design  */}

      <CheckboxInput
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
    </>
  )
}

export default ContentEditor
