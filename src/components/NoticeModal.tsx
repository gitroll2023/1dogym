'use client'

import { useState, useEffect } from 'react'
import type { Notice } from '@/types/notice'

type NoticeInput = Omit<Notice, 'id' | 'createdAt' | 'updatedAt'>

interface NoticeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (notice: NoticeInput) => void
  initialNotice?: NoticeInput
  mode?: 'create' | 'edit'
}

export default function NoticeModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  initialNotice,
  mode = 'create'
}: NoticeModalProps) {
  const [notice, setNotice] = useState<NoticeInput>({
    content: '',
    location: '',
    startTime: '',
    endTime: ''
  })

  useEffect(() => {
    if (initialNotice) {
      setNotice(initialNotice)
    } else {
      setNotice({
        content: '',
        location: '',
        startTime: '',
        endTime: ''
      })
    }
  }, [initialNotice])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(notice)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {mode === 'create' ? '공지사항 작성' : '공지사항 수정'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              공지 내용
            </label>
            <input
              type="text"
              value={notice.content}
              onChange={(e) => setNotice({ ...notice, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="이번주 일도짐은 어디에서 합니다."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              장소
            </label>
            <input
              type="text"
              value={notice.location}
              onChange={(e) => setNotice({ ...notice, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="장소를 입력하세요"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              시작 시간
            </label>
            <input
              type="time"
              value={notice.startTime}
              onChange={(e) => setNotice({ ...notice, startTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              종료 시간
            </label>
            <input
              type="time"
              value={notice.endTime}
              onChange={(e) => setNotice({ ...notice, endTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            {mode === 'create' ? '공지 등록' : '공지 수정'}
          </button>
        </form>
      </div>
    </div>
  )
}
