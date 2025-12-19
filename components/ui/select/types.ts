import { Option } from '@/lib/types/types'

export interface SelectProps {
  value?: Option | null
  onChange: (option: Option) => void

  /** local options (optional) */
  options?: Option[]

  /** server search (optional) */
  onSearch?: (query: string) => Promise<Option[]>

  placeholder?: string
}

export interface SelectPanelProps {
  isMobile: boolean

  options: Option[]

  /** اگر وجود داشته باشد → search آنلاین */
  onSearch?: (query: string) => Promise<Option[]>

  onSelect: (option: Option) => void
  onClose: () => void
}
