'use client'

import { useState, useRef } from 'react'
import styles from './Select.module.css'
import SelectPanel from './SelectPanel'
import { SelectProps } from './types'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useClickOutside } from '@/hooks/useClickOutside'

export default function Select({
  value,
  onChange,
  options = [],
  onSearch,
  placeholder = 'انتخاب کنید',
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')

  useClickOutside(ref as React.RefObject<HTMLElement>, () => setOpen(false))

  return (
    <div className={styles.root} ref={ref}>
      <button
        className={styles.trigger}
        onClick={() => setOpen(true)}
        type="button"
      >
        {value?.label ?? placeholder}
      </button>

      {open && (
        <SelectPanel
          isMobile={isMobile}
          options={options}
          onSearch={onSearch}
          onSelect={(opt) => {
            onChange(opt)
            setOpen(false)
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}
