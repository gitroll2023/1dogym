import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { id, password } = await request.json()
    
    // 환경 변수에서 관리자 계정 정보 가져오기
    const adminId = process.env.ADMIN_ID
    const adminPassword = process.env.ADMIN_PASSWORD

    if (id === adminId && password === adminPassword) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ 
      success: false, 
      message: '아이디 또는 비밀번호가 올바르지 않습니다.' 
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      success: false, 
      message: '로그인 처리 중 오류가 발생했습니다.' 
    })
  }
}
