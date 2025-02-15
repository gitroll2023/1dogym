import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import { siteMetadata } from './metadata'

const inter = Inter({ subsets: ['latin'] })

export const metadata = siteMetadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
