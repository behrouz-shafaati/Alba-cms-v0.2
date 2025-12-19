// lib/admin/types.ts
export type AdminUser = {
  id: string
  email: string
  role: 'admin' | 'editor'
}

export type AdminSettings = {
  locale: 'fa' | 'en'
  dir: 'rtl' | 'ltr'
  theme: 'light' | 'dark'
}

export type DashboardContextValue = {
  user: AdminUser
  settings: AdminSettings
}
