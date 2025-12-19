'use client'
import Select from '@/components/ui/select/Select'
import { writeState } from '@/lib/install/state'
import { Option } from '@/lib/types/types'

export default function SelectLanguageForm() {
  async function setLang(formData: FormData) {
    // 'use server'
    // const lang = formData.get('lang') as 'fa' | 'en'
    // // cookies().set('locale', lang)
    // writeState({ language: { done: true, value: lang } })
  }

  const options: Option[] = [
    { label: 'English', value: 'en' },
    { label: 'فارسی', value: 'fa' },
  ]

  return (
    <form action={setLang} className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Select
          options={options}
          onChange={(option) => console.log('#234 selected option:', option)}
        />
      </div>
    </form>
  )
}
