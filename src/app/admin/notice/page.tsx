'use client'

import { useState, useEffect } from 'react'
import type { Notice } from '@/types/notice'
import Link from 'next/link'

// 30분 간격으로 시간 옵션 생성
const generateTimeOptions = () => {
  const options = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour}시 ${minute === 0 ? '00' : '30'}분`
      options.push({
        value: timeString,
        label: timeString
      })
    }
  }
  return options
}

const timeOptions = generateTimeOptions()

// 시간 형식 변환 함수들
const convertTimeForDisplay = (time: string) => {
  const [hours, minutes] = time.split(':')
  return `${hours}시 ${minutes}분`
}

const convertTimeForDB = (time: string) => {
  return time.replace('시 ', ':').replace('분', '')
}

export default function AdminNoticePage() {
  const [notice, setNotice] = useState<Notice | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    content: '',
    location: '',
    startTime: timeOptions[0].value,
    endTime: timeOptions[0].value
  })

  useEffect(() => {
    fetchNotice()
  }, [])

  const fetchNotice = async () => {
    try {
      const response = await fetch('/api/notice')
      const data = await response.json()
      if (data.success && data.notice) {
        setNotice(data.notice)
        // DB 형식의 시간을 화면 표시 형식으로 변환
        setFormData({
          content: data.notice.content,
          location: data.notice.location,
          startTime: convertTimeForDisplay(data.notice.startTime),
          endTime: convertTimeForDisplay(data.notice.endTime)
        })
        console.log('Fetched notice:', data.notice)
      } else {
        setNotice(null)
        setFormData({
          content: '',
          location: '',
          startTime: timeOptions[0].value,
          endTime: timeOptions[0].value
        })
      }
    } catch (error) {
      console.error('Error fetching notice:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = '/api/notice'
      const method = isEditing ? 'PUT' : 'POST'
      
      // 화면 표시 형식의 시간을 DB 형식으로 변환
      const submitData = {
        ...formData,
        startTime: convertTimeForDB(formData.startTime),
        endTime: convertTimeForDB(formData.endTime)
      }
      
      const body = isEditing ? { ...submitData, id: notice?.id } : submitData

      console.log('Submitting form data:', body)

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()
      if (data.success) {
        await fetchNotice()
        setIsEditing(false)
      } else {
        alert(data.error || '저장에 실패했습니다.')
      }
    } catch (error) {
      console.error('Error saving notice:', error)
      alert('저장 중 오류가 발생했습니다.')
    }
  }

  const handleDelete = async () => {
    if (!notice) return
    if (!confirm('정말로 이 일정을 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/notice?id=${notice.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (data.success) {
        setNotice(null)
        setFormData({
          content: '',
          location: '',
          startTime: timeOptions[0].value,
          endTime: timeOptions[0].value
        })
      }
    } catch (error) {
      console.error('Error deleting notice:', error)
    }
  }

  const handleEdit = () => {
    if (!notice) return
    console.log('Editing notice:', notice)
    setIsEditing(true)
    // DB 형식의 시간을 화면 표시 형식으로 변환
    setFormData({
      content: notice.content,
      location: notice.location,
      startTime: convertTimeForDisplay(notice.startTime),
      endTime: convertTimeForDisplay(notice.endTime)
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (notice) {
      setFormData({
        content: notice.content,
        location: notice.location,
        startTime: convertTimeForDisplay(notice.startTime),
        endTime: convertTimeForDisplay(notice.endTime)
      })
    } else {
      setFormData({
        content: '',
        location: '',
        startTime: timeOptions[0].value,
        endTime: timeOptions[0].value
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="ml-2">관리자 페이지로 돌아가기</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">일정관리 페이지</h1>
          <p className="text-gray-600">
            일정은 한 번에 하나만 등록할 수 있습니다. 수정이나 삭제 후 새로운 일정을 등록할 수 있습니다.
          </p>
        </div>

        {/* 현재 일정 */}
        {notice && !isEditing && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 border border-gray-200">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold text-gray-900">현재 등록된 일정</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                >
                  삭제
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm font-medium text-gray-500 mb-1">장소</p>
                <p className="text-gray-900">{notice.location}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm font-medium text-gray-500 mb-1">일정 내용</p>
                <p className="text-gray-900 whitespace-pre-line">{notice.content}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm font-medium text-gray-500 mb-1">시작 시간</p>
                  <p className="text-gray-900">{convertTimeForDisplay(notice.startTime)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm font-medium text-gray-500 mb-1">종료 시간</p>
                  <p className="text-gray-900">{convertTimeForDisplay(notice.endTime)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 일정 등록/수정 폼 */}
        {(!notice || isEditing) && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {isEditing ? '일정 수정' : '새 일정 등록'}
            </h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  장소
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: 1도GYM 본관"
                  required
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  일정 내용
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="일정 내용을 입력해주세요. Enter 키를 눌러 줄바꿈이 가능합니다."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    시작 시간
                  </label>
                  <select
                    id="startTime"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {timeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                    종료 시간
                  </label>
                  <select
                    id="endTime"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {timeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                  >
                    취소
                  </button>
                )}
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  {isEditing ? '수정하기' : '등록하기'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
