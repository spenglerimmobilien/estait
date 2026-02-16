'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export function AdminMaklerCreateForm({
  onCancel,
}: {
  onCancel: () => void
}) {
  const router = useRouter()
  const [firmenname, setFirmenname] = useState('')
  const [ansprechpartner, setAnsprechpartner] = useState('')
  const [plz, setPlz] = useState('')
  const [city, setCity] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [createdMakler, setCreatedMakler] = useState<{ email: string; firmenname: string } | null>(null)
  const [autoLogin, setAutoLogin] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/makler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firmenname,
          ansprechpartner: ansprechpartner.trim() || undefined,
          plz,
          city,
          email,
          password,
          address: address || undefined,
          phone: phone || undefined,
          website: website || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Fehler beim Anlegen.')
        setLoading(false)
        return
      }
      setCreatedMakler({ email: data.makler.email, firmenname: data.makler.firmenname })
      setSuccess(true)
      setLoading(false)

      if (autoLogin) {
        const signInRes = await signIn('credentials', {
          email: data.makler.email,
          password,
          role: 'makler',
          redirect: false,
        })
        if (!signInRes?.error) {
          router.push('/admin')
          router.refresh()
          return
        }
      }
      router.refresh()
    } catch {
      setError('Ein Fehler ist aufgetreten.')
      setLoading(false)
    }
  }

  if (success && !autoLogin) {
    return (
      <div className="mt-8 max-w-md rounded-xl border border-teal-200 bg-teal-50 p-6">
        <p className="text-lg font-semibold text-teal-800">✓ Makler erfolgreich angelegt</p>
        <p className="mt-2 text-teal-700">
          {createdMakler?.firmenname} kann sich jetzt unter{' '}
          <Link href="/anmelden" className="font-medium text-teal-600 underline hover:text-teal-700">
            Anmelden
          </Link>{' '}
          mit der E-Mail <strong>{createdMakler?.email}</strong> anmelden.
        </p>
        <button
          type="button"
          onClick={() => {
            setSuccess(false)
            setCreatedMakler(null)
            setFirmenname('')
            setAnsprechpartner('')
            setPlz('')
            setCity('')
            setEmail('')
            setPassword('')
            setAddress('')
            setPhone('')
            setWebsite('')
          }}
          className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          Weiteren Makler anlegen
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">Firmenname *</label>
        <input
          type="text"
          value={firmenname}
          onChange={(e) => setFirmenname(e.target.value)}
          required
          placeholder="z.B. Immobilien Schmidt"
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Ansprechpartner</label>
        <input
          type="text"
          value={ansprechpartner}
          onChange={(e) => setAnsprechpartner(e.target.value)}
          placeholder="z.B. Max Mustermann (optional)"
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">PLZ *</label>
          <input
            type="text"
            value={plz}
            onChange={(e) => setPlz(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Stadt *</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">E-Mail *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Passwort * (min. 6 Zeichen)</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Adresse</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Telefon</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Website</label>
        <input
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="autoLogin"
          checked={autoLogin}
          onChange={(e) => setAutoLogin(e.target.checked)}
          className="rounded border-slate-300"
        />
        <label htmlFor="autoLogin" className="text-sm text-slate-700">
          Nach Anlage direkt als Makler anmelden und zum Dashboard weiterleiten
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-700 disabled:opacity-50"
        >
          {loading ? 'Wird angelegt...' : 'Makler anlegen'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
        >
          Abbrechen
        </button>
      </div>
    </form>
  )
}
