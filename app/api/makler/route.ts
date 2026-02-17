import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { VALID_ABO_STATUSES } from '@/lib/abo-stufen'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 24

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const plz = searchParams.get('plz')
  const city = searchParams.get('stadt')
  const statusFilter = searchParams.get('status')
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))

  const where: {
    plz?: { startsWith: string }
    city?: { contains: string }
    status?: string
  } = {}

  if (plz && plz.length >= 2) {
    const plzNormalized = plz.replace(/\s/g, '').slice(0, 5)
    where.plz = { startsWith: plzNormalized.slice(0, 2) }
  }

  if (city && city.trim().length >= 2) {
    where.city = { contains: city.trim() }
  }

  if (statusFilter && VALID_ABO_STATUSES.includes(statusFilter as 'standard' | 'starter' | 'partner' | 'premium' | 'pending')) {
    where.status = statusFilter
  }

  const plzNormalized = plz?.replace(/\s/g, '').slice(0, 5) ?? ''
  const statusOrder: Record<string, number> = { standard: 0, starter: 1, partner: 2, premium: 3, pending: 4 }

  const [total, makler] = await Promise.all([
    prisma.makler.count({ where: Object.keys(where).length > 0 ? where : undefined }),
    prisma.makler.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      include: { _count: { select: { leads: true } } },
      orderBy: [
        { status: 'asc' },
        { plz: 'asc' },
        { firmenname: 'asc' },
      ],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ])

  const sorted = [...makler].sort((a, b) => {
    const aOrder = statusOrder[a.status as keyof typeof statusOrder] ?? 3
    const bOrder = statusOrder[b.status as keyof typeof statusOrder] ?? 3
    if (aOrder !== bOrder) return aOrder - bOrder
    if (plzNormalized) {
      const aExact = a.plz === plzNormalized ? 1 : 0
      const bExact = b.plz === plzNormalized ? 1 : 0
      return bExact - aExact
    }
    return (a.firmenname || a.name).localeCompare(b.firmenname || b.name)
  })

  return NextResponse.json({
    makler: sorted,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE),
  })
}
