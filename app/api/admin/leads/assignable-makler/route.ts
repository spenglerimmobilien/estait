import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const NEARBY_LIMIT = 30
const SEARCH_LIMIT = 20
const RESPONSE_CACHE = new Map<string, { data: unknown; ts: number }>()
const CACHE_TTL_MS = 60_000

export async function GET(request: NextRequest) {
  const session = await getSession()
  const role = (session?.user as { role?: string })?.role

  if (role !== 'admin') {
    return NextResponse.json({ error: 'Nur Admins' }, { status: 403 })
  }

  const plz = request.nextUrl.searchParams.get('plz')
  const search = request.nextUrl.searchParams.get('search')?.trim() ?? ''
  const page = Math.max(1, parseInt(request.nextUrl.searchParams.get('page') ?? '1', 10))

  if (!plz || plz.trim().length < 2) {
    return NextResponse.json({ error: 'PLZ erforderlich' }, { status: 400 })
  }

  const plzNorm = plz.replace(/\s/g, '').padStart(5, '0').slice(0, 5)
  const plzPrefix = plzNorm.slice(0, 2)

  // Status-Reihenfolge: premium > partner > starter > standard > pending
  const statusOrder: Record<string, number> = { premium: 0, partner: 1, starter: 2, standard: 3, pending: 4 }
  const plzNum = parseInt(plzNorm, 10) || 0

  function sortByAboAndDistance<T extends { plz: string; status: string }>(arr: T[]): T[] {
    return [...arr].sort((a, b) => {
      const aOrder = statusOrder[a.status] ?? 4
      const bOrder = statusOrder[b.status] ?? 4
      if (aOrder !== bOrder) return aOrder - bOrder
      const aPlz = a.plz.replace(/\s/g, '').padStart(5, '0').slice(0, 5)
      const bPlz = b.plz.replace(/\s/g, '').padStart(5, '0').slice(0, 5)
      const aExact = aPlz === plzNorm ? 1 : 0
      const bExact = bPlz === plzNorm ? 1 : 0
      if (bExact !== aExact) return bExact - aExact
      const aNum = parseInt(aPlz, 10) || 0
      const bNum = parseInt(bPlz, 10) || 0
      return Math.abs(aNum - plzNum) - Math.abs(bNum - plzNum)
    })
  }

  // Suchmodus: Paginierte Suche – alle Makler (auch ohne Abo)
  if (search.length >= 2) {
    const skip = (page - 1) * SEARCH_LIMIT

    const [allMakler, total] = await Promise.all([
      prisma.makler.findMany({
        where: {
          OR: [
            { name: { contains: search } },
            { firmenname: { contains: search } },
            { plz: { contains: search } },
            { city: { contains: search } },
          ],
        },
        take: 500,
        select: { id: true, name: true, firmenname: true, plz: true, city: true, logoUrl: true, status: true },
      }),
      prisma.makler.count({
        where: {
          OR: [
            { name: { contains: search } },
            { firmenname: { contains: search } },
            { plz: { contains: search } },
            { city: { contains: search } },
          ],
        },
      }),
    ])

    const sorted = sortByAboAndDistance(allMakler)
    const paginated = sorted.slice(skip, skip + SEARCH_LIMIT)

    return NextResponse.json({
      mode: 'search',
      makler: paginated.map((m) => ({
        id: m.id,
        name: m.firmenname || m.name,
        plz: m.plz,
        city: m.city,
        logoUrl: m.logoUrl,
        status: m.status,
      })),
      total,
      page,
      hasMore: skip + paginated.length < total,
    })
  }

  // Standardmodus: Alle Makler in der Nähe (PLZ-basiert), sortiert nach Abo + Entfernung
  const cacheKey = `assignable:nearby:${plzNorm}`
  const cached = RESPONSE_CACHE.get(cacheKey)
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return NextResponse.json(cached.data)
  }

  const allMakler = await prisma.makler.findMany({
    where: { plz: { startsWith: plzPrefix } },
    take: 200,
    select: { id: true, name: true, firmenname: true, plz: true, city: true, logoUrl: true, status: true },
  })

  const nearby = sortByAboAndDistance(allMakler).slice(0, NEARBY_LIMIT)

  const result = {
    mode: 'nearby',
    nearbyMakler: nearby.map((m) => ({
      id: m.id,
      name: m.firmenname || m.name,
      plz: m.plz,
      city: m.city,
      logoUrl: m.logoUrl,
      status: m.status,
    })),
    otherPaidMakler: [],
  }

  RESPONSE_CACHE.set(cacheKey, { data: result, ts: Date.now() })
  return NextResponse.json(result)
}
