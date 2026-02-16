'use client'

import { useState } from 'react'

export function PasswortAendernForm() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (newPassword.length < 8) {
      setError('Das neue Passwort muss mindestens 8 Zeichen haben.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/makler/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Passwort konnte nicht geändert werden.')
        setLoading(false)
        return
      }

      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      setError('Ein Fehler ist aufgetreten.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-4">
      <div>
        <label htmlFor="current" className="block text-sm font-medium text-slate-700">
          Aktuelles Passwort *
        </label>
        <input
          id="current"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
        />
      </div>
      <div>
        <label htmlFor="new" className="block text-sm font-medium text-slate-700">
          Neues Passwort * (min. 8 Zeichen)
        </label>
        <input
          id="new"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
        />
      </div>
      <div>
        <label htmlFor="confirm" className="block text-sm font-medium text-slate-700">
          Neues Passwort bestätigen *
        </label>
        <input
          id="confirm"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
        />
      </div>
      {success && (
        <p className="rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm font-medium text-teal-800">
          ✓ Passwort wurde geändert.
        </p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-teal-600 px-6 py-2 font-medium text-white hover:bg-teal-700 disabled:opacity-50"
      >
        {loading ? 'Wird gespeichert...' : 'Passwort ändern'}
      </button>
    </form>
  )
}
