import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, plz, city, email, password, plan, address, phone, website } = body

    if (!name?.trim() || !plz?.trim() || !city?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: 'Name, PLZ, Stadt, E-Mail und Passwort sind erforderlich.' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Passwort muss mindestens 6 Zeichen haben.' },
        { status: 400 }
      )
    }

    const emailNorm = email.trim().toLowerCase()
    const existing = await prisma.makler.findFirst({
      where: { email: emailNorm },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'Diese E-Mail-Adresse ist bereits registriert.' },
        { status: 400 }
      )
    }

    const passwordHash = await hash(password, 10)

    const validPlans = ['standard', 'starter', 'partner', 'premium']
    const requestedPlan = plan?.trim()?.toLowerCase()
    const isValidPlan = requestedPlan && validPlans.includes(requestedPlan)
    const status =
      isValidPlan && requestedPlan !== 'standard' ? 'pending' : 'standard'
    const requestedPlanValue = isValidPlan && requestedPlan !== 'standard' ? requestedPlan : null

    await prisma.makler.create({
      data: {
        name: name.trim(),
        plz: plz.trim(),
        city: city.trim(),
        email: emailNorm,
        passwordHash,
        address: address?.trim() || null,
        phone: phone?.trim() || null,
        website: website?.trim() || null,
        status,
        requestedPlan: requestedPlanValue,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Makler registration error:', error)
    return NextResponse.json(
      { error: 'Registrierung fehlgeschlagen.' },
      { status: 500 }
    )
  }
}
