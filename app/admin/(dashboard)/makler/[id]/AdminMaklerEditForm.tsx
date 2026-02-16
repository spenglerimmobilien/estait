'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MaklerDeleteButton } from '@/components/MaklerDeleteButton'
import { TAETIGKEITSBEREICHE, LEISTUNGEN } from '@/lib/makler-options'

function parseJsonArray(val: string | null | undefined): string[] {
  if (!val) return []
  try {
    const arr = JSON.parse(val)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

interface Makler {
  id: string
  name: string
  firmenname: string
  ansprechpartner: string | null
  plz: string
  city: string
  address: string | null
  email: string | null
  phone: string | null
  website: string | null
  facebookUrl: string | null
  instagramUrl: string | null
  linkedinUrl: string | null
  twitterUrl: string | null
  youtubeUrl: string | null
  googleBusinessUrl: string | null
  taetigkeitsbereiche: string | null
  leistungen: string | null
  ueberUnserBuero: string | null
  status: string
  logoUrl: string | null
  passwordHash: string | null
}

export function AdminMaklerEditForm({ makler }: { makler: Makler }) {
  const router = useRouter()
  const [firmenname, setFirmenname] = useState(makler.firmenname || makler.name)
  const [ansprechpartner, setAnsprechpartner] = useState(makler.ansprechpartner || '')
  const [plz, setPlz] = useState(makler.plz)
  const [city, setCity] = useState(makler.city)
  const [address, setAddress] = useState(makler.address || '')
  const [email, setEmail] = useState(makler.email || '')
  const [phone, setPhone] = useState(makler.phone || '')
  const [website, setWebsite] = useState(makler.website || '')
  const [facebookUrl, setFacebookUrl] = useState(makler.facebookUrl || '')
  const [instagramUrl, setInstagramUrl] = useState(makler.instagramUrl || '')
  const [linkedinUrl, setLinkedinUrl] = useState(makler.linkedinUrl || '')
  const [twitterUrl, setTwitterUrl] = useState(makler.twitterUrl || '')
  const [youtubeUrl, setYoutubeUrl] = useState(makler.youtubeUrl || '')
  const [googleBusinessUrl, setGoogleBusinessUrl] = useState(makler.googleBusinessUrl || '')
  const [taetigkeitsbereiche, setTaetigkeitsbereiche] = useState<string[]>(
    () => parseJsonArray(makler.taetigkeitsbereiche)
  )
  const [leistungen, setLeistungen] = useState<string[]>(() => parseJsonArray(makler.leistungen))
  const [ueberUnserBuero, setUeberUnserBuero] = useState(makler.ueberUnserBuero || '')
  const [status, setStatus] = useState(makler.status)
  const [password, setPassword] = useState('')
  const [showPasswordField, setShowPasswordField] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(makler.logoUrl)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const needsPassword = !makler.passwordHash

  function processLogoFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Bitte wählen Sie eine Bilddatei (JPG, PNG, WebP).')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Die Datei darf maximal 2 MB groß sein.')
      return
    }
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
    setError('')
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processLogoFile(file)
    e.target.value = ''
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processLogoFile(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)
    try {
      let logoUrl = makler.logoUrl
      if (logoFile) {
        const formData = new FormData()
        formData.append('file', logoFile)
        const uploadRes = await fetch(`/api/admin/makler/${makler.id}/logo`, {
          method: 'POST',
          body: formData,
        })
        const uploadData = await uploadRes.json()
        if (!uploadRes.ok) {
          setError(uploadData.error || 'Logo-Upload fehlgeschlagen.')
          setLoading(false)
          return
        }
        logoUrl = uploadData.url
      }

      const body: Record<string, unknown> = {
        firmenname,
        ansprechpartner: ansprechpartner.trim() || null,
        plz,
        city,
        address: address.trim() || null,
        email: email.trim() || null,
        phone: phone.trim() || null,
        website: website.trim() || null,
        facebookUrl: facebookUrl.trim() || null,
        instagramUrl: instagramUrl.trim() || null,
        linkedinUrl: linkedinUrl.trim() || null,
        twitterUrl: twitterUrl.trim() || null,
        youtubeUrl: youtubeUrl.trim() || null,
        googleBusinessUrl: googleBusinessUrl.trim() || null,
        taetigkeitsbereiche: taetigkeitsbereiche.length > 0 ? taetigkeitsbereiche : null,
        leistungen: leistungen.length > 0 ? leistungen : null,
        ueberUnserBuero: ueberUnserBuero.trim() || null,
        status,
        logoUrl: logoUrl ?? undefined,
      }
      if (password && password.length >= 6) body.password = password

      const res = await fetch(`/api/admin/makler/${makler.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Fehler beim Speichern.')
        setLoading(false)
        return
      }
      setSuccess(true)
      setPassword('')
      setLogoFile(null)
      router.refresh()
    } catch {
      setError('Ein Fehler ist aufgetreten.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-8">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Logo / Foto</h2>
        <p className="mt-1 text-sm text-slate-600">
          Logo oder Profilfoto (JPG, PNG, WebP, max. 2 MB)
        </p>
        <div className="mt-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleLogoChange}
            className="sr-only"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            className={`flex cursor-pointer items-center gap-6 rounded-xl border-2 border-dashed p-6 transition-colors ${
              isDragging
                ? 'border-teal-500 bg-teal-50'
                : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
              {logoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoPreview} alt="Logo" className="h-full w-full object-contain" />
              ) : (
                <svg className="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <div className="min-w-0 flex-1">
              {logoFile ? (
                <p className="font-medium text-slate-700">{logoFile.name}</p>
              ) : logoPreview ? (
                <p className="text-slate-600">Aktuelles Logo. Klicken oder Datei ablegen zum Ersetzen.</p>
              ) : (
                <p className="text-slate-600">
                  <span className="font-medium text-teal-600">Datei hier ablegen</span>
                  <span className="text-slate-500"> oder Klicken zum Auswählen</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Stammdaten</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Firmenname *</label>
            <input
              type="text"
              value={firmenname}
              onChange={(e) => setFirmenname(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Ansprechpartner</label>
            <input
              type="text"
              value={ansprechpartner}
              onChange={(e) => setAnsprechpartner(e.target.value)}
              placeholder="z.B. Max Mustermann"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>
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
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Adresse</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Website</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Social Media & Google</h2>
        <p className="mt-1 text-sm text-slate-600">
          Links zu Ihren Profilen. Google-Business-URL für Bewertungen anzeigen.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Facebook</label>
            <input
              type="url"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder="https://facebook.com/..."
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Instagram</label>
            <input
              type="url"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://instagram.com/..."
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">LinkedIn</label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/..."
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">X (Twitter)</label>
            <input
              type="url"
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              placeholder="https://x.com/..."
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">YouTube</label>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/..."
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Google Business / Bewertungen</label>
            <input
              type="url"
              value={googleBusinessUrl}
              onChange={(e) => setGoogleBusinessUrl(e.target.value)}
              placeholder="https://g.page/... oder Google-Maps-Link"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
            />
            <p className="mt-1 text-xs text-slate-500">
              Link zu Ihrem Google-Business-Profil – Kunden sehen dort Ihre Bewertungen.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Tätigkeitsbereich</h2>
        <p className="mt-1 text-sm text-slate-600">
          In welchen Immobilienbereichen ist der Makler tätig?
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {TAETIGKEITSBEREICHE.map((opt) => (
            <label
              key={opt.id}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm transition hover:bg-slate-50 has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50"
            >
              <input
                type="checkbox"
                checked={taetigkeitsbereiche.includes(opt.id)}
                onChange={(e) => {
                  setTaetigkeitsbereiche((prev) =>
                    e.target.checked ? [...prev, opt.id] : prev.filter((t) => t !== opt.id)
                  )
                }}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Leistungen</h2>
        <p className="mt-1 text-sm text-slate-600">
          Welche Leistungen bietet der Makler an?
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {LEISTUNGEN.map((opt) => (
            <label
              key={opt.id}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm transition hover:bg-slate-50 has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50"
            >
              <input
                type="checkbox"
                checked={leistungen.includes(opt.id)}
                onChange={(e) => {
                  setLeistungen((prev) =>
                    e.target.checked ? [...prev, opt.id] : prev.filter((l) => l !== opt.id)
                  )
                }}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Über unser Büro</h2>
        <p className="mt-1 text-sm text-slate-600">
          Freitext zum Arbeitsweise, Team, Philosophie – wird auf dem Profil angezeigt.
        </p>
        <textarea
          value={ueberUnserBuero}
          onChange={(e) => setUeberUnserBuero(e.target.value)}
          rows={6}
          placeholder="z.B. Unser Team steht für persönliche Beratung und langjährige Erfahrung am Immobilienmarkt..."
          className="mt-4 block w-full rounded-lg border border-slate-300 px-4 py-2"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Status & Zugang</h2>
        <div className="mt-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
            >
              <option value="standard">Standard</option>
              <option value="starter">Starter</option>
              <option value="partner">Partner</option>
              <option value="premium">Premium</option>
              <option value="pending">Ausstehend</option>
            </select>
          </div>
          {(needsPassword || showPasswordField) && (
            <div>
              <label className="block text-sm font-medium text-slate-700">
                {needsPassword ? 'Passwort setzen (für Login erforderlich) *' : 'Neues Passwort'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required={needsPassword}
                placeholder="Mindestens 6 Zeichen"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
              />
              {needsPassword && (
                <p className="mt-1 text-xs text-amber-600">
                  Dieser Makler hat noch kein Passwort und kann sich nicht anmelden.
                </p>
              )}
            </div>
          )}
          {!needsPassword && !showPasswordField && (
            <button
              type="button"
              onClick={() => setShowPasswordField(true)}
              className="text-sm text-teal-600 hover:underline"
            >
              Passwort ändern
            </button>
          )}
        </div>
      </div>

      {success && (
        <div className="rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm font-medium text-teal-800">
          ✓ Änderungen gespeichert.
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-700 disabled:opacity-50"
        >
          {loading ? 'Speichern...' : 'Speichern'}
        </button>
        <Link
          href="/admin/makler"
          className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
        >
          Abbrechen
        </Link>
      </div>

      <div className="mt-12 rounded-xl border border-red-200 bg-red-50/50 p-6">
        <h3 className="font-medium text-red-800">Makler von der Plattform entfernen</h3>
        <p className="mt-1 text-sm text-red-700">
          Der Makler wird dauerhaft gelöscht. Zugewiesene Leads bleiben erhalten.
        </p>
        <div className="mt-4">
          <MaklerDeleteButton maklerId={makler.id} maklerName={makler.firmenname || makler.name} />
        </div>
      </div>
    </form>
  )
}
