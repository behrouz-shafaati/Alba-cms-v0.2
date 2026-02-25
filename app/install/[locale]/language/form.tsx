'use client'
import Combobox from '@/components/input/combobox'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/hooks/useLocale'
import { writeConfigAction } from '@/lib/config/action'
import { Option } from '@/lib/types'
import Link from 'next/link'
import { useState } from 'react'

export default function SelectLanguageForm() {
  const t = useLocale()
  const [nextHref, seNextHref] = useState('/install/en/db')

  const options: Option[] = [
    { label: 'English', value: 'en' },
    { label: 'فارسی', value: 'fa' },
  ]

  const handleSelectLanguage = async (locale: string) => {
    await writeConfigAction({
      language: { dashboardDefault: locale },
    })
    seNextHref(`/install/${locale}/db`)
    localStorage.setItem('locale', locale)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 py-24">
        <Combobox
          name="lang"
          title={t.shared.chooseYorLanguage}
          options={options}
          onChange={(option) => handleSelectLanguage(option.value)}
        />
      </div>
      <div className="flex justify-between">
        <div className="w-[25vw]"></div>
        <Button variant="default" className="p-0">
          <Link href={nextHref} className="py-2 px-4">
            {t.shared.next}
          </Link>
        </Button>
      </div>
    </div>
  )
}
