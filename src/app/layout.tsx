import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '1도GYM',
  description: '1도GYM - 미주신경 운동 PT',
  verification: {
    google: 'xEuZhAbn3bdB6UvHHM8VCNTNyKFYJ4791H-L7NJvnfc',
    other: {
      'naver-site-verification': 'ee33201c27d47e576e6f1a8e7a546c72d1432898'
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="google-site-verification" content="xEuZhAbn3bdB6UvHHM8VCNTNyKFYJ4791H-L7NJvnfc" />
        <meta name="naver-site-verification" content="ee33201c27d47e576e6f1a8e7a546c72d1432898" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
