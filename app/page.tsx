import '@/app/globals.css'
import AlbaFallback from '@/pages/AlbaFallback'

export const dynamic = 'force-static'

export default function Home() {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <AlbaFallback />
      </body>
    </html>
  )
}
