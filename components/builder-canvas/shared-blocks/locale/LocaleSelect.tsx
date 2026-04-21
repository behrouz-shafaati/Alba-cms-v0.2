'use client'
import Select from '@/components/input/select'
import { Option } from '@/lib/types'
import { useRouter } from 'next/navigation'

type props = {
  localeOptions: Option[]
  locale: string
  hrefArr: string[]
}

export default function LocaleSelect({
  localeOptions,
  locale,
  hrefArr,
}: props) {
  const router = useRouter()
  return (
    <div className="w-fit">
      <Select
        title=""
        name="locale"
        defaultValue={locale}
        options={localeOptions}
        placeholder={''}
        onChange={(value) => {
          const href = `${window.location.protocol}//${hrefArr[2]}/${value}/${hrefArr
            .slice(3)
            .filter((slug) => slug != locale)
            .join('/')}`
          console.log('#234 href:', href.slice(0, -1))
          router.push(href)
        }}
      />
    </div>
  )
}
