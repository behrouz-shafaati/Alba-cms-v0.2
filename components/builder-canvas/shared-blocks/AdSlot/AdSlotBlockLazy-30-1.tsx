'use client'
import dynamic from 'next/dynamic'
import { BannerGroupFallback } from './BannerGroupFallback'

// کاملاً خارج از باندل اولیه
const AdSlotBlock = dynamic(() => import('./AdSlotBlock'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => (
    <BannerGroupFallback
      blockData={{ settings: { aspect: '30/1' } }}
      id=""
      type="adSlot"
    />
  ),
})

export default function AdSlotBlockLazy_30_1(props: any) {
  return <AdSlotBlock {...props} />
}
