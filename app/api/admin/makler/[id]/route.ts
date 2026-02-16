import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string })?.role
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const {
    firmenname,
    ansprechpartner,
    plz,
    city,
    address,
    email,
    phone,
    website,
    facebookUrl,
    instagramUrl,
    linkedinUrl,
    twitterUrl,
    youtubeUrl,
    googleBusinessUrl,
    taetigkeitsbereiche,
    leistungen,
    ueberUnserBuero,
    status,
    password,
    logoUrl,
  } = body

  const data: Record<string, unknown> = {}

  if (typeof firmenname === 'string' && firmenname.trim()) {
    data.firmenname = firmenname.trim()
    data.name = firmenname.trim()
  }
  if (ansprechpartner !== undefined) data.ansprechpartner = ansprechpartner?.trim() || null
  if (typeof plz === 'string' && plz.trim()) data.plz = plz.trim()
  if (typeof city === 'string' && city.trim()) data.city = city.trim()
  if (address !== undefined) data.address = address?.trim() || null
  if (email !== undefined) data.email = email ? email.trim().toLowerCase() : null
  if (phone !== undefined) data.phone = phone?.trim() || null
  if (website !== undefined) data.website = website?.trim() || null
  if (facebookUrl !== undefined) data.facebookUrl = facebookUrl?.trim() || null
  if (instagramUrl !== undefined) data.instagramUrl = instagramUrl?.trim() || null
  if (linkedinUrl !== undefined) data.linkedinUrl = linkedinUrl?.trim() || null
  if (twitterUrl !== undefined) data.twitterUrl = twitterUrl?.trim() || null
  if (youtubeUrl !== undefined) data.youtubeUrl = youtubeUrl?.trim() || null
  if (googleBusinessUrl !== undefined) data.googleBusinessUrl = googleBusinessUrl?.trim() || null
  if (taetigkeitsbereiche !== undefined) {
    data.taetigkeitsbereiche = Array.isArray(taetigkeitsbereiche)
      ? JSON.stringify(taetigkeitsbereiche)
      : null
  }
  if (leistungen !== undefined) {
    data.leistungen = Array.isArray(leistungen) ? JSON.stringify(leistungen) : null
  }
  if (ueberUnserBuero !== undefined) data.ueberUnserBuero = ueberUnserBuero?.trim() || null
  if (logoUrl !== undefined) data.logoUrl = logoUrl || null

  if (status && ['standard', 'starter', 'partner', 'premium', 'pending'].includes(status)) {
    data.status = status
    data.verifiedAt = ['starter', 'partner', 'premium'].includes(status) ? new Date() : null
  }

  if (password && password.length >= 6) {
    data.passwordHash = await hash(password, 10)
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'Keine gültigen Änderungen' }, { status: 400 })
  }

  await prisma.makler.update({
    where: { id },
    data,
  })

  return NextResponse.json({ success: true })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string })?.role
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Nur Admins können Makler löschen.' }, { status: 403 })
  }

  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: 'Makler-ID fehlt.' }, { status: 400 })
  }

  try {
    await prisma.$transaction([
      prisma.lead.updateMany({ where: { maklerId: id }, data: { maklerId: null } }),
      prisma.leadAssignment.deleteMany({ where: { maklerId: id } }),
      prisma.makler.delete({ where: { id } }),
    ])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Makler delete error:', error)
    return NextResponse.json(
      { error: 'Makler konnte nicht gelöscht werden.' },
      { status: 500 }
    )
  }
}
