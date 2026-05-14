import userCtrl from '@/lib/features/user/controller'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  userCtrl //to initial load
  return <> {children} </>
}
