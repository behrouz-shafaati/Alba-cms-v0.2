import userCtrl from '@/lib/features/user/controller'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  userCtrl
  return <> {children} </>
}
