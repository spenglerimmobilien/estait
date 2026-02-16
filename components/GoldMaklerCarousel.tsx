'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const ITEMS_PER_PAGE = 3

interface Makler {
  id: string
  name: string
  plz: string
  city: string
  logoUrl: string | null
}

export function GoldMaklerCarousel() {
  const [makler, setMakler] = useState<Makler[]>([])
  const [pageIndex, setPageIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)

  useEffect(() => {
    fetch('/api/makler/gold')
      .then((res) => res.json())
      .then((data) => setMakler(Array.isArray(data) ? data : []))
  }, [])

  const totalPages = Math.ceil(makler.length / ITEMS_PER_PAGE)
  const displayItems = [...makler, ...makler.slice(0, Math.min(ITEMS_PER_PAGE, makler.length))]
  const hasLoopPage = totalPages > 1

  const goNext = useCallback(() => {
    if (!hasLoopPage) return
    if (pageIndex === totalPages - 1) {
      setPageIndex(totalPages)
    } else {
      setPageIndex((i) => (i + 1) % totalPages)
    }
  }, [pageIndex, totalPages, hasLoopPage])

  const goPrev = useCallback(() => {
    if (!hasLoopPage) return
    setPageIndex((i) => (i === 0 || i === totalPages ? totalPages - 1 : i - 1))
  }, [totalPages, hasLoopPage])

  const handleTransitionEnd = useCallback(() => {
    if (pageIndex === totalPages) {
      setIsTransitioning(false)
      setPageIndex(0)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsTransitioning(true))
      })
    }
  }, [pageIndex, totalPages])

  useEffect(() => {
    if (!hasLoopPage) return
    const id = setInterval(goNext, 5000)
    return () => clearInterval(id)
  }, [goNext, hasLoopPage])

  if (makler.length === 0) return null

  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800">
            <span>★</span> Premium-Partner
          </span>
          <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
            Unsere Premium-Makler
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Höchste Qualitätsstufe – zertifizierte Partner für Ihren Immobilienverkauf
          </p>
        </div>

        <div className="mt-10 w-full min-w-0 overflow-hidden">
          <div
            className="flex"
            style={{
              transform: `translateX(-${pageIndex * 100}%)`,
              transition: isTransitioning ? 'transform 500ms ease-out' : 'none',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {displayItems.map((m, idx) => (
              <Link
                key={`${m.id}-${idx}`}
                href={`/makler/${m.id}`}
                className="group flex shrink-0 basis-1/3 items-center justify-center px-2 sm:px-3"
              >
                <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 group-hover:border-teal-200 group-hover:shadow-lg group-hover:shadow-teal-500/5 sm:p-8">
                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
                    <div className={`flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 p-2 sm:h-28 sm:w-28 sm:p-3 ${m.logoUrl ? 'bg-white' : 'bg-slate-100'}`}>
                      {m.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={m.logoUrl}
                          alt={(m as { firmenname?: string }).firmenname || m.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-xl font-semibold tracking-tight text-slate-500 sm:text-2xl">
                          {((m as { firmenname?: string }).firmenname || m.name)
                            .split(/\s+/)
                            .map((w) => w[0])
                            .filter(Boolean)
                            .slice(0, 2)
                            .join('')
                            .toUpperCase() || 'IM'}
                        </span>
                      )}
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="font-semibold text-slate-900 sm:text-lg">
                        {(m as { firmenname?: string }).firmenname || m.name}
                      </p>
                      <p className="mt-0.5 text-sm text-slate-600 sm:mt-1">
                        {m.plz} {m.city}
                      </p>
                      <span className="mt-2 inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 sm:mt-3">
                        Premium-Partner
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={goPrev}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                aria-label="Vorheriger"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPageIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === (pageIndex === totalPages ? 0 : pageIndex) ? 'w-8 bg-teal-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                    aria-label={`Seite ${i + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={goNext}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                aria-label="Nächster"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/makler"
              className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              Alle Makler anzeigen
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
