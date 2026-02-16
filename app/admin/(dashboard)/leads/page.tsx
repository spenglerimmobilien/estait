import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminLeadsList } from '@/components/AdminLeadsList'

export const dynamic = 'force-dynamic'

export default async function AdminLeadsPage() {
  const session = await getSession()
  const role = (session?.user as { role?: string })?.role ?? 'admin'
  const userId = (session?.user as { id?: string })?.id

  const where =
    role === 'makler' && userId
      ? { OR: [{ assignments: { some: { maklerId: userId } } }, { maklerId: userId }] }
      : {}
  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      makler: true,
      assignments: { include: { makler: true } },
    },
  })

  // Migrate legacy maklerId to assignments (one-time, idempotent)
  let migrated = false
  for (const lead of leads) {
    if (lead.maklerId && lead.assignments.length === 0) {
      await prisma.leadAssignment.create({
        data: { leadId: lead.id, maklerId: lead.maklerId },
      }).catch(() => {})
      migrated = true
    }
  }
  const leadsToShow = migrated
    ? await prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { makler: true, assignments: { include: { makler: true } } },
      })
    : leads

  const serializedLeads = leadsToShow.map((lead) => {
    let propertyData: Record<string, unknown> | null = null
    if (lead.propertyData) {
      try {
        propertyData =
          typeof lead.propertyData === 'string'
            ? JSON.parse(lead.propertyData)
            : (lead.propertyData as Record<string, unknown>)
      } catch {
        propertyData = null
      }
    }
    return {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      plz: lead.plz,
      createdAt: lead.createdAt.toISOString(),
      propertyData,
      assignments: lead.assignments.map((a) => ({
        id: a.id,
        maklerId: a.maklerId,
        maklerStatus: a.maklerStatus,
        makler: {
          id: a.makler.id,
          name: a.makler.name,
          firmenname: (a.makler as { firmenname?: string }).firmenname,
        },
      })),
    }
  })

  return <AdminLeadsList leads={serializedLeads} role={role} userId={userId} />
}
