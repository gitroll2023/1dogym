'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formSections, personalInfoSection } from '@/config/formConfig'
import QRCodeModal from '@/components/QRCodeModal'

export default function ApplyPage() {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    exerciseFrequency: '',
    exercisePurpose: '',
    exercisePurposeOther: '',
    postureType: '',
    postureTypeOther: '',
    nerveResponse: '',
    participationIntent: '',
    name: '',
    phone: '010',
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
      // 현재 입력된 값에서 하이픈 제거
      const currentValue = value.replace(/-/g, '')
      
      // 숫자만 추출
      const numbers = currentValue.replace(/[^0-9]/g, '')
      
      // 010으로 시작하는지 확인
      if (!numbers.startsWith('010')) return
      
      // 11자리로 제한
      if (numbers.length > 11) return
      
      // 하이픈 추가
      let formattedNumber = numbers
      if (numbers.length >= 3) {
        formattedNumber = numbers.slice(0, 3) + '-' + numbers.slice(3)
      }
      if (numbers.length >= 7) {
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
          participationIntent: formData.participationIntent === 'yes'
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

  const renderFormSection = (section: any) => {
    const { id, title, type, options, imageUrl, placeholder, hasOther } = section

    return (
      <div key={id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">{title}</h2>
          
          {type === 'image' && imageUrl && (
            <div className="mb-6">
              <div className="relative w-full h-[300px]">
                <Image
                  src={imageUrl}
                  alt={title || '소개 이미지'}
                  fill
                  className="object-contain rounded-lg"
                  priority
                />
              </div>
              <div className="mt-6 space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  위 이미지처럼 <span className="font-semibold text-blue-600">이상적인 자세</span>를 유지하는 것이 건강한 몸을 위해 매우 중요합니다. 
                  하지만 대부분의 현대인들은 잘못된 자세로 인해 다양한 건강 문제를 겪고 있죠.
                </p>
                <p className="leading-relaxed">
                  <span className="font-semibold">"어깨 펴세요!", "허리 똑바로!", "가슴을 펴세요!"</span><br />
                  이런 말들을 자주 들어보셨나요? 순간적으로 자세를 교정하려 해도, 
                  의식적인 노력만으로는 지속적인 자세 교정이 어렵습니다.
                </p>
                <p className="leading-relaxed">
                  <span className="font-semibold text-blue-600">1도GYM</span>은 단순한 운동이 아닌, 
                  <span className="font-semibold">뇌 활성화 프로그램</span>을 통해 자연스러운 자세 교정을 돕습니다. 
                  전문 트레이너와 함께하는 맞춤형 PT 프로그램으로, 당신의 뇌가 스스로 올바른 자세를 인지하고 
                  유지할 수 있도록 도와드립니다.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mt-6">
                  <p className="font-semibold text-blue-800">
                    💡 지금 바로 신청하고 전문가와 함께 당신의 건강한 변화를 시작하세요!
                  </p>
                </div>
              </div>
            </div>
          )}

          {imageUrl && type !== 'image' && (
            <div className="mb-6">
              <div className="relative w-full pb-[75%]">
                <Image
                  src={imageUrl}
                  alt={`${title} 참고 이미지`}
                  fill
                  className="object-contain rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          )}

          {type === 'radio' && (
            <>
              <div className={`grid grid-cols-2 ${options.length > 4 ? 'sm:grid-cols-3' : 'sm:grid-cols-4'} gap-4`}>
                {options.map((option: { value: string; label: string }) => (
                  <label key={option.value} className="relative">
                    <input
                      type="radio"
                      name={id}
                      value={option.value}
                      checked={formData[id as keyof typeof formData] === option.value}
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
              {hasOther && formData[id as keyof typeof formData] === 'other' && (
                <input
                  type="text"
                  name={`${id}Other`}
                  value={formData[`${id}Other` as keyof typeof formData] as string}
                  onChange={handleChange}
                  className="mt-4 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={`기타 ${title}을(를) 입력해주세요`}
                  required
                />
              )}
            </>
          )}

          {type === 'textarea' && (
            <textarea
              name={id}
              value={formData[id as keyof typeof formData] as string}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[120px]"
              placeholder={placeholder}
              required
            />
          )}
        </div>
      </div>
    )
  }

  const renderPersonalInfo = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">{personalInfoSection.title}</h2>
        <div className="space-y-4">
          {personalInfoSection.fields.map(field => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                id={field.id}
                type={field.type}
                name={field.id}
                value={formData[field.id as keyof typeof formData] as string}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* QR 코드 버튼 */}
      <div className="flex justify-center py-4 bg-white border-b border-gray-200">
        <button
          onClick={() => setIsQRModalOpen(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 
            transition-colors duration-200 flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          <span>신청페이지 QR 코드 보기</span>
        </button>
      </div>

      {/* 폼 컨테이너 */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {formSections.map(renderFormSection)}
          {renderPersonalInfo()}
          
          {/* 개인정보 수집 동의 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">개인정보 수집 및 이용 동의</h2>
              <div className="space-y-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="privacyAgreement"
                    checked={formData.privacyAgreement}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                  <span className="text-sm text-gray-600">
                    개인정보 수집 및 이용에 동의합니다.
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="purposeAgreement"
                    checked={formData.purposeAgreement}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                  <span className="text-sm text-gray-600">
                    수집된 개인정보는 1도GYM의 PT 서비스 제공 목적으로만 사용됩니다.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-4 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
          >
            신청하기
          </button>
        </form>
      </div>

      {/* 성공 모달 */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">신청이 완료되었습니다!</h3>
            <p className="text-gray-600 mb-6">
              빠른 시일 내에 연락드리도록 하겠습니다.
            </p>
            <Link
              href="/"
              className="block w-full bg-primary-600 text-white text-center py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
            >
              메인으로 돌아가기
            </Link>
          </div>
        </div>
      )}

      {/* QR 코드 모달 */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        url="https://1dogym.kro.kr/apply"
      />
    </div>
  )
}
