import { Permission } from '../features/permissions/interface'

export type SupportedLanguage = 'en' | 'fa'
export type PageComponentProps = {
  locale?: SupportedLanguage
}

export type Option = {
  label: string
  value: string
}

export type UserSession = {
  id: string
  name: string
  email: string
  roles: string[]
  image: { srcSmall: string }
  locale: string
}

export type Session = {
  user: UserSession
  expires: string
}

export type FormActionState = {
  errors?: any
  values?: any
  message: string | null
  success: boolean
}

export interface NavItem {
  slug: string
  title: string
  href: string
  disabled?: boolean
  external?: boolean
  icon?: string
  label?: string
  description?: string
  authorized?: Permission[]
}

export interface SidebarNavItem extends NavItem {
  sub?: NavItem[]
}
