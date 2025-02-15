import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const applicant = await prisma.applicant.create({
      data: {
        name: body.name,
        phone: body.phone,
        exerciseFrequency: body.exerciseFrequency,
        exercisePurpose: body.exercisePurpose,
        postureType: body.postureType,
        nerveResponse: body.nerveResponse,
        participationIntent: body.participationIntent === 'yes'
      }
    })

    return NextResponse.json({ success: true, data: applicant })
  } catch (error) {
    console.error('Error creating applicant:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}
