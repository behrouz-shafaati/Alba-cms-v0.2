// پنل تنظیمات برای این بلاک
'use client'

import { useBuilderStore } from '@/components/builder-canvas/store/useBuilderStore'
import Combobox from '@/components/input/combobox'
import { getAllSections } from '@/lib/features/section/actions'
import { Template } from '@/features/template/interface'
import { Option } from '@/types'
import { useEffect, useState } from 'react'

type Props = {
  initialData: any
  savePage: () => void
}

export const ContentEditor = ({ initialData, savePage }: Props) => {
  const { selectedBlock, update } = useBuilderStore()
  const [templateOptions, setTemplateOptions] = useState<Option[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const [allTemplates] = await Promise.all([getAllSections()])
      const templateOptions: Option[] = allTemplates.data.map(
        (template: Template) => ({
          value: String(template.id),
          label: template.title,
        }),
      )

      setTemplateOptions(templateOptions)
    }

    fetchData()
  }, [])
  return (
    <div key={templateOptions.length}>
      <Combobox
        title="قطعه قالب"
        name="templateId"
        defaultValue={selectedBlock?.content?.templateId || ''}
        options={templateOptions}
        placeholder="انتخاب قالب"
        onChange={(e) =>
          update(selectedBlock?.id as string, 'content', {
            ...selectedBlock?.content,
            templateId: e.target.value,
          })
        }
      />
    </div>
  )
}
