import type { Metadata } from 'next'

const title = '1도GYM - 최고의 PT 전문가와 함께하는 피트니스'
const description = '1회 5천원으로 시작하는 프리미엄 PT! 전문 트레이너의 1:1 맞춤 지도와 개인별 식단 관리로 당신의 건강한 변화를 이끕니다. 미주신경을 자극하는 고차원 운동 프로그램으로 새로운 피트니스의 차원을 경험하세요.'

export const siteMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://1dogym.kro.kr'),
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: '1도GYM',
    images: [{
      url: '/opengraph-image.jpg',
      width: 1200,
      height: 630,
      alt: title,
    }],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/opengraph-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
  },
}
