import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest) {
  const session = await getSession()
  const role = (session?.user as { role?: string })?.role
  const userId = (session?.user as { id?: string })?.id

  if (role !== 'makler' || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
  if (address !== undefined) data.address = address || null
  if (email !== undefined) data.email = email ? email.trim().toLowerCase() : null
  if (phone !== undefined) data.phone = phone || null
  if (website !== undefined) data.website = website || null
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

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'Keine Änderungen vorgenommen.' }, { status: 400 })
  }

  await prisma.makler.update({
    where: { id: userId },
    data,
  })

  return NextResponse.json({ success: true })
}
