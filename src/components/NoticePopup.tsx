'use client'

import { useState, useEffect } from 'react'
import type { Notice } from '@/types/notice'

interface NoticePopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function NoticePopup({ isOpen, onClose }: NoticePopupProps) {
  const [notice, setNotice] = useState<Notice | null>(null)

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await fetch('/api/notice')
        const data = await response.json()
        if (data.success && data.notice) {
          setNotice(data.notice)
        } else {
          setNotice(null)
        }
      } catch (error) {
        console.error('Error fetching notice:', error)
        setNotice(null)
      }
    }

    if (isOpen) {
      fetchNotice()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-3xl p-8 w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.2)] 
        transform transition-all animate-[slideUp_0.3s_ease-out]"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
        }}
      >
        {/* 헤더 */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                이번주 일정 안내
              </h2>
              <p className="text-gray-500 text-sm mt-1">1도GYM의 특별한 소식</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 내용 */}
        {notice ? (
          <div className="space-y-8">
            {/* 공지 내용 */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-2xl border border-blue-100 shadow-inner">
              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-white p-2 rounded-lg shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {notice.content}
                </p>
              </div>
            </div>

            {/* 시간과 장소 정보 */}
            <div className="grid grid-cols-2 gap-6">
              {/* 장소 */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-5 rounded-2xl border border-gray-100 shadow-sm
                hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-blue-500 p-2 rounded-lg shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-900">장소</span>
                </div>
                <p className="text-gray-700 text-lg">{notice.location}</p>
              </div>

              {/* 시간 */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-5 rounded-2xl border border-gray-100 shadow-sm
                hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-blue-500 p-2 rounded-lg shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-900">시간</span>
                </div>
                <p className="text-gray-700 text-lg">
                  {notice.startTime} - {notice.endTime}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">이번주는 아직 미정입니다</h3>
            <p className="text-gray-500">곧 일정이 업데이트될 예정입니다.</p>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl 
              hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg 
              hover:shadow-xl transform hover:-translate-y-0.5"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}
