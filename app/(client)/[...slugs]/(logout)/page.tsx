'use client'
import { useEffect } from 'react'

type PageProps = {
  locale: string
  userName: string
  searchParams: Promise<{
    query?: string
    page?: string
  }>
}
export default function LogoutPage({
  locale,
  userName,
  searchParams,
}: PageProps) {
  useEffect(() => {
    const logout = async () => {
      await fetch('/api/logout', {
        method: 'POST',
      })
      window.location.href = `/${locale}/login` // یا هر صفحه‌ای که می‌خوای
    }
    logout()
  }, [])
  return <div>Loging out...</div>
}
