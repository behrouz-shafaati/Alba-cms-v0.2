'use client'

import { Block } from '../../types'
import { useEffect, useState } from 'react'
import { getLocaleSettingsAction } from '@/lib/features/settings/actions'
import LocaleSelect from './LocaleSelect'

type props = {
  locale: string
  blockData: {
    content: {}
    type: 'locale'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default function Locale({ blockData, locale, ...props }: props) {
  const [locales, setLocales] = useState({ localeOptions: [] })
  const [hrefArr, setHrefArr] = useState([])

  useEffect(() => {
    const getData = async () => {
      const href = window.location.href
      const hrefArr = href.split('/')
      setHrefArr(hrefArr)

      const languageSettings = await getLocaleSettingsAction()
      setLocales(languageSettings)
    }

    getData()
  }, [])

  return (
    <div className="w-fit">
      <LocaleSelect
        hrefArr={hrefArr}
        locale={locale}
        localeOptions={locales.localeOptions}
        key={locale}
      />
    </div>
  )
}
