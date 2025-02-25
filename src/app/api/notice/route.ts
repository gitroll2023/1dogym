import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const notice = await prisma.notice.findFirst({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ success: true, notice })
  } catch (error) {
    console.error('Error fetching notice:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch notice' })
  }
}

export async function POST(request: Request) {
  try {
    const existingNotice = await prisma.notice.findFirst()
    if (existingNotice) {
      return NextResponse.json({ 
        success: false, 
        error: '이미 등록된 공지사항이 있습니다. 새로운 공지를 등록하려면 먼저 기존 공지를 삭제해주세요.' 
      })
    }

    const body = await request.json()
    const notice = await prisma.notice.create({
      data: {
        content: body.content,
        location: body.location,
        startTime: body.startTime,
        endTime: body.endTime
      }
    })

    return NextResponse.json({ success: true, notice })
  } catch (error) {
    console.error('Error creating notice:', error)
    return NextResponse.json({ success: false, error: 'Failed to create notice' })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const notice = await prisma.notice.update({
      where: { id },
      data: {
        content: updateData.content,
        location: updateData.location,
        startTime: updateData.startTime,
        endTime: updateData.endTime
      }
    })

    return NextResponse.json({ success: true, notice })
  } catch (error) {
    console.error('Error updating notice:', error)
    return NextResponse.json({ success: false, error: '공지사항 수정에 실패했습니다.' })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Notice ID is required' })
    }

    await prisma.notice.delete({
      where: {
        id: parseInt(id)
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting notice:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete notice' })
  }
}
