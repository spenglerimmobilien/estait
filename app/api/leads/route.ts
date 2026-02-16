import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, plz, propertyData, maklerId, consent } = body

    if (!name || !email || !plz) {
      return NextResponse.json(
        { error: 'Name, E-Mail und PLZ sind erforderlich.' },
        { status: 400 }
      )
    }

    if (!consent) {
      return NextResponse.json(
        { error: 'Bitte bestätigen Sie die Einwilligung zur Datenweitergabe.' },
        { status: 400 }
      )
    }

    const lead = await prisma.lead.create({
      data: {
        name: String(name).trim(),
        email: String(email).trim(),
        phone: phone ? String(phone).trim() : null,
        plz: String(plz).trim(),
        propertyData: propertyData ? (typeof propertyData === 'string' ? propertyData : JSON.stringify(propertyData)) : null,
        maklerId: maklerId || null,
      },
    })

    return NextResponse.json({ id: lead.id, success: true })
  } catch (error) {
    console.error('Lead creation error:', error)
    return NextResponse.json(
      { error: 'Fehler beim Speichern. Bitte versuchen Sie es erneut.' },
      { status: 500 }
    )
  }
}
