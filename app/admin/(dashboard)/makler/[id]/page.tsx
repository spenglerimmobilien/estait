import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AdminMaklerEditForm } from './AdminMaklerEditForm'

export default async function AdminMaklerEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const makler = await prisma.makler.findUnique({ where: { id } })
  if (!makler) notFound()

  const displayName = makler.firmenname || makler.name

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Makler bearbeiten</h1>
      <p className="mt-2 text-slate-600">{displayName}</p>
      <AdminMaklerEditForm makler={makler} />
    </div>
  )
}
