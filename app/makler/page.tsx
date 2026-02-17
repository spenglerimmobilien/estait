'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { MaklerWithCoords } from '@/components/MaklerMap'
import { MaklerLogo } from '@/components/MaklerLogo'
import { TAETIGKEITSBEREICHE } from '@/lib/makler-options'
import { ABO_STUFEN, getAboLabel } from '@/lib/abo-stufen'

const MaklerMap = dynamic(() => import('@/components/MaklerMap'), { ssr: false })

interface Makler {
  id: string
  name: string
  firmenname?: string
  plz: string
  city: string
  address: string | null
  email: string | null
  phone: string | null
  website: string | null
  status: string
  logoUrl: string | null
  taetigkeitsbereiche?: string | null
}

const STATUS_OPTIONS = [
  { id: '', label: 'Alle' },
  { id: 'starter', label: 'Starter' },
  { id: 'partner', label: 'Partner' },
  { id: 'premium', label: 'Premium' },
] as const

const MAP_MAX_RESULTS = 80

export default function MaklerPage() {
  const [plz, setPlz] = useState('')
  const [stadt, setStadt] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [makler, setMakler] = useState<Makler[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [maklerWithCoords, setMaklerWithCoords] = useState<MaklerWithCoords[]>([])
  const [loading, setLoading] = useState(false)
  const [mapLoading, setMapLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [showMap, setShowMap] = useState(true)

  const fetchMakler = useCallback(
    async (pageNum = 1, plzParam?: string, stadtParam?: string, statusParam?: string) => {
      setLoading(true)
      const params = new URLSearchParams()
      params.set('page', String(pageNum))
      if (plzParam?.trim()) params.set('plz', plzParam.trim())
      if (stadtParam?.trim()) params.set('stadt', stadtParam.trim())
      if (statusParam) params.set('status', statusParam)
      try {
        const res = await fetch(`/api/makler?${params.toString()}`)
        const data = await res.json()
        const list = Array.isArray(data.makler) ? data.makler : []
        setMakler(list)
        setTotal(data.total ?? list.length)
        setTotalPages(data.totalPages ?? 1)
        setMaklerWithCoords([])

        if (list.length > 0 && list.length <= MAP_MAX_RESULTS) {
          setMapLoading(true)
          const uniqueLocations = Array.from(
            new Map(list.map((m: Makler) => [`${m.plz}|${m.city}`, { plz: m.plz, city: m.city }])).values()
          ) as { plz: string; city?: string }[]
          const BATCH_SIZE = 50
          const batches: { plz: string; city?: string }[][] = []
          for (let i = 0; i < uniqueLocations.length; i += BATCH_SIZE) {
            batches.push(uniqueLocations.slice(i, i + BATCH_SIZE))
          }
          Promise.all(
            batches.map((batch) =>
              fetch('/api/geocode-batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ locations: batch }),
              }).then((r) => r.json())
            )
          )
            .then((responses) => {
              const allResults = responses.flatMap((geoData) => geoData.results ?? [])
              const coordsCache = new Map<string, { lat: number; lng: number }>()
              allResults.forEach((r: { plz: string; city?: string; lat: number; lng: number } | null) => {
                if (r) coordsCache.set(`${r.plz}|${r.city ?? ''}`, { lat: r.lat, lng: r.lng })
              })
              const withCoords: MaklerWithCoords[] = list
                .map((m: Makler) => {
                  const coords = coordsCache.get(`${m.plz}|${m.city}`)
                  return coords ? { ...m, lat: coords.lat, lng: coords.lng } : null
                })
                .filter((m: MaklerWithCoords | null): m is MaklerWithCoords => m !== null)
              setMaklerWithCoords(withCoords)
            })
            .finally(() => setMapLoading(false))
        } else {
          setMapLoading(false)
        }
      } catch {
        setMakler([])
        setTotal(0)
        setTotalPages(0)
        setMaklerWithCoords([])
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    fetchMakler(1)
  }, [fetchMakler])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setSearched(true)
    setPage(1)
    fetchMakler(1, plz, stadt, statusFilter || undefined)
  }

  function handleClear() {
    setPlz('')
    setStadt('')
    setStatusFilter('')
    setPage(1)
    setSearched(false)
    fetchMakler(1)
  }

  function handlePageChange(newPage: number) {
    setPage(newPage)
    fetchMakler(newPage, plz || undefined, stadt || undefined, statusFilter || undefined)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleStatusChange(id: string) {
    setStatusFilter(id)
    setPage(1)
    setSearched(true)
    fetchMakler(1, plz || undefined, stadt || undefined, id || undefined)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Makler in Ihrer Nähe
          </h1>
          <p className="mt-1 text-slate-600">
            Suchen Sie nach PLZ oder Stadt – qualifizierte Makler für Ihren Immobilienverkauf
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-4 sm:flex sm:flex-1 sm:gap-4 sm:space-y-0">
              <div className="min-w-0 flex-1">
                <label htmlFor="stadt" className="sr-only">
                  Stadt
                </label>
                <input
                  id="stadt"
                  type="text"
                  value={stadt}
                  onChange={(e) => setStadt(e.target.value)}
                  placeholder="Stadt (z.B. München)"
                  className="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div className="min-w-0 flex-1">
                <label htmlFor="plz" className="sr-only">
                  Postleitzahl
                </label>
                <input
                  id="plz"
                  type="text"
                  value={plz}
                  onChange={(e) => setPlz(e.target.value)}
                  placeholder="PLZ (z.B. 80331)"
                  maxLength={5}
                  className="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-50 sm:flex-none sm:px-6"
              >
                {loading ? 'Suche...' : 'Suchen'}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Zurücksetzen
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
                <p className="text-sm text-slate-600">Makler werden geladen...</p>
              </div>
            </div>
          ) : makler.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-slate-600">
                {searched
                  ? 'Keine Makler gefunden. Probieren Sie andere Suchkriterien.'
                  : 'Noch keine Makler in der Datenbank.'}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.id || 'all'}
                      type="button"
                      onClick={() => handleStatusChange(opt.id)}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                        statusFilter === opt.id
                          ? 'bg-teal-600 text-white'
                          : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-teal-300 hover:text-teal-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">{total.toLocaleString('de-DE')}</span>{' '}
                  {total === 1 ? 'Makler' : 'Makler'}
                  {searched ? ' gefunden' : ' im Verzeichnis'}
                </p>
              </div>

              {(mapLoading || maklerWithCoords.length > 0) && makler.length <= MAP_MAX_RESULTS && (
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={() => setShowMap((s) => !s)}
                    className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-teal-600"
                  >
                    {showMap ? (
                      <>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        Karte ausblenden
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        Karte anzeigen
                      </>
                    )}
                  </button>
                  {showMap && (
                    <>
                      {mapLoading ? (
                        <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                          <p className="text-sm text-slate-500">Karte wird geladen...</p>
                        </div>
                      ) : (
                        <MaklerMap makler={maklerWithCoords} />
                      )}
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                        <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-amber-400" /> Premium</span>
                        <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-teal-500" /> Partner / Starter</span>
                        <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-slate-400" /> Standard</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {makler.length > MAP_MAX_RESULTS && (
                <p className="mb-4 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800">
                  Karte wird bei mehr als {MAP_MAX_RESULTS} Ergebnissen nicht angezeigt. Verfeinern Sie Ihre Suche.
                </p>
              )}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {makler.map((m) => (
                  <Link
                    key={m.id}
                    href={`/makler/${m.id}`}
                    className="group flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                  >
                    <MaklerLogo
                      logoUrl={m.logoUrl}
                      alt={m.firmenname || m.name}
                      shape="rounded"
                      size="sm"
                      className="shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-900 group-hover:text-teal-700">
                        {m.firmenname || m.name}
                      </h3>
                      <p className="mt-0.5 text-sm text-slate-600">
                        {m.plz} {m.city}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {m.status !== 'standard' && m.status !== 'pending' && (
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ABO_STUFEN[m.status as keyof typeof ABO_STUFEN]?.badgeColor ?? 'bg-slate-100 text-slate-700'}`}>
                            {getAboLabel(m.status)}
                          </span>
                        )}
                        {(() => {
                          try {
                            const ids = m.taetigkeitsbereiche ? JSON.parse(m.taetigkeitsbereiche) : []
                            const labels = (Array.isArray(ids) ? ids : [])
                              .slice(0, 2)
                              .map((id: string) => TAETIGKEITSBEREICHE.find((t) => t.id === id)?.label)
                              .filter(Boolean)
                            return labels.length > 0 ? (
                              labels.map((l) => (
                                <span key={l} className="text-xs text-slate-500">
                                  {l}
                                </span>
                              ))
                            ) : null
                          } catch {
                            return null
                          }
                        })()}
                      </div>
                    </div>
                    <svg
                      className="h-5 w-5 shrink-0 text-slate-300 group-hover:text-teal-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
                  <button
                    type="button"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    Zurück
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let p: number
                      if (totalPages <= 5) p = i + 1
                      else if (page <= 3) p = i + 1
                      else if (page >= totalPages - 2) p = totalPages - 4 + i
                      else p = page - 2 + i
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handlePageChange(p)}
                          className={`min-w-[2.25rem] rounded-lg px-3 py-2 text-sm font-medium ${
                            p === page
                              ? 'bg-teal-600 text-white'
                              : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    Weiter
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
