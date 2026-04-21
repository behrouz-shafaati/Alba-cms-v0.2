// ورودی اصلی صفحه‌ساز (ترکیب درگ‌اند‌دراپ و بلاک رندر)
'use client'
import dynamic from 'next/dynamic'
import { Content } from './types'

const Builder = dynamic(() => import('./components/Builder'), {
  ssr: false, // مهم: جلوگیری از رندر سمت سرور
})

type BuilderCanvasProp = {
  title: string
  name: string
  submitFormHandler: any
  initialContent?: Content
  SettingsPanel: React.ReactNode
  Header: React.ReactNode
  newBlocks?: any
  locale: string
}

export default function BuilderCanvas({
  title,
  initialContent,
  name,
  submitFormHandler,
  SettingsPanel,
  Header,
  newBlocks = [],
  locale,
}: BuilderCanvasProp) {
  return (
    <Builder
      name={name}
      submitFormHandler={submitFormHandler}
      initialContent={initialContent}
      SettingsPanel={SettingsPanel}
      Header={Header}
      newBlocks={newBlocks}
      locale={locale}
    />
  )
}
