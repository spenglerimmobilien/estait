'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface LeadFormProps {
  maklerId?: string
  plz?: string
  propertyData?: Record<string, unknown>
}

export function LeadForm({ maklerId, plz: initialPlz, propertyData }: LeadFormProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [plz, setPlz] = useState(initialPlz || '')
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const resolvedMaklerId = maklerId

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          plz,
          propertyData,
          maklerId: resolvedMaklerId,
          consent,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ein Fehler ist aufgetreten.')
        setLoading(false)
        return
      }

      router.push('/danke')
    } catch {
      setError('Verbindungsfehler. Bitte versuchen Sie es erneut.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="lead-name" className="block text-sm font-medium text-slate-700">
          Name *
        </label>
        <input
          id="lead-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-3 shadow-sm focus:border-teal-500 focus:ring-teal-500"
        />
      </div>
      <div>
        <label htmlFor="lead-email" className="block text-sm font-medium text-slate-700">
          E-Mail *
        </label>
        <input
          id="lead-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-3 shadow-sm focus:border-teal-500 focus:ring-teal-500"
        />
      </div>
      <div>
        <label htmlFor="lead-phone" className="block text-sm font-medium text-slate-700">
          Telefon (optional)
        </label>
        <input
          id="lead-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-3 shadow-sm focus:border-teal-500 focus:ring-teal-500"
        />
      </div>
      <div>
        <label htmlFor="lead-plz" className="block text-sm font-medium text-slate-700">
          Postleitzahl *
        </label>
        <input
          id="lead-plz"
          type="text"
          value={plz}
          onChange={(e) => setPlz(e.target.value)}
          maxLength={5}
          required
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-3 shadow-sm focus:border-teal-500 focus:ring-teal-500"
        />
      </div>
      <div>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
            className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          <span className="text-sm text-slate-600">
            Ich stimme zu, dass meine Daten an qualifizierte Immobilienmakler zur Kontaktaufnahme weitergegeben werden. Die Verarbeitung erfolgt gemäß unserer Datenschutzerklärung.
          </span>
        </label>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-teal-600 px-6 py-4 font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
      >
        {loading ? 'Wird gesendet...' : 'Beratung anfragen'}
      </button>
    </form>
  )
}
