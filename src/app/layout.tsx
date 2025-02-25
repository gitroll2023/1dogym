import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { siteMetadata } from './metadata'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  ...siteMetadata,
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://1dogym.kro.kr" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
