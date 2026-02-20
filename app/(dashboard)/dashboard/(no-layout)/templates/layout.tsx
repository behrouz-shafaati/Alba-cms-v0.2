import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'دسته بندی ها',
  description: 'مدیریت دسته بندی های فروشگاه',
}

interface PagesLayoutProps {
  children: React.ReactNode
}

const PagesLayout: React.FC<PagesLayoutProps> = ({ children }) => {
  return <>{children}</>
}

const Layout: React.FC<PagesLayoutProps> = (props) => {
  return <PagesLayout>{props.children}</PagesLayout>
}

export default Layout
