import Link from 'next/link'
import './globals.css'

export const dynamic = 'force-static'

export default function Home() {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
          <h1>Alba CMS</h1>
          <p>Hi to alba</p>
          <Link href={'/about'} target="_self">
            Go to About Page
          </Link>
        </main>
      </body>
    </html>
  )
}
