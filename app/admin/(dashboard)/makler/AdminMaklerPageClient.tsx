'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AdminMaklerCreateForm } from '@/components/AdminMaklerCreateForm'
import { MaklerDeleteButton } from '@/components/MaklerDeleteButton'
import { MaklerLogo } from '@/components/MaklerLogo'
import { ABO_STUFEN, getAboLabel } from '@/lib/abo-stufen'

interface MaklerRow {
  id: string
  name: string
  firmenname?: string
  plz: string
  city: string
  status: string
  logoUrl: string | null
  _count: { leads: number }
}

export function AdminMaklerPageClient({ makler }: { makler: MaklerRow[] }) {
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Makler verwalten</h1>
          <p className="mt-2 text-slate-600">
            {makler.length} Makler in der Datenbank
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(!showCreate)}
          className="rounded-lg bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-700"
        >
          {showCreate ? 'Abbrechen' : 'Neuer Makler'}
        </button>
      </div>

      {showCreate && (
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Neuen Makler anlegen</h2>
          <AdminMaklerCreateForm onCancel={() => setShowCreate(false)} />
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500 w-14">Logo</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Firmenname</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">PLZ / Ort</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Leads</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase text-slate-500">Aktion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {makler.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <MaklerLogo
                    logoUrl={m.logoUrl}
                    alt={m.firmenname || m.name}
                    shape="square"
                    size="sm"
                  />
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">{m.firmenname || m.name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-slate-600">{m.plz} {m.city}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${ABO_STUFEN[m.status as keyof typeof ABO_STUFEN]?.badgeColor ?? 'bg-slate-100 text-slate-600'}`}
                  >
                    {getAboLabel(m.status)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-slate-600">{m._count.leads}</td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/makler/${m.id}`} className="text-teal-600 hover:underline">
                      Bearbeiten
                    </Link>
                    <MaklerDeleteButton
                      maklerId={m.id}
                      maklerName={m.firmenname || m.name}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
