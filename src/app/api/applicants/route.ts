import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const applicants = await prisma.applicant.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ success: true, data: applicants })
  } catch (error) {
    console.error('Error fetching applicants:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch applicants' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, checked } = body

    const applicant = await prisma.applicant.update({
      where: { id },
      data: { checked }
    })

    return NextResponse.json({ success: true, data: applicant })
  } catch (error) {
    console.error('Error updating applicant:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update applicant' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      )
    }

    await prisma.applicant.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting applicant:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete applicant' },
      { status: 500 }
    )
  }
}

// PATCH /api/applicants/[id] - 신청자 확인 상태 토글
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 먼저 현재 상태를 확인
    const currentApplicant = await prisma.applicant.findUnique({
      where: {
        id: parseInt(params.id)
      }
    })

    if (!currentApplicant) {
      return NextResponse.json(
        { error: 'Applicant not found' },
        { status: 404 }
      )
    }

    // 현재 상태의 반대로 업데이트
    const updatedApplicant = await prisma.applicant.update({
      where: {
        id: parseInt(params.id)
      },
      data: {
        checked: !currentApplicant.checked
      }
    })

    return NextResponse.json({ 
      success: true,
      data: updatedApplicant 
    })
  } catch (error) {
    console.error('Error updating applicant:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update applicant' },
      { status: 500 }
    )
  }
}
