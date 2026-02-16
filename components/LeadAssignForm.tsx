'use client'

import { useState, useEffect, useCallback } from 'react'
import { ABO_STUFEN, getAboLabel } from '@/lib/abo-stufen'

interface Makler {
  id: string
  name: string
  plz: string
  city: string
  logoUrl: string | null
  status: string
  distanceKm?: number
}

interface LeadAssignFormProps {
  leadId: string
  assignedMaklerIds: string[]
  leadPlz?: string
}

function MaklerCard({
  m,
  plzNorm,
  isAssigned,
  assigning,
  canAssign,
  onAssign,
  onUnassign,
}: {
  m: Makler
  plzNorm: string
  isAssigned: boolean
  assigning: string | null
  canAssign: boolean
  onAssign: (id: string) => void
  onUnassign: (id: string) => void
}) {
  const mPlz = m.plz.replace(/\s/g, '').padStart(5, '0').slice(0, 5)
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-4 py-2 transition ${
        isAssigned
          ? 'border-teal-400 bg-teal-50'
          : 'border-slate-200 bg-slate-50 hover:border-teal-300 hover:bg-teal-50/50'
      }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
        {m.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.logoUrl} alt={m.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-lg text-slate-400">🏢</span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-900">{m.name}</p>
        <p className="text-xs text-slate-600">
          {m.plz} {m.city}
          {plzNorm && mPlz === plzNorm && (
            <span className="ml-1.5 rounded bg-teal-100 px-1.5 py-0.5 text-teal-700">
              gleiche PLZ
            </span>
          )}
          {m.distanceKm != null && (
            <span className="ml-1.5 text-slate-500">ca. {m.distanceKm} km</span>
          )}
          <span
            className={`ml-1.5 rounded px-1.5 py-0.5 text-xs ${ABO_STUFEN[m.status as keyof typeof ABO_STUFEN]?.badgeColor ?? 'bg-slate-100 text-slate-500'}`}
          >
            {getAboLabel(m.status)}
          </span>
        </p>
      </div>
      {isAssigned ? (
        <button
          type="button"
          onClick={() => onUnassign(m.id)}
          disabled={!!assigning}
          className="ml-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          {assigning === m.id ? 'Wird entfernt...' : 'Entfernen'}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onAssign(m.id)}
          disabled={!!assigning || !canAssign}
          className="ml-2 rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
        >
          {assigning === m.id ? 'Wird zugewiesen...' : 'Zuweisen'}
        </button>
      )}
    </div>
  )
}

export default function LeadAssignForm({
  leadId,
  assignedMaklerIds,
  leadPlz = '',
}: LeadAssignFormProps) {
  const plzNorm = leadPlz.replace(/\s/g, '').padStart(5, '0').slice(0, 5)
  const [assigning, setAssigning] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [nearbyMakler, setNearbyMakler] = useState<Makler[]>([])
  const [loading, setLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Makler[]>([])
  const [searchTotal, setSearchTotal] = useState(0)
  const [searchPage, setSearchPage] = useState(1)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchFetched, setSearchFetched] = useState(false)

  const fetchNearby = useCallback(() => {
    if (!leadPlz?.trim()) {
      setLoading(false)
      return
    }
    setLoading(true)
    fetch(`/api/admin/leads/assignable-makler?plz=${encodeURIComponent(leadPlz)}`)
      .then((res) => res.json())
      .then((data) => {
        setNearbyMakler(data.nearbyMakler ?? [])
      })
      .catch(() => setNearbyMakler([]))
      .finally(() => setLoading(false))
  }, [leadPlz])

  useEffect(() => {
    fetchNearby()
  }, [fetchNearby])

  const fetchSearch = useCallback(
    (q: string, page: number, append: boolean) => {
      if (q.length < 2) {
        setSearchResults([])
        setSearchTotal(0)
        setSearchFetched(false)
        return
      }
      setSearchLoading(true)
      fetch(
        `/api/admin/leads/assignable-makler?plz=${encodeURIComponent(leadPlz)}&search=${encodeURIComponent(q)}&page=${page}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.mode === 'search') {
            const newMakler = data.makler ?? []
            setSearchResults((prev) => (append ? [...prev, ...newMakler] : newMakler))
            setSearchTotal(data.total ?? 0)
            setSearchPage(data.page ?? 1)
          }
        })
        .catch(() => {
          if (!append) {
            setSearchResults([])
            setSearchTotal(0)
          }
        })
        .finally(() => {
          setSearchLoading(false)
          setSearchFetched(true)
        })
    },
    [leadPlz]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        fetchSearch(searchQuery, 1, false)
      } else {
        setSearchResults([])
        setSearchTotal(0)
        setSearchFetched(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, fetchSearch])

  async function handleAssign(maklerId: string) {
    setAssigning(maklerId)
    setError(null)
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maklerId, action: 'add' }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Zuweisung fehlgeschlagen.')
        setAssigning(null)
        return
      }
      window.location.reload()
    } catch {
      setError('Zuweisung fehlgeschlagen.')
      setAssigning(null)
    }
  }

  async function handleUnassign(maklerId: string) {
    setAssigning(maklerId)
    setError(null)
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maklerId, action: 'remove' }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Zuweisung konnte nicht entfernt werden.')
        setAssigning(null)
        return
      }
      window.location.reload()
    } catch {
      setError('Zuweisung konnte nicht entfernt werden.')
      setAssigning(null)
    }
  }

  const canAssignMore = assignedMaklerIds.length < 3

  if (loading) {
    return (
      <div className="mt-6 border-t border-slate-200 pt-6">
        <p className="text-sm text-slate-500">Lade Makler in der Nähe...</p>
      </div>
    )
  }

  return (
    <div className="mt-6 border-t border-slate-200 pt-6">
      <h4 className="mb-3 text-sm font-semibold text-slate-700">
        Lead zuweisen (alle Makler, sortiert nach Abo und Entfernung)
      </h4>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      {assignedMaklerIds.length > 0 && (
        <p className="mb-4 text-sm text-slate-600">
          Zugewiesene Makler: {assignedMaklerIds.length}/3 (Entfernen per Button unten)
        </p>
      )}

      {nearbyMakler.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 text-xs font-medium text-slate-500">
            Makler in der Nähe des Objekts (PLZ-Bereich)
          </p>
          <div className="flex flex-wrap gap-3">
            {nearbyMakler.map((m) => (
              <MaklerCard
                key={m.id}
                m={m}
                plzNorm={plzNorm}
                isAssigned={assignedMaklerIds.includes(m.id)}
                assigning={assigning}
                canAssign={canAssignMore}
                onAssign={handleAssign}
                onUnassign={handleUnassign}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-medium text-slate-500">
          Anderen Makler suchen (Name, PLZ oder Stadt)
        </p>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="z.B. Müller, 48159 oder Münster"
          className="mb-3 block w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-teal-500"
        />
        {searchLoading && (
          <p className="mb-2 text-xs text-slate-500">Suche...</p>
        )}
        {searchQuery.length >= 2 && !searchLoading && (
          <>
            {searchResults.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-slate-500">
                  {searchTotal} Treffer
                  {searchTotal > 20 && ' (20 pro Seite)'}
                </p>
                <div className="flex max-h-64 flex-col gap-2 overflow-auto rounded-lg border border-slate-200 bg-slate-50/50 p-2">
                  {searchResults.map((m) => (
                    <MaklerCard
                      key={m.id}
                      m={m}
                      plzNorm={plzNorm}
                      isAssigned={assignedMaklerIds.includes(m.id)}
                      assigning={assigning}
                      canAssign={canAssignMore}
                      onAssign={handleAssign}
                      onUnassign={handleUnassign}
                    />
                  ))}
                </div>
                {searchTotal > searchResults.length && (
                  <button
                    type="button"
                    onClick={() => fetchSearch(searchQuery, searchPage + 1, true)}
                    disabled={searchLoading}
                    className="mt-2 text-sm text-teal-600 hover:underline disabled:opacity-50"
                  >
                    {searchLoading ? 'Lade...' : 'Weitere laden'}
                  </button>
                )}
              </div>
            ) : searchFetched ? (
              <p className="text-sm text-slate-500">Keine Makler gefunden.</p>
            ) : null}
          </>
        )}
      </div>

      {nearbyMakler.length === 0 && !searchQuery && (
        <p className="text-sm text-slate-500">
          Keine Makler in diesem PLZ-Bereich. Nutzen Sie die Suche oben, um einen Makler zu finden.
        </p>
      )}
    </div>
  )
}
