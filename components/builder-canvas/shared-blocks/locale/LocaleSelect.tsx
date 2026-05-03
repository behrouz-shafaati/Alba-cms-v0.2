'use client'
import Select from '@/components/input/select'
import { Option } from '@/lib/types'
import { Languages } from 'lucide-react'
import { useRouter } from 'next/navigation'

type props = {
  localeOptions: Option[]
  locale: string
  hrefArr: string[]
  siteDefault: string
  className: string
  style: object
}

export default function LocaleSelect({
  localeOptions,
  locale,
  hrefArr,
  siteDefault,
  className,
  style,
}: props) {
  const router = useRouter()
  const handleChangeLocale = (newLocale: string) => {
    const href =
      newLocale === siteDefault
        ? `${window.location.protocol}//${hrefArr[2]}/${hrefArr
            .slice(3)
            .filter((slug) => slug != locale)
            .join('/')}`
        : `${window.location.protocol}//${hrefArr[2]}/${newLocale}/${hrefArr
            .slice(3)
            .filter((slug) => slug != locale)
            .join('/')}`
    router.push(href)
  }
  return (
    <div className="w-fit">
      <Select
        title=""
        name="locale"
        className="mb-0"
        defaultValue={locale}
        options={localeOptions}
        placeholder={''}
        onChange={handleChangeLocale}
        icon={<Languages className={`w-4 h-4 ${className}`} style={style} />}
      />
    </div>
  )
}
