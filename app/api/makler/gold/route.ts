import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/** Top-Tier Makler (Premium) – Route /gold bleibt für Kompatibilität */
export async function GET() {
  const makler = await prisma.makler.findMany({
    where: { status: 'premium' },
    take: 10,
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(makler)
}
