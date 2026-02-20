import { useBuilderStore } from '../builder-canvas/store/useBuilderStore'
import { useDebouncedCallback } from 'use-debounce'
import Combobox from '../input/combobox'
import { Category } from '@/lib/features/category/interface'
import { getTemplateForOptions } from '@/lib/features/template/utils'

const TemplateTypeSettings = ({
  allCategories,
}: {
  allCategories: Category[]
}) => {
  const { update, getJson } = useBuilderStore()
  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => update(id, key, form),
    400,
  )
  const patternTypeOptions = getTemplateForOptions({ allCategories })

  if (JSON.parse(getJson())?.templateFor)
    return (
      <Combobox
        title="برای بخش"
        name="templateFor"
        defaultValue={JSON.parse(getJson())?.templateFor[0] || 'allPages'}
        options={patternTypeOptions}
        placeholder="برای"
        // onChange={(e) => debouncedUpdate(null, 'templateFor', e.target.value)}
        disabled={true}
      />
    )

  return <></>
}

export default TemplateTypeSettings
