import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { getAboLabel, isPaidAbo } from '@/lib/abo-stufen'

export const dynamic = 'force-dynamic'

export default async function MaklerPaketPage() {
  const session = await getSession()
  const role = (session?.user as { role?: string })?.role
  const userId = (session?.user as { id?: string })?.id

  if (role !== 'makler' || !userId) {
    redirect('/admin')
  }

  const makler = await prisma.makler.findUnique({
    where: { id: userId },
  })

  if (!makler) {
    redirect('/admin')
  }

  const status = makler.status
  const hasPaidAbo = isPaidAbo(status)
  const paketLabel = getAboLabel(status)

  const tiers = [
    { id: 'standard', label: 'Standard', desc: 'Standard-Eintrag im Verzeichnis, sichtbar bei PLZ-Suche' },
    { id: 'starter', label: 'Starter', desc: 'Branding & Image, ESTAIT-Siegel, Partner-Map' },
    { id: 'partner', label: 'Partner', desc: 'Bestseller: Gebietsschutz, 3 Leads/Monat inklusive' },
    { id: 'premium', label: 'Premium', desc: 'Full-Service: 10 Leads/Monat, Gold-Badge, Werbebudget' },
  ] as const

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Ihr Paket</h1>
      <p className="mt-2 text-slate-600">
        Ihre Art der Mitgliedschaft im ESTAIT-Verzeichnis
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`rounded-xl border-2 p-6 ${
              status === tier.id
                ? tier.id === 'premium'
                  ? 'border-amber-400 bg-amber-50'
                  : 'border-teal-400 bg-teal-50'
                : 'border-slate-200 bg-white'
            }`}
          >
            <h3 className="font-semibold text-slate-900">{tier.label}</h3>
            <p className="mt-2 text-sm text-slate-600">{tier.desc}</p>
            {status === tier.id && (
              <span
                className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                  tier.id === 'premium' ? 'bg-amber-600 text-white' : 'bg-teal-600 text-white'
                }`}
              >
                Ihr Paket
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Aktueller Status</h2>
        <p className="mt-2 text-slate-600">
          Sie haben das Paket <strong>{paketLabel}</strong>.
        </p>
        {status === 'pending' && (
          <p className="mt-2 text-amber-700">
            Ihr Antrag wird geprüft. Sie erhalten eine Benachrichtigung, sobald Ihr Status aktualisiert wurde.
          </p>
        )}
      </div>

      {hasPaidAbo && (
        <div className="mt-8">
          <Link
            href="/admin/marketing"
            className="inline-flex items-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            Digitales Marketing-Paket →
          </Link>
        </div>
      )}
    </div>
  )
}
