import Text from '../input/text'
import { HeadingIcon } from 'lucide-react'
import { useBuilderStore } from '../builder-canvas/store/useBuilderStore'
import { useDebouncedCallback } from 'use-debounce'
import { ContentLanguageTabs } from '../input/ContentLanguageTabs'
import { cloneTemplateSegmentAction } from '@/lib/features/templateSegment/actions'

type SettingsPanelProp = {
  templateSegmentId: string
  siteSettings: any
  locale: string
}

function SettingsPanel({
  templateSegmentId,
  siteSettings,
  locale,
}: SettingsPanelProp) {
  const { update, content } = useBuilderStore()
  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => update(id, key, form),
    400,
  )

  const clone = async (from: string, to: string) => {
    const result = await cloneTemplateSegmentAction(templateSegmentId, from, to)
    if (result?.success) window.location.reload()
  }
  console.log('#@34 locale in settings pannel: ', locale)
  return (
    <>
      <ContentLanguageTabs settings={siteSettings} clone={clone} />
      <Text
        title="عنوان"
        name="title"
        defaultValue={content.title || ''}
        placeholder="عنوان"
        icon={<HeadingIcon className="h-4 w-4" />}
        className=""
        onChange={(e) => debouncedUpdate(null, 'title', e.target.value)}
      />
    </>
  )
}

export default SettingsPanel
