import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ABO_STUFEN, getAboLabel, isPaidAbo } from '@/lib/abo-stufen'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const session = await getSession()
  const role = (session?.user as { role?: string })?.role
  const userId = (session?.user as { id?: string })?.id
  const isAdmin = role === 'admin'

  const maklerCount = await prisma.makler.count()
  const leadCount = await prisma.lead.count()

  let myLeads = 0
  let maklerStatus = 'standard'
  let maklerId: string | null = null
  let recentLeadsCount = 0

  if (role === 'makler' && userId) {
    const [leadsResult, makler] = await Promise.all([
      prisma.lead.count({
        where: {
          OR: [
            { assignments: { some: { maklerId: userId } } },
            { maklerId: userId },
          ],
        },
      }),
      prisma.makler.findUnique({
        where: { id: userId },
        select: { status: true, id: true },
      }),
    ])
    myLeads = leadsResult
    maklerStatus = makler?.status ?? 'standard'
    maklerId = makler?.id ?? null
    recentLeadsCount = await prisma.lead.count({
      where: {
        OR: [
          { assignments: { some: { maklerId: userId } } },
          { maklerId: userId },
        ],
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-2 text-slate-600">
        Willkommen, {session?.user?.name}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isAdmin && (
          <>
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-slate-900">Makler</h3>
              <p className="mt-2 text-3xl font-bold text-teal-600">{maklerCount}</p>
              <Link href="/admin/makler" className="mt-4 text-sm text-teal-600 hover:underline">
                Verwalten →
              </Link>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-slate-900">Leads gesamt</h3>
              <p className="mt-2 text-3xl font-bold text-teal-600">{leadCount}</p>
              <Link href="/admin/leads" className="mt-4 text-sm text-teal-600 hover:underline">
                Anzeigen →
              </Link>
            </div>
          </>
        )}
        {role === 'makler' && (
          <>
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-slate-900">Meine Leads</h3>
              <p className="mt-2 text-3xl font-bold text-teal-600">{myLeads}</p>
              <p className="mt-1 text-sm text-slate-500">
                {recentLeadsCount} in den letzten 30 Tagen
              </p>
              <Link href="/admin/leads" className="mt-4 text-sm text-teal-600 hover:underline">
                Anzeigen →
              </Link>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-slate-900">Mitgliedschaft</h3>
              <p className="mt-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${ABO_STUFEN[maklerStatus as keyof typeof ABO_STUFEN]?.badgeColor ?? 'bg-slate-100 text-slate-700'}`}
                >
                  {getAboLabel(maklerStatus)}
                </span>
              </p>
              <Link href="/admin/paket" className="mt-4 text-sm text-teal-600 hover:underline">
                Details →
              </Link>
            </div>
            {maklerId && (
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="font-semibold text-slate-900">Ihr Profil</h3>
                <p className="mt-2 text-sm text-slate-600">
                  So sehen Kunden Sie im Verzeichnis
                </p>
                <a
                  href={`/makler/${maklerId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-teal-600 hover:underline"
                >
                  Profil ansehen →
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
