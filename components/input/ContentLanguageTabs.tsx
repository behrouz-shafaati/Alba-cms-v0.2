'use client'

import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { Label } from '../ui/label'
import { Settings } from '@/lib/features/settings/interface'
import getLocaleOptions from '@/lib/utils/getLocaleOptions'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

type ContentLanguageTabsProps = {
  settings: Settings
  defaultValue?: string
  name?: string
  onChange?: (locale: string) => void
}

export function ContentLanguageTabs({
  settings,
  defaultValue,
  name = 'locale',
  onChange,
}: ContentLanguageTabsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const locales = getLocaleOptions(settings.language?.locales)

  const fallback = defaultValue ?? settings.language?.siteDefault

  const initial =
    searchParams.get('locale') ??
    locales.find((l) => l.value === fallback)?.value ??
    locales[0]?.value

  const [active, setActive] = useState(initial)

  // sync state if url changes (back/forward)
  useEffect(() => {
    const locale = searchParams.get('locale')
    if (locale && locale !== active) {
      setActive(locale)
    }
  }, [searchParams, active])

  function selectLocale(value: string) {
    setActive(value)
    onChange?.(value)

    const params = new URLSearchParams(searchParams.toString())
    params.set('locale', value)

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    })
  }

  if (!locales.length) return null

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="mb-2 block text-sm font-medium">
        Content language
      </Label>

      <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1 max-w-fit">
        {locales.map((locale) => {
          const isActive = locale.value === active
          return (
            <button
              key={locale.value}
              type="button"
              onClick={() => selectLocale(locale.value)}
              className={clsx(
                'px-3 py-1.5 text-sm rounded-md transition',
                isActive
                  ? 'bg-background shadow text-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              )}
              dir={locale.dir}
            >
              {locale.label}
            </button>
          )
        })}
      </div>

      {/* hidden input for form submit */}
      <input type="hidden" name={name} value={active} />
    </div>
  )
}
