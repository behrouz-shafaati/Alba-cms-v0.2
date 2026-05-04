import { HeadingIcon, MailIcon } from 'lucide-react'
import Text from '../input/text'
import { useDebouncedCallback } from 'use-debounce'
import Select from '../input/select'
import { useBuilderStore } from '../builder-canvas/store/useBuilderStore'
import TextArea from '../input/textArea'
import { cloneFormAction } from '@/lib/features/form/actions'
import { ContentLanguageTabs } from '../input/ContentLanguageTabs'

type SettingsPanelProp = {
  formId: string
  siteSettings: any
  locale: string
}

function SettingsPanel({ formId, siteSettings, locale }: SettingsPanelProp) {
  const { update, getJson } = useBuilderStore()
  // const document = JSON.parse(getJson())
  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => update(id, key, form),
    400,
  )

  const statusOptions = [
    {
      label: 'فعال',
      value: 'active',
    },
    {
      label: 'غیرفعال',
      value: 'deactive',
    },
  ]

  const clone = async (from: string, to: string) => {
    const result = await cloneFormAction(formId, from, to)
    if (result?.success) window.location.reload()
  }

  return (
    <>
      <ContentLanguageTabs settings={siteSettings} clone={clone} />
      <Text
        title="عنوان فرم"
        name="title"
        defaultValue={JSON.parse(getJson()).title || ''}
        placeholder="عنوان"
        icon={<HeadingIcon className="h-4 w-4" />}
        className=""
        onChange={(e) => debouncedUpdate(null, 'title', e.target.value)}
      />
      <TextArea
        title="پیام ارسال موفق"
        name="successMessage"
        defaultValue={JSON.parse(getJson()).successMessage || ''}
        placeholder="پیام شما با موفقیت ارسال شد"
        className=""
        onChange={(e) =>
          debouncedUpdate(null, 'successMessage', e.target.value)
        }
      />
      <Select
        title="وضعیت"
        name="status"
        defaultValue={JSON.parse(getJson()).status || 'active'}
        options={statusOptions}
        placeholder="وضعیت"
        icon={<MailIcon className="w-4 h-4" />}
        onChange={(value) => debouncedUpdate(null, 'status', value)}
      />
    </>
  )
}

export default SettingsPanel
