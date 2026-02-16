'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegistrierenPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/registrieren', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Registrierung fehlgeschlagen.')
        setLoading(false)
        return
      }
      router.push('/anmelden?registered=1')
      router.refresh()
    } catch {
      setError('Ein Fehler ist aufgetreten.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Registrieren</h1>
        <p className="mt-2 text-sm text-slate-600">
          Erstellen Sie ein Konto als Immobilieneigentümer
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-3"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              E-Mail
            </label>
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
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Passwort
            </label>
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
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-teal-600 py-3 font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {loading ? 'Registrierung...' : 'Registrieren'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Bereits ein Konto?{' '}
          <Link href="/anmelden" className="font-medium text-teal-600 hover:text-teal-700">
            Anmelden
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-slate-500">
          Immobilienmakler?{' '}
          <Link href="/makler-registrieren" className="text-teal-600 hover:underline">
            Makler-Registrierung
          </Link>
        </p>
      </div>
    </div>
  )
}
