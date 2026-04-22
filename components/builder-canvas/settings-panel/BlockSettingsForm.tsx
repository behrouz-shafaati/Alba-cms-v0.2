import validator from '@rjsf/validator-ajv8'
import { useBuilderStore } from '../store/useBuilderStore'
import { useDebouncedCallback } from 'use-debounce'
import { TailwindForm } from '../../rjsf/shadcn-theme'
import CustomFieldTemplate from '@/components/rjsf/templates/CustomFieldTemplate'
import { buildUiSchemaFromX } from '@/components/rjsf/utils/buildUiSchemaFromX'

type BlockSettingsFormProps = {
  savePage: () => void
  blockDef: any
}

export const BlockSettingsForm = ({
  savePage,
  blockDef,
}: BlockSettingsFormProps) => {
  const { selectedBlock, update } = useBuilderStore()

  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => update(id, key, form),
    400,
  )

  if (!selectedBlock) return null
  const schema = blockDef?.settingsSchema
  const ContentEditor = blockDef?.ContentEditor

  if (!schema && !ContentEditor)
    return <div>تنظیماتی برای این بلاک وجود ندارد.</div>

  console.log('#234**** selectedBlock:', selectedBlock)
  return (
    <>
      {ContentEditor && (
        <ContentEditor
          key={`content-block-${selectedBlock.id}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
          savePage={savePage}
        />
      )}
      <TailwindForm
        key={`content-${selectedBlock.id}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
        schema={schema}
        // uiSchema={uiSchema}
        uiSchema={buildUiSchemaFromX(schema)}
        formData={selectedBlock.content}
        validator={validator}
        onChange={
          (e) => debouncedUpdate(selectedBlock.id, 'content', e.formData)
          // debouncedUpdate(selectedBlock.id, 'settings', e.formData)
        }
        showErrorList={false}
        omitExtraData
        noHtml5Validate
        liveValidate
        widgets={{}} // می‌تونی در آینده کاستوم‌سازی کنی
        templates={{
          FieldTemplate: CustomFieldTemplate,
          //  حذف دکمه Submit
          ButtonTemplates: {
            SubmitButton: () => null,
          },
        }}
      />
    </>
  )
}
