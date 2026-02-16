'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { LeadForm } from '@/components/LeadForm'

function BeratungContent() {
  const searchParams = useSearchParams()
  const maklerId = searchParams.get('makler') || undefined
  const plz = searchParams.get('plz') || undefined
  let propertyData: Record<string, unknown> | undefined
  try {
    const pd = searchParams.get('propertyData')
    if (pd) propertyData = JSON.parse(decodeURIComponent(pd))
  } catch {
    // ignore
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">Kostenlose Makler-Beratung</h1>
      <p className="mt-2 text-slate-600">
        Füllen Sie das Formular aus. Ein qualifizierter Makler wird sich zeitnah bei Ihnen melden.
      </p>
      <div className="mt-10 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <LeadForm maklerId={maklerId} plz={plz} propertyData={propertyData} />
      </div>
    </div>
  )
}

export default function BeratungPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-xl px-4 py-16">Laden...</div>}>
      <BeratungContent />
    </Suspense>
  )
}
