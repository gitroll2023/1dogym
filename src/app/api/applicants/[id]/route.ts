import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const data = await request.json()
    
    // 현재 신청자 정보 조회
    const applicant = await prisma.applicant.findUnique({
      where: { id },
    })

    if (!applicant) {
      return NextResponse.json(
        { success: false, message: '신청자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 신청자 정보 업데이트
    const updatedApplicant = await prisma.applicant.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        exerciseFrequency: data.exerciseFrequency,
        exercisePurpose: data.exercisePurpose,
        postureType: data.postureType,
        nerveResponse: data.nerveResponse,
        participationIntent: data.participationIntent,
      },
    })

    return NextResponse.json({ 
      success: true, 
      data: updatedApplicant 
    })
  } catch (error) {
    console.error('Error updating applicant:', error)
    return NextResponse.json(
      { success: false, message: '신청자 정보 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    // 현재 신청자 정보 조회
    const applicant = await prisma.applicant.findUnique({
      where: { id },
    })

    if (!applicant) {
      return NextResponse.json(
        { success: false, message: '신청자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // checked 상태를 토글
    const updatedApplicant = await prisma.applicant.update({
      where: { id },
      data: { checked: !applicant.checked },
    })

    return NextResponse.json({ 
      success: true, 
      data: updatedApplicant 
    })
  } catch (error) {
    console.error('Error updating applicant:', error)
    return NextResponse.json(
      { success: false, message: '신청자 정보 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
