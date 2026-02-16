import { prisma } from '@/lib/prisma'
import { AdminMaklerPageClient } from './AdminMaklerPageClient'

export default async function AdminMaklerPage() {
  const makler = await prisma.makler.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      firmenname: true,
      plz: true,
      city: true,
      status: true,
      logoUrl: true,
      _count: { select: { leads: true } },
    },
  })

  return <AdminMaklerPageClient makler={makler} />
}
