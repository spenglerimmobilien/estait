'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import LeadAssignForm from '@/components/LeadAssignForm'
import { LeadDeleteButton } from '@/components/LeadDeleteButton'
import { LeadStatusSelect } from '@/components/LeadStatusSelect'

const MAKLER_STATUS_LABELS: Record<string, string> = {
  offen: 'Offen',
  kontaktiert: 'Kontaktiert',
  absage: 'Absage',
  zusage: 'Zusage',
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  wohnung: 'Wohnung',
  einfamilienhaus: 'Einfamilienhaus',
  mehrfamilienhaus: 'Mehrfamilienhaus',
  grundstueck: 'Grundstück',
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

type Filter = 'alle' | 'nicht_verteilt' | 'verteilt'

interface Assignment {
  id: string
  maklerId: string
  maklerStatus: string | null
  makler: { id: string; name: string; firmenname?: string }
}

interface LeadData {
  id: string
  name: string
  email: string
  phone: string | null
  plz: string
  createdAt: string
  propertyData: Record<string, unknown> | null
  assignments: Assignment[]
}

interface AdminLeadsListProps {
  leads: LeadData[]
  role: string
  userId?: string
}

export function AdminLeadsList({ leads, role, userId }: AdminLeadsListProps) {
  const [filter, setFilter] = useState<Filter>('alle')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const filteredLeads = useMemo(() => {
    if (filter === 'alle') return leads
    if (filter === 'nicht_verteilt') {
      return leads.filter((l) => (l.assignments?.length ?? 0) === 0)
    }
    return leads.filter((l) => (l.assignments?.length ?? 0) > 0)
  }, [leads, filter])

  const counts = useMemo(() => {
    const verteilt = leads.filter((l) => (l.assignments?.length ?? 0) > 0).length
    const nichtVerteilt = leads.filter((l) => (l.assignments?.length ?? 0) === 0).length
    return { verteilt, nichtVerteilt, alle: leads.length }
  }, [leads])

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          <p className="mt-1 text-slate-600">
            {leads.length} Lead{leads.length !== 1 ? 's' : ''} · {counts.nichtVerteilt} nicht verteilt · {counts.verteilt} verteilt
          </p>
        </div>

        <div className="flex rounded-lg border border-slate-200 bg-slate-50/50 p-1">
          <button
            type="button"
            onClick={() => setFilter('alle')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              filter === 'alle'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Alle ({counts.alle})
          </button>
          <button
            type="button"
            onClick={() => setFilter('nicht_verteilt')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              filter === 'nicht_verteilt'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Nicht verteilt ({counts.nichtVerteilt})
          </button>
          <button
            type="button"
            onClick={() => setFilter('verteilt')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              filter === 'verteilt'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Verteilt ({counts.verteilt})
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {filteredLeads.map((lead) => {
          const isExpanded = expandedIds.has(lead.id)
          const isAssigned = (lead.assignments?.length ?? 0) > 0
          const propertyData = lead.propertyData

          return (
            <div
              key={lead.id}
              className={`overflow-hidden rounded-xl border transition ${
                isAssigned
                  ? 'border-teal-200 bg-white'
                  : 'border-amber-200/80 bg-amber-50/30'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleExpand(lead.id)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-slate-50/50"
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-medium ${
                    isAssigned ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {(lead.assignments?.length ?? 0) > 0 ? '✓' : '!'}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 truncate">{lead.name}</p>
                  <p className="mt-0.5 text-sm text-slate-600 truncate">
                    {lead.email} · PLZ {lead.plz}
                    {propertyData?.propertyType != null
                      ? ` · ${PROPERTY_TYPE_LABELS[String(propertyData.propertyType)] ?? String(propertyData.propertyType)}`
                      : ''}
                    {propertyData?.flaeche != null ? ` · ${String(propertyData.flaeche)} m²` : ''}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      isAssigned ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isAssigned
                      ? `${lead.assignments!.length} Makler zugewiesen`
                      : 'Nicht verteilt'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(lead.createdAt).toLocaleDateString('de-DE')}
                  </span>
                  <svg
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-slate-200 bg-white px-5 py-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold text-slate-900">{lead.name}</h3>
                    {role === 'admin' && (
                      <LeadDeleteButton leadId={lead.id} leadName={lead.name} />
                    )}
                  </div>
                  <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <div>
                      <h4 className="mb-4 text-sm font-semibold text-slate-700">
                        Eigentümer / Kontakt
                      </h4>
                      <dl className="space-y-2 text-sm">
                        <div>
                          <dt className="text-slate-500">Name</dt>
                          <dd className="font-medium text-slate-900">{lead.name}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">E-Mail</dt>
                          <dd>
                            <a href={`mailto:${lead.email}`} className="text-teal-600 hover:underline">
                              {lead.email}
                            </a>
                          </dd>
                        </div>
                        {lead.phone && (
                          <div>
                            <dt className="text-slate-500">Telefon</dt>
                            <dd>
                              <a href={`tel:${lead.phone}`} className="text-teal-600 hover:underline">
                                {lead.phone}
                              </a>
                            </dd>
                          </div>
                        )}
                        <div>
                          <dt className="text-slate-500">PLZ</dt>
                          <dd>{lead.plz}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">Eingegangen</dt>
                          <dd>{new Date(lead.createdAt).toLocaleString('de-DE')}</dd>
                        </div>
                        {(lead.assignments?.length ?? 0) > 0 && (
                          <div>
                            <dt className="text-slate-500">
                              Zugewiesene Makler ({lead.assignments!.length}/3)
                            </dt>
                            <dd className="mt-1 space-y-2">
                              {lead.assignments!.map((a) => (
                                <div key={a.id} className="flex flex-wrap items-center gap-2">
                                  <Link
                                    href={`/admin/makler/${a.makler.id}`}
                                    className="font-medium text-teal-600 hover:underline"
                                  >
                                    {a.makler.firmenname || a.makler.name}
                                  </Link>
                                  {a.maklerStatus && (
                                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                                      {MAKLER_STATUS_LABELS[a.maklerStatus] ?? a.maklerStatus}
                                    </span>
                                  )}
                                  {role === 'makler' && a.maklerId === userId && (
                                    <LeadStatusSelect
                                      assignmentId={a.id}
                                      currentStatus={a.maklerStatus}
                                    />
                                  )}
                                </div>
                              ))}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>

                    <div>
                      <h4 className="mb-4 text-sm font-semibold text-slate-700">
                        Immobiliendaten
                      </h4>
                      {propertyData ? (
                        <dl className="space-y-2 text-sm">
                          {propertyData.propertyType ? (
                            <div>
                              <dt className="text-slate-500">Objektart</dt>
                              <dd>
                                {PROPERTY_TYPE_LABELS[String(propertyData.propertyType)] ||
                                  String(propertyData.propertyType)}
                              </dd>
                            </div>
                          ) : null}
                          {propertyData.flaeche != null ? (
                            <div>
                              <dt className="text-slate-500">Fläche</dt>
                              <dd>{String(propertyData.flaeche)} m²</dd>
                            </div>
                          ) : null}
                          {propertyData.baujahr ? (
                            <div>
                              <dt className="text-slate-500">Baujahr</dt>
                              <dd>{String(propertyData.baujahr)}</dd>
                            </div>
                          ) : null}
                          {propertyData.horizont ? (
                            <div>
                              <dt className="text-slate-500">Zeitlicher Horizont</dt>
                              <dd>{String(propertyData.horizont)}</dd>
                            </div>
                          ) : null}
                          {propertyData.plz ? (
                            <div>
                              <dt className="text-slate-500">PLZ Immobilie</dt>
                              <dd>{String(propertyData.plz)}</dd>
                            </div>
                          ) : null}
                          {propertyData.region ? (
                            <div>
                              <dt className="text-slate-500">Region</dt>
                              <dd>{String(propertyData.region)}</dd>
                            </div>
                          ) : null}
                          {(propertyData.min != null || propertyData.max != null) ? (
                            <div className="mt-3 rounded-lg bg-teal-50 p-3">
                              <dt className="text-slate-500">Errechneter Wert</dt>
                              <dd className="mt-1 text-lg font-bold text-teal-700">
                                {propertyData.min != null && propertyData.max != null
                                  ? `${formatCurrency(Number(propertyData.min))} – ${formatCurrency(Number(propertyData.max))}`
                                  : propertyData.min != null
                                    ? formatCurrency(Number(propertyData.min))
                                    : propertyData.max != null
                                      ? formatCurrency(Number(propertyData.max))
                                      : '–'}
                              </dd>
                            </div>
                          ) : null}
                        </dl>
                      ) : (
                        <p className="text-sm text-slate-500">
                          Keine Immobiliendaten vorhanden.
                        </p>
                      )}
                    </div>
                  </div>

                  {role === 'admin' && (
                    <LeadAssignForm
                      leadId={lead.id}
                      assignedMaklerIds={lead.assignments?.map((a) => a.maklerId) ?? []}
                      leadPlz={
                        (propertyData?.plz != null ? String(propertyData.plz) : null) ?? lead.plz
                      }
                    />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filteredLeads.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
          <p className="text-slate-500">
            {filter === 'alle'
              ? 'Noch keine Leads vorhanden.'
              : filter === 'nicht_verteilt'
                ? 'Keine nicht verteilten Leads.'
                : 'Keine verteilten Leads.'}
          </p>
        </div>
      )}
    </div>
  )
}
