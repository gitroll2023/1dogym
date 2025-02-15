'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { siteMetadata } from '../../metadata'

export default function MetaPreview() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [copyStatus, setCopyStatus] = useState('')

  useEffect(() => {
    // 로그인 상태 확인
    const checkSession = () => {
      const session = localStorage.getItem('adminSession')
      if (session) {
        const { expiresAt } = JSON.parse(session)
        if (new Date().getTime() < expiresAt) {
          setIsLoggedIn(true)
        } else {
          localStorage.removeItem('adminSession')
          router.push('/admin')
        }
      } else {
        router.push('/admin')
      }
      setIsLoading(false)
    }

    checkSession()
  }, [router])

  const copyLink = async () => {
    try {
      const url = 'http://1dogym.kro.kr'
      await navigator.clipboard.writeText(url)
      setCopyStatus('복사 완료!')
      setTimeout(() => setCopyStatus(''), 2000)
    } catch (err) {
      setCopyStatus('복사 실패')
      setTimeout(() => setCopyStatus(''), 2000)
    }
  }

  if (isLoading) {
    return null
  }

  if (!isLoggedIn) {
    return null
  }

  // 메타데이터에서 필요한 정보 추출
  const title = siteMetadata.title?.toString() || ''
  const description = siteMetadata.description?.toString() || ''
  const imageUrl = Array.isArray(siteMetadata.openGraph?.images) 
    ? (siteMetadata.openGraph.images[0] as { url: string })?.url || ''
    : typeof siteMetadata.openGraph?.images === 'object' && siteMetadata.openGraph.images !== null
      ? (siteMetadata.openGraph.images as { url: string }).url
      : ''

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-md mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">카카오톡 미리보기</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={copyLink}
              className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copyStatus || '링크 복사'}
            </button>
            <Link 
              href="/admin"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm transition-colors"
            >
              돌아가기
            </Link>
          </div>
        </div>

        {/* 카카오톡 미리보기 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* 채팅 헤더 */}
          <div className="bg-[#A1C2FA] px-4 py-3 flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#A1C2FA] text-xs font-bold">K</div>
            <span className="text-white font-medium">카카오톡</span>
          </div>

          {/* 채팅 내용 */}
          <div className="p-4 bg-[#B2C7D9]">
            <div className="flex items-start gap-2 max-w-[270px] ml-auto">
              {/* 링크 프리뷰 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-sm w-full">
                {imageUrl && (
                  <div className="aspect-[1.91/1] relative bg-gray-100">
                    <Image
                      src={imageUrl}
                      alt={title}
                      fill
                      sizes="(max-width: 270px) 100vw, 270px"
                      className="object-cover"
                      priority
                    />
                  </div>
                )}
                <div className="p-3 space-y-1">
                  <h3 className="font-medium text-sm line-clamp-2">
                    {title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {description}
                  </p>
                  <div className="text-[10px] text-gray-400">1dogym.kro.kr</div>
                </div>
              </div>
              {/* 시간 */}
              <div className="text-[10px] text-gray-600 self-end">오후 12:34</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
