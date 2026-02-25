import type { NextConfig } from 'next'
import bundleAnalyzer from '@next/bundle-analyzer'

const nextConfig: NextConfig = {
  images: {
    domains: [], // نیازی به دامنه نیست برای تصاویر محلی
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/images/**',
      },
      {
        protocol: 'http',
        hostname: 'ali1354.ir',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'ali1354.ir',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  experimental: {
    cpus: 1,
    workerThreads: false,
    serverActions: {
      optimizeCss: true,
      bodySizeLimit: '10mb',
      optimizePackageImports: ['lucide-react', '@radix-ui/*'],
    },
  },
  compiler: {
    // 👇 کد جاوااسکریپت مدرن‌تر و کوچیک‌تر
    removeConsole: process.env.NODE_ENV === 'production', // باعث میشه همه console.log ها در Production حذف بشن
  },
  // فشرده‌سازی
  compress: true,

  // تولید Source Map فقط در Dev
  productionBrowserSourceMaps: false,
  typescript: {
    ignoreBuildErrors: true,
  },
}

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig)
