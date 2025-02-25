'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import html2canvas from 'html2canvas'
import Link from 'next/link'
import NoticeModal from '@/components/NoticeModal'
import type { Notice } from '@/types/notice'

// CSV 다운로드 유틸리티 함수 추가
const downloadAsCSV = (data: string, filename: string) => {
  const blob = new Blob(['\ufeff' + data], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

interface Applicant {
  id: number
  name: string
  phone: string
  exerciseFrequency: string
  exercisePurpose: string
  postureType: string
  nerveResponse: string
  participationIntent: string
  checked: boolean
  createdAt: string
}

function LoginForm({ onLogin }: { onLogin: (success: boolean) => void }) {
  const [loginForm, setLoginForm] = useState({ id: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      })

      const result = await response.json()
      
      if (result.success) {
        // 세션 저장 (1시간)
        const expiresAt = new Date().getTime() + (3600 * 1000)
        localStorage.setItem('adminSession', JSON.stringify({ expiresAt }))
        onLogin(true)
      } else {
        alert(result.message || '로그인에 실패했습니다.')
        onLogin(false)
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('로그인 처리 중 오류가 발생했습니다.')
      onLogin(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            {/* 로고 또는 타이틀 */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">1도GYM</h1>
              <p className="mt-2 text-sm text-gray-600">관리자 로그인</p>
            </div>

            {/* 로그인 폼 */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">
                  아이디
                </label>
                <input
                  id="id"
                  type="text"
                  value={loginForm.id}
                  onChange={(e) => setLoginForm({ ...loginForm, id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                로그인
              </button>
            </form>

            {/* 홈페이지로 돌아가기 */}
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                홈페이지로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function AdminPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)  // 로딩 상태 추가
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [sessionTimer, setSessionTimer] = useState(3600) // 1시간
  const [activeTab, setActiveTab] = useState<'all' | 'unchecked' | 'checked'>('unchecked')
  const [copySuccess, setCopySuccess] = useState<number | null>(null)
  const [searchText, setSearchText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false)
  const [currentNotice, setCurrentNotice] = useState<Notice | null>(null)
  const [noticeModalMode, setNoticeModalMode] = useState<'create' | 'edit'>('create')

  const modalContentRef = useRef<HTMLDivElement>(null)

  const handleScreenshot = async () => {
    if (modalContentRef.current) {
      try {
        // 스크롤 위치 저장
        const scrollTop = modalContentRef.current.scrollTop
        
        // 스크롤을 일시적으로 제거하고 전체 내용이 보이도록 스타일 조정
        modalContentRef.current.style.maxHeight = 'none'
        modalContentRef.current.style.overflow = 'visible'
        modalContentRef.current.scrollTop = 0
        
        const canvas = await html2canvas(modalContentRef.current, {
          backgroundColor: 'white',
          scale: 2, // 더 선명한 이미지를 위해 2배 스케일로 렌더링
          windowWidth: modalContentRef.current.scrollWidth,
          windowHeight: modalContentRef.current.scrollHeight,
        })
        
        // 원래 스타일로 복구
        modalContentRef.current.style.maxHeight = 'calc(90vh-8rem)'
        modalContentRef.current.style.overflow = 'auto'
        modalContentRef.current.scrollTop = scrollTop
        
        // 캔버스를 이미지로 변환
        const image = canvas.toDataURL('image/png')
        
        // 다운로드 링크 생성
        const link = document.createElement('a')
        link.href = image
        link.download = `신청자_${selectedApplicant?.name}_${new Date().toLocaleDateString()}.png`
        link.click()
      } catch (error) {
        console.error('Screenshot error:', error)
        alert('스크린샷 생성 중 오류가 발생했습니다.')
      }
    }
  }

  const handleCopyPhone = async (phone: string, id: number) => {
    try {
      await navigator.clipboard.writeText(phone)
      setCopySuccess(id)
      setTimeout(() => setCopySuccess(null), 2000) // 2초 후 복사 성공 표시 제거
    } catch (err) {
      console.error('Failed to copy phone number:', err)
    }
  }

  const handleExcelDownload = () => {
    if (selectedApplicant) {
      // CSV 헤더
      const headers = [
        '항목,내용'
      ];
      
      // CSV 데이터 행
      const rows = [
        `이름,${selectedApplicant.name}`,
        `연락처,${selectedApplicant.phone}`,
        `신청일시,${new Date(selectedApplicant.createdAt).toLocaleString('ko-KR')}`,
        `참여 의향,${selectedApplicant.participationIntent ? '있음' : '없음'}`,
        `운동 빈도,${exerciseFrequencyMap[selectedApplicant.exerciseFrequency as keyof typeof exerciseFrequencyMap] || selectedApplicant.exerciseFrequency}`,
        `운동 목적,${exercisePurposeMap[selectedApplicant.exercisePurpose as keyof typeof exercisePurposeMap] || selectedApplicant.exercisePurpose}`,
        `자세 유형,${postureTypeMap[selectedApplicant.postureType as keyof typeof postureTypeMap] || selectedApplicant.postureType}`,
        `미주신경 운동 관련 응답,${selectedApplicant.nerveResponse.replace(/,/g, ' ').replace(/\n/g, ' ')}`
      ];
      
      // CSV 파일 생성 및 다운로드
      const csvContent = headers.concat(rows).join('\n');
      const filename = `신청자_${selectedApplicant.name}_${new Date().toLocaleDateString()}.csv`;
      
      downloadAsCSV(csvContent, filename);
    }
  };

  const handleCopyFullInfo = async () => {
    if (selectedApplicant) {
      const fullInfo = `[${selectedApplicant.name}님의 상세정보]

1. 기본정보
 - 이름: ${selectedApplicant.name}
 - 연락처: ${selectedApplicant.phone}
 - 신청일시: ${new Date(selectedApplicant.createdAt).toLocaleString('ko-KR')}
 - 참여의향: ${selectedApplicant.participationIntent ? 'O' : 'X'}

2. 운동관련 정보
 - 운동 빈도: ${exerciseFrequencyMap[selectedApplicant.exerciseFrequency as keyof typeof exerciseFrequencyMap] || selectedApplicant.exerciseFrequency}
 - 운동 목적: ${exercisePurposeMap[selectedApplicant.exercisePurpose as keyof typeof exercisePurposeMap] || selectedApplicant.exercisePurpose}
 - 자세 유형: ${postureTypeMap[selectedApplicant.postureType as keyof typeof postureTypeMap] || selectedApplicant.postureType}

3. 미주신경 운동 관련 응답
: ${selectedApplicant.nerveResponse}`;

      try {
        await navigator.clipboard.writeText(fullInfo);
        alert('클립보드에 복사되었습니다.');
      } catch (err) {
        console.error('Failed to copy full info:', err);
        alert('복사에 실패했습니다.');
      }
    }
  };

  const handleBulkExcelDownload = () => {
    // 현재 필터링된 신청자만 다운로드
    if (filteredApplicants.length === 0) {
      alert('다운로드할 신청자가 없습니다.');
      return;
    }

    // CSV 헤더
    const headers = [
      '이름',
      '연락처',
      '신청일시',
      '참여의향',
      '운동빈도',
      '운동목적',
      '자세유형',
      '미주신경 운동 관련 응답',
      '상태'
    ].join(',');

    // CSV 데이터 행
    const rows = filteredApplicants.map(applicant => [
      applicant.name,
      applicant.phone,
      new Date(applicant.createdAt).toLocaleString('ko-KR'),
      applicant.participationIntent ? 'O' : 'X',
      exerciseFrequencyMap[applicant.exerciseFrequency as keyof typeof exerciseFrequencyMap] || applicant.exerciseFrequency,
      exercisePurposeMap[applicant.exercisePurpose as keyof typeof exercisePurposeMap] || applicant.exercisePurpose,
      postureTypeMap[applicant.postureType as keyof typeof postureTypeMap] || applicant.postureType,
      applicant.nerveResponse.replace(/,/g, ' ').replace(/\n/g, ' '),
      applicant.checked ? '확인완료' : '미확인'
    ].map(field => `"${field}"`).join(','));

    // CSV 파일 생성 및 다운로드
    const csvContent = [headers, ...rows].join('\n');
    const filename = `신청자_목록_${activeTab === 'checked' ? '확인완료' : activeTab === 'unchecked' ? '미확인' : '전체'}_${new Date().toLocaleDateString()}.csv`;
    
    downloadAsCSV(csvContent, filename);
  };

  const handleLogin = async (success: boolean) => {
    if (success) {
      setIsLoggedIn(true)
      try {
        const response = await fetch('/api/applicants')
        const result = await response.json()
        
        if (result.success) {
          setApplicants(result.data)
        }
      } catch (error) {
        console.error('Error fetching applicants:', error)
      }
    }
  }

  const fetchApplicants = async () => {
    try {
      const response = await fetch('/api/applicants')
      const result = await response.json()
      
      if (result.success) {
        setApplicants(result.data)
      }
    } catch (error) {
      console.error('Error fetching applicants:', error)
    }
  }

  const handleToggleCheck = async (id: number) => {
    try {
      const response = await fetch(`/api/applicants/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update applicant')
      }
      
      const result = await response.json()
      if (result.success) {
        // 상태 업데이트
        setApplicants(prev => prev.map(applicant => 
          applicant.id === id 
            ? { ...applicant, checked: !applicant.checked }
            : applicant
        ))
      }
    } catch (error) {
      console.error('Error toggling check:', error)
      alert('상태 변경에 실패했습니다.')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/applicants?id=${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()
      
      if (result.success) {
        setApplicants(prev => prev.filter(app => app.id !== id))
        setShowDeleteModal(false)
      }
    } catch (error) {
      console.error('Error deleting applicant:', error)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setApplicants([])
    localStorage.removeItem('adminSession')
    router.push('/admin')
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // 운동 빈도 매핑
  const exerciseFrequencyMap = {
    'weekly1': '주 1회',
    'weekly3': '주 3회',
    'daily': '매일',
    'none': '안함'
  }

  // 운동 목적 매핑
  const exercisePurposeMap = {
    'appearance': '외모 레벨업',
    'health': '건강 증진',
    'hobby': '재미/취미',
    'show': '과시',
    'other': '기타'
  }

  // 자세 유형 매핑
  const postureTypeMap = {
    'ideal': '이상적 자세',
    'typeA': 'A타입',
    'typeB': 'B타입',
    'typeC': 'C타입',
    'typeD': 'D타입',
    'typeE': 'E타입',
    'other': '기타'
  }

  // 탭에 따른 필터링된 신청자 목록
  const filteredApplicants = applicants.filter(applicant => {
    // 탭 필터
    if (activeTab === 'checked' && !applicant.checked) return false;
    if (activeTab === 'unchecked' && applicant.checked) return false;

    // 날짜 필터
    if (startDate || endDate) {
      const applicantDate = new Date(applicant.createdAt);
      if (startDate && new Date(startDate) > applicantDate) return false;
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999); // 종료일의 끝시간으로 설정
        if (endDateTime < applicantDate) return false;
      }
    }

    // 텍스트 검색 필터
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      return (
        applicant.name.toLowerCase().includes(searchLower) ||
        applicant.phone.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  useEffect(() => {
    // 페이지 로드 시 세션 확인
    const checkSession = () => {
      const session = localStorage.getItem('adminSession')
      if (session) {
        const { expiresAt } = JSON.parse(session)
        if (new Date().getTime() < expiresAt) {
          setIsLoggedIn(true)
          // 남은 시간 계산
          const remainingTime = Math.floor((expiresAt - new Date().getTime()) / 1000)
          setSessionTimer(remainingTime)
          // 세션이 유효하면 데이터도 가져오기
          fetchApplicants()
        } else {
          // 세션이 만료된 경우
          localStorage.removeItem('adminSession')
          setIsLoggedIn(false)
          setSessionTimer(3600)
        }
      }
      setIsLoading(false)  // 세션 체크 완료
    }

    checkSession()
  }, [])

  // 세션 타이머 업데이트
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isLoggedIn && sessionTimer > 0) {
      timer = setInterval(() => {
        setSessionTimer(prev => {
          if (prev <= 1) {
            // 세션 만료
            clearInterval(timer);
            handleLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isLoggedIn, sessionTimer]);

  // 공지사항 관련 함수들
  const fetchCurrentNotice = async () => {
    try {
      const response = await fetch('/api/notice')
      const data = await response.json()
      if (data.success && data.notice) {
        setCurrentNotice(data.notice)
      }
    } catch (error) {
      console.error('Error fetching notice:', error)
    }
  }

  const handleCreateNotice = async (notice: Omit<Notice, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/notice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notice),
      })
      const data = await response.json()
      if (data.success) {
        alert('공지가 등록되었습니다.')
        setIsNoticeModalOpen(false)
        fetchCurrentNotice()
      } else {
        alert('공지 등록에 실패했습니다.')
      }
    } catch (error) {
      console.error('Error creating notice:', error)
      alert('공지 등록 중 오류가 발생했습니다.')
    }
  }

  const handleUpdateNotice = async (notice: Omit<Notice, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentNotice) return
    try {
      const response = await fetch('/api/notice', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...notice, id: currentNotice.id }),
      })
      const data = await response.json()
      if (data.success) {
        alert('공지가 수정되었습니다.')
        setIsNoticeModalOpen(false)
        fetchCurrentNotice()
      } else {
        alert('공지 수정에 실패했습니다.')
      }
    } catch (error) {
      console.error('Error updating notice:', error)
      alert('공지 수정 중 오류가 발생했습니다.')
    }
  }

  const handleDeleteNotice = async () => {
    if (!currentNotice) return
    if (!confirm('정말로 이 공지를 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/notice?id=${currentNotice.id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        alert('공지가 삭제되었습니다.')
        setCurrentNotice(null)
      } else {
        alert('공지 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('Error deleting notice:', error)
      alert('공지 삭제 중 오류가 발생했습니다.')
    }
  }

  useEffect(() => {
    fetchCurrentNotice()
  }, [])

  // 로딩 중일 때는 로딩 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // 로그인되지 않은 경우
  if (!isLoggedIn) {
    return <LoginForm onLogin={(success) => handleLogin(success)} />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* 헤더 */}
      <header className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-3 py-4">
            {/* 제목과 설명 */}
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-900">신청자 관리</h1>
              <span className="text-sm text-gray-600">
                세션 시간: <span className="font-medium text-blue-600">{formatTime(sessionTimer)}</span>
              </span>
            </div>

            {/* 네비게이션 */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="ml-2">메인페이지</span>
              </Link>
              <Link
                href="/admin/meta"
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="ml-2">메타데이터</span>
              </Link>
              <Link
                href="/admin/notice"
                className="flex items-center p-2 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 group"
              >
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl shadow-inner group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-2">
                  <h3 className="text-lg font-semibold text-gray-900">일정공지 관리</h3>
                  <p className="text-sm text-gray-500">장소와 시간 공지사항을 관리합니다</p>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="ml-2">로그아웃</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4 py-8 bg-white">
        {/* 탭 메뉴 */}
        <div className="mb-8">
          <div className="flex overflow-x-auto mb-4">
            <div className="flex space-x-2 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setActiveTab('unchecked')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${activeTab === 'unchecked'
                    ? 'bg-white text-blue-600 shadow'
                    : 'text-gray-600 hover:bg-gray-200'
                  }`}
              >
                미확인
              </button>
              <button
                onClick={() => setActiveTab('checked')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${activeTab === 'checked'
                    ? 'bg-white text-blue-600 shadow'
                    : 'text-gray-600 hover:bg-gray-200'
                  }`}
              >
                확인 완료
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${activeTab === 'all'
                    ? 'bg-white text-blue-600 shadow'
                    : 'text-gray-600 hover:bg-gray-200'
                  }`}
              >
                전체
              </button>
            </div>
          </div>

          {/* 검색 필터 - 확인완료와 전체 탭에서만 표시 */}
          {(activeTab === 'checked' || activeTab === 'all') && (
            <div className="mb-4 space-y-4">
              {/* 검색 필터 헤더 */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">검색 필터</h3>
                <button
                  onClick={handleBulkExcelDownload}
                  className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  {activeTab === 'checked' ? '확인완료' : '전체'} 신청자 엑셀 다운로드
                </button>
              </div>

              {/* 구분선 */}
              <div className="border-t border-gray-200"></div>

              {/* 기간 검색 */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-600">기간 검색:</span>
                </div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500">~</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600"
                >
                  초기화
                </button>
              </div>

              {/* 이름/연락처 검색 */}
              <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="이름 또는 연락처로 검색"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                {searchText && (
                  <button
                    onClick={() => setSearchText('')}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600"
                  >
                    초기화
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 미확인 탭의 엑셀 다운로드 버튼 */}
          {activeTab === 'unchecked' && (
            <div className="flex justify-end mb-4">
              <button
                onClick={handleBulkExcelDownload}
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                미확인 신청자 엑셀 다운로드
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApplicants.map((applicant) => (
            <div key={applicant.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              {/* 헤더 영역 */}
              <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
                <h3 className="font-semibold text-lg text-gray-900">{applicant.name}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full
                  ${applicant.checked 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {applicant.checked ? '확인 완료' : '미확인'}
                </span>
              </div>

              {/* 내용 영역 */}
              <div className="p-4 space-y-3">
                {/* 연락처 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-600">{applicant.phone}</span>
                  </div>
                  <button
                    onClick={() => handleCopyPhone(applicant.phone, applicant.id)}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                  >
                    {copySuccess === applicant.id ? (
                      <span className="text-green-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        복사됨
                      </span>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        <span>복사</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 신청일자 */}
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-500">
                    {new Date(applicant.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {/* 버튼 영역 */}
              <div className="px-4 py-3 bg-gray-50 border-t grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setSelectedApplicant(applicant)
                    setShowModal(true)
                  }}
                  className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 
                    rounded-md transition-colors duration-200 flex items-center justify-center"
                >
                  상세보기
                </button>
                <button
                  onClick={() => handleToggleCheck(applicant.id)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200
                    flex items-center justify-center
                    ${applicant.checked 
                      ? 'text-yellow-600 hover:bg-yellow-50' 
                      : 'text-green-600 hover:bg-green-50'
                    }`}
                >
                  {applicant.checked ? '미확인' : '확인하기'}
                </button>
                <button
                  onClick={() => {
                    setSelectedApplicant(applicant)
                    setShowDeleteModal(true)
                  }}
                  className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 
                    rounded-md transition-colors duration-200 flex items-center justify-center"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>


        {/* 상세보기 모달 */}
        {showModal && selectedApplicant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              {/* 모달 헤더 */}
              <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">신청자 상세 정보</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyFullInfo}
                    className="text-white hover:text-blue-200 transition-colors p-2"
                    title="전체 정보 복사"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                  <button
                    onClick={handleExcelDownload}
                    className="text-white hover:text-blue-200 transition-colors p-2"
                    title="엑셀 다운로드"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={handleScreenshot}
                    className="text-white hover:text-blue-200 transition-colors p-2"
                    title="스크린샷 저장"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-white hover:text-blue-200 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* 모달 내용 */}
              <div ref={modalContentRef} className="p-6 pb-20 overflow-y-auto max-h-[calc(90vh-8rem)]">
                <div className="space-y-6">
                  {/* 기본 정보 섹션 */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-blue-600 mb-4">기본 정보</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">이름</p>
                        <p className="font-medium">{selectedApplicant.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">연락처</p>
                        <p className="font-medium">{selectedApplicant.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">신청일시</p>
                        <p className="font-medium">
                          {new Date(selectedApplicant.createdAt).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">참여 의향</p>
                        <p className="font-medium">
                          {selectedApplicant.participationIntent ? '있음' : '없음'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 운동 관련 정보 섹션 */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-blue-600 mb-4">운동 관련 정보</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">운동 빈도</p>
                        <p className="font-medium">
                          {exerciseFrequencyMap[selectedApplicant.exerciseFrequency as keyof typeof exerciseFrequencyMap] || selectedApplicant.exerciseFrequency}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">운동 목적</p>
                        <p className="font-medium">
                          {exercisePurposeMap[selectedApplicant.exercisePurpose as keyof typeof exercisePurposeMap] || selectedApplicant.exercisePurpose}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">자세 유형</p>
                        <p className="font-medium">
                          {postureTypeMap[selectedApplicant.postureType as keyof typeof postureTypeMap] || selectedApplicant.postureType}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 미주신경 운동 응답 섹션 */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-blue-600 mb-4">미주신경 운동 관련 응답</h4>
                    <p className="whitespace-pre-wrap">{selectedApplicant.nerveResponse}</p>
                  </div>
                </div>
              </div>

              {/* 모바일용 하단 고정 버튼 */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg md:hidden">
                <div className="max-w-2xl mx-auto">
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg
                      hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>닫기</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 모달 푸터 */}
              <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg
                    transition-colors duration-200"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 삭제 확인 모달 */}
        {showDeleteModal && selectedApplicant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
              {/* 모달 헤더 */}
              <div className="px-6 py-4 bg-red-600 text-white flex justify-between items-center rounded-t-xl">
                <h3 className="text-xl font-semibold text-white">신청자 삭제</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-white hover:text-red-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 모달 내용 */}
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="rounded-full bg-red-100 p-3">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">삭제 확인</h4>
                    <p className="text-gray-500">
                      <span className="font-medium text-gray-900">{selectedApplicant.name}</span> 님의 신청 정보를 삭제하시겠습니까?
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  이 작업은 되돌릴 수 없습니다.
                </p>
              </div>

              {/* 모달 푸터 */}
              <div className="px-6 py-4 bg-gray-50 border-t rounded-b-xl flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg
                    transition-colors duration-200"
                >
                  취소
                </button>
                <button
                  onClick={() => handleDelete(selectedApplicant.id)}
                  className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg
                    hover:bg-red-700 transition-colors duration-200"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 공지사항 모달 */}
        <NoticeModal
          isOpen={isNoticeModalOpen}
          onClose={() => setIsNoticeModalOpen(false)}
          onSubmit={noticeModalMode === 'create' ? handleCreateNotice : handleUpdateNotice}
          initialNotice={noticeModalMode === 'edit' && currentNotice ? {
            content: currentNotice.content,
            location: currentNotice.location,
            startTime: currentNotice.startTime,
            endTime: currentNotice.endTime
          } : undefined}
          mode={noticeModalMode}
        />
      </main>
    </div>
  )
}
