'use client'

import { useEffect, useState } from 'react'
import Dropdown from '../dropdown'
import DropdownItem from '../dropdown/DropdownItem'

type Theme = 'light' | 'dark' | 'system'

function applyTheme(theme: Theme) {
  const html = document.documentElement
  html.classList.remove('light', 'dark')

  if (theme === 'light') {
    html.classList.add('light')
    return
  }

  if (theme === 'dark') {
    html.classList.add('dark')
    return
  }

  // system
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.classList.add('dark')
  } else {
    html.classList.add('light')
  }
}

export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>('system')

  // sync initial theme
  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      setThemeState(stored)
      applyTheme(stored)
    } else {
      setThemeState('system')
      applyTheme('system')
    }

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (!localStorage.getItem('theme')) {
        applyTheme('system')
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // تغییر تم از دکمه
  const set = (t: Theme) => {
    if (t === 'system') {
      localStorage.removeItem('theme')
    } else {
      localStorage.setItem('theme', t)
    }

    setThemeState(t)
    applyTheme(t)
  }

  // انتخاب آیکون بر اساس تم
  const getIcon = () => {
    if (theme === 'light') return '☀️' // نور خورشید
    if (theme === 'dark') return '🌙' // ماه
    return '🖥️' // system
  }

  return (
    <Dropdown trigger={<button>{getIcon()} حالت تم</button>}>
      <DropdownItem onClick={() => set('light')}>☀️ Light</DropdownItem>
      <DropdownItem onClick={() => set('dark')}>🌙 Dark</DropdownItem>
      <DropdownItem onClick={() => set('system')}>🖥️ System</DropdownItem>
    </Dropdown>
  )
}
