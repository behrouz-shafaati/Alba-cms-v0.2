'use client'

import { Block } from '../../types'
import { useEffect, useState } from 'react'
import { getLocaleSettingsAction } from '@/lib/features/settings/actions'
import LocaleSelect from './LocaleSelect'
import computedStyles from '../../utils/computedStyles'
import { combineClassNames } from '../../utils/styleUtils'
import { cn } from '@/lib/utils'

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
  const { id, styles } = blockData

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

  const daynamicClasses = combineClassNames(computedStyles(styles))
  const daynamicStyles = { ...computedStyles(styles) }

  return (
    <div
      data-locale-widget
      className={cn(`b${id} w-fit`, daynamicClasses)}
      style={daynamicStyles}
    >
      <LocaleSelect
        hrefArr={hrefArr}
        locale={locale}
        localeOptions={locales.localeOptions}
        siteDefault={locales.siteDefault}
        key={locale}
        className={daynamicClasses}
        style={daynamicStyles}
      />
    </div>
  )
}
