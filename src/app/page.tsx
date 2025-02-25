'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import MainSlideshow from '@/components/MainSlideshow'
import ServiceSection from '@/components/ServiceSection'
import GallerySection from '@/components/GallerySection'
import QRCodeModal from '@/components/QRCodeModal'
import NoticePopup from '@/components/NoticePopup'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [isNoticeOpen, setIsNoticeOpen] = useState(false)

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="w-full">
          {/* 메인 슬라이드쇼 섹션 */}
          <MainSlideshow />
          
          {/* 버튼 섹션 */}
          <div className="flex flex-col items-center gap-4 my-8 px-4">
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="w-full max-w-md px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 
                transition-all duration-200 flex items-center justify-center space-x-3 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
              </svg>
              <span>사이트 방문 QR 코드 보기</span>
            </button>
            <div className="w-full max-w-md flex items-center justify-center my-2">
              <div className="h-px bg-gray-300 w-1/3"></div>
              <span className="mx-4 text-gray-500 text-sm">또는</span>
              <div className="h-px bg-gray-300 w-1/3"></div>
            </div>
            <button
              onClick={() => setIsNoticeOpen(true)}
              className="w-full max-w-md px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg shadow-md 
                hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-3 
                hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <span>이번주 일정 확인하기</span>
            </button>
          </div>

          {/* 서비스 소개 섹션 */}
          <ServiceSection />
          
          {/* 갤러리 섹션 */}
          <GallerySection />
          
          {/* 인스타그램 링크 */}
          <div className="fixed bottom-6 right-6 z-50">
            <a
              href="https://www.instagram.com/1.do__gym"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>

          {/* QR 코드 모달 */}
          <QRCodeModal
            isOpen={isQRModalOpen}
            onClose={() => setIsQRModalOpen(false)}
            url="https://1dogym.kro.kr"
          />

          {/* 공지사항 팝업 */}
          <NoticePopup
            isOpen={isNoticeOpen}
            onClose={() => setIsNoticeOpen(false)}
          />
        </div>
      </main>
    </>
  )
}
