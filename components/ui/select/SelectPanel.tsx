'use client'

import { useEffect, useState } from 'react'
import styles from './Select.module.css'
import { SelectPanelProps } from './types'
import { Option } from '@/lib/types/types'

export default function SelectPanel({
  isMobile,
  options,
  onSearch,
  onSelect,
  onClose,
}: SelectPanelProps) {
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<Option[]>(options)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true

    const run = async () => {
      if (!onSearch) {
        setItems(
          options.filter((o) =>
            o.label.toLowerCase().includes(query.toLowerCase())
          )
        )
        return
      }

      setLoading(true)
      const result = await onSearch(query)
      if (active) {
        setItems(result)
        setLoading(false)
      }
    }

    const timeout = setTimeout(run, 300)
    return () => {
      active = false
      clearTimeout(timeout)
    }
  }, [query, onSearch, options])

  return (
    <div className={isMobile ? styles.mobilePanel : styles.desktopPanel}>
      <input
        className={styles.search}
        placeholder="جستجو..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />

      {loading && <div className={styles.loading}>در حال جستجو...</div>}

      <ul className={styles.list}>
        {items.map((opt) => (
          <li
            key={opt.value}
            className={styles.item}
            onClick={() => onSelect(opt)}
          >
            {opt.label}
          </li>
        ))}
      </ul>

      {isMobile && (
        <button type="button" className={styles.close} onClick={onClose}>
          بستن
        </button>
      )}
    </div>
  )
}
