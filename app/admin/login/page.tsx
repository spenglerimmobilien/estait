'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role] = useState<'admin' | 'makler'>('admin')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let res = await signIn('credentials', {
        email,
        password,
        role: 'admin',
        redirect: false,
      })
      if (res?.error) {
        res = await signIn('credentials', {
          email,
          password,
          role: 'makler',
          redirect: false,
        })
      }
      if (res?.error) {
        setError('Ungültige Anmeldedaten.')
        setLoading(false)
        return
      }
      router.push(callbackUrl)
      router.refresh()
    } catch {
      setError('Ein Fehler ist aufgetreten.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Anmelden</h1>
        <p className="mt-2 text-sm text-slate-600">
          Makler-Dashboard
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-3"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-teal-600 py-3 font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {loading ? 'Anmelden...' : 'Anmelden'}
          </button>
        </form>
        <div className="mt-8 rounded-xl border-2 border-teal-100 bg-teal-50/50 p-6">
          <h3 className="text-base font-semibold text-slate-900">Noch kein Konto?</h3>
          <p className="mt-1 text-sm text-slate-600">
            Registrieren Sie sich kostenlos und werden Sie Teil des ESTAIT-Makler-Verzeichnisses.
          </p>
          <Link
            href="/makler-registrieren"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-teal-600 bg-white py-2.5 text-sm font-semibold text-teal-600 transition hover:bg-teal-50"
          >
            Jetzt registrieren
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center">Laden...</div>}>
      <LoginForm />
    </Suspense>
  )
}
