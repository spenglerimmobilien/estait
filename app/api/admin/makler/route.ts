import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string })?.role
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { firmenname, ansprechpartner, plz, city, email, password, address, phone, website } = body

  if (!firmenname?.trim() || !plz?.trim() || !city?.trim() || !email?.trim() || !password) {
    return NextResponse.json(
      { error: 'Firmenname, PLZ, Stadt, E-Mail und Passwort sind erforderlich.' },
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
      { error: 'Diese E-Mail-Adresse ist bereits vergeben.' },
      { status: 400 }
    )
  }

  const passwordHash = await hash(password, 10)

  const firmennameTrim = firmenname.trim()
  const makler = await prisma.makler.create({
    data: {
      name: firmennameTrim,
      firmenname: firmennameTrim,
      ansprechpartner: ansprechpartner?.trim() || null,
      plz: plz.trim(),
      city: city.trim(),
      email: emailNorm,
      passwordHash,
      address: address?.trim() || null,
      phone: phone?.trim() || null,
      website: website?.trim() || null,
      status: 'standard',
    },
  })

  return NextResponse.json({
    success: true,
    makler: { id: makler.id, name: makler.name, firmenname: makler.firmenname, email: makler.email },
  })
}
