'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ABO_STUFEN } from '@/lib/abo-stufen'

const REGISTRATION_PLANS = [
  { id: 'standard', label: 'Standard', price: 'Kostenlos', desc: 'Basis-Eintrag im Verzeichnis' },
  { id: 'starter', label: 'Starter', price: '39 €/Monat', desc: 'Branding, Partner-Map, Premium-Badge' },
  { id: 'partner', label: 'Partner', price: '99 €/Monat', desc: 'Bestseller: Gebietsschutz, Leads' },
  { id: 'premium', label: 'Premium', price: '199 €/Monat', desc: 'Full-Service, Gold-Badge' },
] as const

const VALID_PLANS = ['standard', 'starter', 'partner', 'premium'] as const

function MaklerRegistrierenForm() {
  const searchParams = useSearchParams()
  const planParam = searchParams.get('plan')?.toLowerCase()
  const initialPlan: string =
    planParam === 'kostenlos'
      ? 'standard'
      : planParam && VALID_PLANS.includes(planParam as (typeof VALID_PLANS)[number])
        ? planParam
        : 'standard'

  const [name, setName] = useState('')
  const [plz, setPlz] = useState('')
  const [city, setCity] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [plan, setPlan] = useState<string>(initialPlan)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setPlan(initialPlan)
  }, [initialPlan])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/makler-registrieren', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          plz,
          city,
          email,
          password,
          plan: plan || 'standard',
          address: address || undefined,
          phone: phone || undefined,
          website: website || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Registrierung fehlgeschlagen.')
        setLoading(false)
        return
      }
      setSuccess(true)
      setLoading(false)
    } catch {
      setError('Ein Fehler ist aufgetreten.')
      setLoading(false)
    }
  }

  if (success) {
    const isPaidPlan = plan !== 'standard'
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border-2 border-teal-200 bg-teal-50/80 p-8 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-2xl text-white">✓</span>
            <div>
              <h1 className="text-xl font-bold text-teal-900">Registrierung erfolgreich</h1>
              <p className="mt-1 text-sm text-teal-700">
                Ihr Makler-Konto wurde angelegt.
              </p>
            </div>
          </div>
          {isPaidPlan ? (
            <p className="mt-4 text-teal-700">
              Sie haben sich für <strong>{ABO_STUFEN[plan as keyof typeof ABO_STUFEN]?.label ?? plan}</strong> angemeldet.
              Wir kontaktieren Sie in Kürze zur Zahlungsabwicklung und Aktivierung Ihres Pakets.
            </p>
          ) : (
            <p className="mt-4 text-teal-700">
              Sie können sich jetzt anmelden und Ihr Dashboard nutzen.
            </p>
          )}
          <Link
            href="/anmelden?registered=1"
            className="mt-6 block w-full rounded-lg bg-teal-600 py-3 text-center font-semibold text-white transition hover:bg-teal-700"
          >
            Jetzt anmelden
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-8 rounded-xl border-2 border-teal-200 bg-teal-50/70 px-5 py-4">
          <h1 className="text-xl font-bold text-slate-900">Makler registrieren</h1>
          <p className="mt-1 text-sm text-slate-600">
            Erstellen Sie Ihr Konto und wählen Sie Ihr Paket – Standard ist kostenlos.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Paket wählen *</label>
            <div className="grid gap-3 sm:grid-cols-2">
              {REGISTRATION_PLANS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlan(p.id)}
                  className={`flex flex-col items-start rounded-xl border-2 p-4 text-left transition ${
                    plan === p.id
                      ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-200'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="font-semibold text-slate-900">{p.label}</span>
                  <span className="mt-0.5 text-sm font-medium text-teal-600">{p.price}</span>
                  <span className="mt-1 text-xs text-slate-600">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name / Firma *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-3"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="plz" className="block text-sm font-medium text-slate-700">PLZ *</label>
              <input
                id="plz"
                type="text"
                value={plz}
                onChange={(e) => setPlz(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-3"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-slate-700">Stadt *</label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-3"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">E-Mail *</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-3"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Passwort *</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-3"
            />
            <p className="mt-1 text-xs text-slate-500">Mindestens 6 Zeichen</p>
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-slate-700">Adresse</label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-3"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Telefon</label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-3"
            />
          </div>
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-slate-700">Website</label>
            <input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-3"
            />
          </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-teal-600 py-3 font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {loading ? 'Registrierung...' : plan === 'standard' ? 'Kostenlos registrieren' : 'Registrieren & Paket beantragen'}
          </button>
        </form>
        <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50/50 p-4 text-center">
          <p className="text-sm text-slate-600">Bereits ein Konto?</p>
          <Link
            href="/anmelden"
            className="mt-2 inline-block rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-300"
          >
            Anmelden
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function MaklerRegistrierenPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center">Laden...</div>}>
      <MaklerRegistrierenForm />
    </Suspense>
  )
}
