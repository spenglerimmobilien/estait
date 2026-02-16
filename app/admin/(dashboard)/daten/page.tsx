import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MaklerDatenForm } from './MaklerDatenForm'

export default async function MaklerDatenPage() {
  const session = await getSession()
  const role = (session?.user as { role?: string })?.role
  const userId = (session?.user as { id?: string })?.id

  if (role !== 'makler' || !userId) {
    redirect('/admin')
  }

  const makler = await prisma.makler.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      firmenname: true,
      ansprechpartner: true,
      plz: true,
      city: true,
      address: true,
      email: true,
      phone: true,
      website: true,
      facebookUrl: true,
      instagramUrl: true,
      linkedinUrl: true,
      twitterUrl: true,
      youtubeUrl: true,
      googleBusinessUrl: true,
      taetigkeitsbereiche: true,
      leistungen: true,
      ueberUnserBuero: true,
      logoUrl: true,
    },
  })

  if (!makler) {
    redirect('/admin')
  }

  const maklerForForm = {
    ...makler,
    ansprechpartner: makler.ansprechpartner ?? null,
    address: makler.address ?? null,
    email: makler.email ?? null,
    phone: makler.phone ?? null,
    website: makler.website ?? null,
    facebookUrl: makler.facebookUrl ?? null,
    instagramUrl: makler.instagramUrl ?? null,
    linkedinUrl: makler.linkedinUrl ?? null,
    twitterUrl: makler.twitterUrl ?? null,
    youtubeUrl: makler.youtubeUrl ?? null,
    googleBusinessUrl: makler.googleBusinessUrl ?? null,
    taetigkeitsbereiche: makler.taetigkeitsbereiche ?? null,
    leistungen: makler.leistungen ?? null,
    ueberUnserBuero: makler.ueberUnserBuero ?? null,
    logoUrl: makler.logoUrl ?? null,
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Meine Daten</h1>
      <p className="mt-2 text-slate-600">
        Ändern Sie Ihren persönlichen Datensatz: Stammdaten, Kontakt, Social Media, Tätigkeitsbereiche und Logo.
      </p>
      <MaklerDatenForm makler={maklerForForm} />
    </div>
  )
}
