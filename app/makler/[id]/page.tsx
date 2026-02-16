import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { MaklerLogo } from '@/components/MaklerLogo'
import { MaklerSocialLinks } from '@/components/MaklerSocialLinks'
import { TAETIGKEITSBEREICHE, LEISTUNGEN } from '@/lib/makler-options'
import { ABO_STUFEN, getAboLabel, isPaidAbo } from '@/lib/abo-stufen'

function parseJsonArray(val: string | null | undefined): string[] {
  if (!val) return []
  try {
    const arr = JSON.parse(val)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function getLabels(ids: string[], options: readonly { id: string; label: string }[]): string[] {
  const result: string[] = []
  for (const id of ids) {
    const opt = options.find((o) => o.id === id)
    if (opt?.label) result.push(opt.label)
  }
  return result
}

export default async function MaklerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const makler = await prisma.makler.findUnique({ where: { id } })
  if (!makler) notFound()

  const isPremium = isPaidAbo(makler.status)
  const displayName = makler.firmenname || makler.name
  const taetigkeitsbereicheLabels = getLabels(
    parseJsonArray(makler.taetigkeitsbereiche),
    TAETIGKEITSBEREICHE
  )
  const leistungenLabels = getLabels(parseJsonArray(makler.leistungen), LEISTUNGEN)

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/makler" className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700">
        ← Zurück zur Suche
      </Link>

      <div
        className={
          isPremium
            ? 'mt-8 overflow-hidden rounded-2xl border border-teal-200 bg-gradient-to-b from-teal-50/60 to-white shadow-sm'
            : 'mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'
        }
      >
        <div className="p-8 sm:p-10">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <MaklerLogo logoUrl={makler.logoUrl} alt={displayName} shape="rounded" size="lg" />
            <div className="min-w-0 flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-slate-900">{displayName}</h1>
            {makler.ansprechpartner && (
              <p className="mt-1 text-slate-600">Ansprechpartner: {makler.ansprechpartner}</p>
            )}
            <p className="mt-1 text-slate-600">
              {makler.plz} {makler.city}
            </p>
            {isPremium && (
              <span
                className={`mt-2 inline-block rounded-full px-4 py-1.5 text-sm font-medium ${ABO_STUFEN[makler.status as keyof typeof ABO_STUFEN]?.badgeColor ?? 'bg-slate-100 text-slate-700'}`}
              >
                {getAboLabel(makler.status)}-Makler
              </span>
            )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/50 px-8 py-6 sm:px-10">
          <div className="space-y-4">
          {makler.address && (
            <div>
              <span className="text-sm font-medium text-slate-500">Adresse</span>
              <p className="text-slate-900">{makler.address}</p>
            </div>
          )}
          {makler.phone && (
            <div>
              <span className="text-sm font-medium text-slate-500">Telefon</span>
              <p>
                <a href={`tel:${makler.phone}`} className="text-teal-600 hover:text-teal-700">
                  {makler.phone}
                </a>
              </p>
            </div>
          )}
          {makler.email && (
            <div>
              <span className="text-sm font-medium text-slate-500">E-Mail</span>
              <p>
                <a href={`mailto:${makler.email}`} className="text-teal-600 hover:text-teal-700">
                  {makler.email}
                </a>
              </p>
            </div>
          )}
          {makler.website && (
            <div>
              <span className="text-sm font-medium text-slate-500">Website</span>
              <p>
                <a
                  href={
                    makler.website.startsWith('http') ? makler.website : `https://${makler.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700"
                >
                  {makler.website}
                </a>
              </p>
            </div>
          )}
          <MaklerSocialLinks
            facebookUrl={makler.facebookUrl}
            instagramUrl={makler.instagramUrl}
            linkedinUrl={makler.linkedinUrl}
            twitterUrl={makler.twitterUrl}
            youtubeUrl={makler.youtubeUrl}
            googleBusinessUrl={makler.googleBusinessUrl}
            firmenname={displayName}
            city={makler.city}
          />
          </div>

          {taetigkeitsbereicheLabels.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-700">Tätigkeitsbereich</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {taetigkeitsbereicheLabels.map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
          )}

          {leistungenLabels.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-700">Leistungen</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {leistungenLabels.map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-teal-50 px-3 py-1 text-sm text-teal-800"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
          )}

          {makler.ueberUnserBuero?.trim() && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-700">Über unser Büro</h3>
            <div className="mt-2 whitespace-pre-wrap text-slate-600">
              {makler.ueberUnserBuero}
            </div>
          </div>
          )}

          <Link
            href={`/beratung?makler=${makler.id}&plz=${makler.plz}`}
            className="mt-6 inline-flex rounded-xl bg-teal-600 px-6 py-3 font-medium text-white shadow-sm hover:bg-teal-700"
          >
            Kostenlose Beratung anfragen
          </Link>
        </div>
      </div>
    </div>
  )
}
