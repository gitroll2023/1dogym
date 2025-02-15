'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    exerciseFrequency: '',
    exercisePurpose: '',
    exercisePurposeOther: '',
    postureType: '',
    postureTypeOther: '',
    nerveResponse: '',
    participationIntent: '',
    name: '',
    phone: '',
    privacyAgreement: false,
    purposeAgreement: false
  })

  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    if (name === 'name') {
      // 한글만 허용 (자음, 모음 포함)
      const koreanOnly = value.replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣]/g, '')
      setFormData(prev => ({
        ...prev,
        [name]: koreanOnly
      }))
      return
    }

    if (name === 'phone') {
      // 숫자만 추출
      const numbers = value.replace(/[^0-9]/g, '')
      
      // 11자리로 제한
      if (numbers.length > 11) return
      
      // 010으로 시작하는지 확인
      if (numbers.length > 0 && !numbers.startsWith('010')) return
      
      // 하이픈 추가
      let formattedNumber = numbers
      if (numbers.length > 3) {
        formattedNumber = numbers.slice(0, 3) + '-' + numbers.slice(3)
      }
      if (numbers.length > 7) {
        formattedNumber = formattedNumber.slice(0, 8) + '-' + formattedNumber.slice(8)
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedNumber
      }))
      return
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 이름 유효성 검사
    if (!/^[가-힣]+$/.test(formData.name)) {
      alert('이름은 한글만 입력 가능합니다.')
      return
    }

    // 전화번호 유효성 검사
    const phoneNumbers = formData.phone.replace(/[^0-9]/g, '')
    if (phoneNumbers.length !== 11) {
      alert('올바른 전화번호를 입력해주세요.')
      return
    }
    if (!phoneNumbers.startsWith('010')) {
      alert('전화번호는 010으로 시작해야 합니다.')
      return
    }
    
    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          exerciseFrequency: formData.exerciseFrequency,
          exercisePurpose: formData.exercisePurposeOther || formData.exercisePurpose,
          postureType: formData.postureTypeOther || formData.postureType,
          nerveResponse: formData.nerveResponse,
          participationIntent: formData.participationIntent
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        setShowSuccessModal(true)
      } else {
        alert('신청 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('신청 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">1도GYM 참여 신청</h1>
          <Link 
            href="/" 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">메인으로</span>
          </Link>
        </div>
      </div>

      {/* 폼 컨테이너 */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 각 섹션 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">1. 운동 빈도</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { value: 'weekly1', label: '주1회' },
                  { value: 'weekly3', label: '주3회' },
                  { value: 'daily', label: '매일' },
                  { value: 'none', label: '안함' }
                ].map(option => (
                  <label key={option.value} className="relative">
                    <input
                      type="radio"
                      name="exerciseFrequency"
                      value={option.value}
                      checked={formData.exerciseFrequency === option.value}
                      onChange={handleChange}
                      className="peer sr-only"
                      required
                    />
                    <div className="min-h-[48px] flex items-center justify-center px-4 py-2 bg-white border-2 border-gray-200 rounded-lg cursor-pointer select-none
                      peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-600
                      hover:border-gray-300 hover:bg-gray-50">
                      {option.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">2. 운동 목적</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'appearance', label: '외모 레벨업' },
                  { value: 'health', label: '건강 증진' },
                  { value: 'hobby', label: '재미/취미' },
                  { value: 'show', label: '과시' },
                  { value: 'other', label: '기타' }
                ].map(option => (
                  <label key={option.value} className="relative">
                    <input
                      type="radio"
                      name="exercisePurpose"
                      value={option.value}
                      checked={formData.exercisePurpose === option.value}
                      onChange={handleChange}
                      className="peer sr-only"
                      required
                    />
                    <div className="min-h-[48px] flex items-center justify-center px-4 py-2 bg-white border-2 border-gray-200 rounded-lg cursor-pointer select-none
                      peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-600
                      hover:border-gray-300 hover:bg-gray-50">
                      {option.label}
                    </div>
                  </label>
                ))}
              </div>
              {formData.exercisePurpose === 'other' && (
                <input
                  type="text"
                  name="exercisePurposeOther"
                  value={formData.exercisePurposeOther}
                  onChange={handleChange}
                  className="mt-4 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="기타 목적을 입력해주세요"
                  required
                />
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">3. 현재 자세 상태</h2>
              <div className="mb-6">
                <Image
                  src="/img/form3.jpg"
                  alt="자세 유형 참고 이미지"
                  width={600}
                  height={300}
                  className="rounded-lg w-full"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { value: 'ideal', label: '이상적 자세' },
                  { value: 'typeA', label: 'A타입' },
                  { value: 'typeB', label: 'B타입' },
                  { value: 'typeC', label: 'C타입' },
                  { value: 'typeD', label: 'D타입' },
                  { value: 'typeE', label: 'E타입' },
                  { value: 'other', label: '기타' }
                ].map(option => (
                  <label key={option.value} className="relative">
                    <input
                      type="radio"
                      name="postureType"
                      value={option.value}
                      checked={formData.postureType === option.value}
                      onChange={handleChange}
                      className="peer sr-only"
                      required
                    />
                    <div className="min-h-[48px] flex items-center justify-center px-4 py-2 bg-white border-2 border-gray-200 rounded-lg cursor-pointer select-none
                      peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-600
                      hover:border-gray-300 hover:bg-gray-50">
                      {option.label}
                    </div>
                  </label>
                ))}
              </div>
              {formData.postureType === 'other' && (
                <input
                  type="text"
                  name="postureTypeOther"
                  value={formData.postureTypeOther}
                  onChange={handleChange}
                  className="mt-4 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="기타 자세 상태를 입력해주세요"
                  required
                />
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">4. 미주신경 운동 PT 관련 응답</h2>
              <div className="mb-6">
                <Image
                  src="/img/form4.jpg"
                  alt="미주신경 운동 참고 이미지"
                  width={600}
                  height={300}
                  className="rounded-lg w-full"
                />
              </div>
              <textarea
                name="nerveResponse"
                value={formData.nerveResponse}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[120px]"
                placeholder="미주신경 운동 PT에 대한 의견을 자유롭게 작성해주세요"
                required
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">5. 참여 의향</h2>
              <div className="grid grid-cols-2 gap-4 max-w-[200px]">
                {[
                  { value: 'yes', label: 'O' },
                  { value: 'no', label: 'X' }
                ].map(option => (
                  <label key={option.value} className="relative">
                    <input
                      type="radio"
                      name="participationIntent"
                      value={option.value}
                      checked={formData.participationIntent === option.value}
                      onChange={handleChange}
                      className="peer sr-only"
                      required
                    />
                    <div className="min-h-[48px] flex items-center justify-center px-4 py-2 bg-white border-2 border-gray-200 rounded-lg cursor-pointer select-none text-xl font-bold
                      peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-600
                      hover:border-gray-300 hover:bg-gray-50">
                      {option.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">6. 개인정보</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    이름
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="한글로 입력해주세요"
                    pattern="[가-힣]+"
                    title="이름은 한글만 입력 가능합니다"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    연락처
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="010-0000-0000"
                    pattern="010-[0-9]{4}-[0-9]{4}"
                    title="전화번호는 010으로 시작하는 11자리 숫자여야 합니다."
                    maxLength={13}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 space-y-4">
              <label className="flex items-start gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="privacyAgreement"
                  checked={formData.privacyAgreement}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  required
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900">
                  개인정보 수집에 동의합니다
                </span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="purposeAgreement"
                  checked={formData.purposeAgreement}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  required
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900">
                  수집된 정보는 회원 관리 목적으로만 사용됨에 동의합니다
                </span>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary-600 text-white rounded-lg px-6 py-4 text-lg font-semibold hover:bg-primary-700 focus:ring-4 focus:ring-primary-500 focus:ring-opacity-50 transition-colors"
          >
            신청하기
          </button>
        </form>
      </div>

      {/* 신청 완료 모달 */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fadeIn">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">신청이 완료되었습니다!</h2>
              <p className="text-gray-600 mb-6">
                빠른 시일 내에 연락드리겠습니다.
              </p>
              <Link 
                href="/" 
                className="block w-full bg-primary-600 text-white rounded-lg px-6 py-3 text-lg font-semibold hover:bg-primary-700 focus:ring-4 focus:ring-primary-500 focus:ring-opacity-50 transition-colors"
              >
                메인으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
