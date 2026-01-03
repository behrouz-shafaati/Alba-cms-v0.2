'use client'

import { useEffect, useState } from 'react'

export function useBrowserLocale(defaultLocale = '') {
  const [locale, setLocale] = useState(defaultLocale)

  useEffect(() => {
    const stored = localStorage.getItem('locale')
    if (stored) setLocale(stored)
  }, [])

  return locale
}
