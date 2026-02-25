// پنل تنظیمات برای این بلاک
'use client'
import { useEffect, useState } from 'react'
import { useBuilderStore } from '@/components/builder-canvas/store/useBuilderStore'
import Text from '@/components/input/text'
import Combobox from '@/components/input/combobox'
import { getAllCampaigns } from '@/lib/features/campaign/actions'
import { Campaign } from '@/lib/features/campaign/interface'
import Switch from '@/components/input/switch'
import { Option } from '@/lib/types'

type AdSlotContent = {
  title?: string
  linkedCampaign?: string
  isLCP?: boolean
}

type Props = {
  initialData: any
  savePage: () => void
}

export const ContentEditor = ({ initialData, savePage }: Props) => {
  const locale = 'fa'
  const { selectedBlock, update } = useBuilderStore()
  const [campaignOptions, setCampaignOptions] = useState<Option[]>([])
  useEffect(() => {
    const fetchData = async () => {
      const [allCampaigns] = await Promise.all([getAllCampaigns()])
      const campaignOptions: Option[] = allCampaigns.data.map(
        (campaign: Campaign) => {
          return {
            value: String(campaign.id),
            label: campaign.title,
          }
        },
      )
      setCampaignOptions([
        { label: 'هیچکدام', value: 'none' },
        ...campaignOptions,
      ])
    }

    fetchData()
  }, [])

  const content = selectedBlock?.content as AdSlotContent

  return (
    <div key={campaignOptions?.length}>
      <Switch
        name="isLCP"
        title="علامت‌گذاری به‌عنوان LCP"
        defaultChecked={content?.isLCP ?? false}
        onChange={(values) => {
          update(selectedBlock?.id as string, 'content', {
            ...selectedBlock?.content,
            isLCP: values,
          })
        }}
      />
      <Text
        title="عنوان جایگاه"
        name="title"
        defaultValue={content?.title || ''}
        onChange={(e) => {
          update(selectedBlock?.id as string, 'content', {
            ...selectedBlock?.content,
            title: e.target.value,
          })
        }}
      />
      <Combobox
        title="کمپین متصل"
        name="linkedCampaign"
        defaultValue={content?.linkedCampaign ?? 'none'}
        placeholder={`کمپین متصل`}
        options={campaignOptions}
        onChange={(e) => {
          update(selectedBlock?.id as string, 'content', {
            ...selectedBlock?.content,
            linkedCampaign: e.value,
          })
        }}
      />
    </div>
  )
}
