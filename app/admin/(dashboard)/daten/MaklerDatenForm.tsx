'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  logoUrl: string | null
}

export function MaklerDatenForm({ makler }: { makler: Makler }) {
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
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(makler.logoUrl)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
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
        formData.append('maklerId', makler.id)
        const uploadRes = await fetch('/api/makler/logo', {
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

      const res = await fetch('/api/makler/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firmenname,
          ansprechpartner: ansprechpartner.trim() || null,
          plz,
          city,
          address: address || null,
          email: email || null,
          phone: phone || null,
          website: website || null,
          facebookUrl: facebookUrl.trim() || null,
          instagramUrl: instagramUrl.trim() || null,
          linkedinUrl: linkedinUrl.trim() || null,
          twitterUrl: twitterUrl.trim() || null,
          youtubeUrl: youtubeUrl.trim() || null,
          googleBusinessUrl: googleBusinessUrl.trim() || null,
          taetigkeitsbereiche: taetigkeitsbereiche.length > 0 ? taetigkeitsbereiche : null,
          leistungen: leistungen.length > 0 ? leistungen : null,
          ueberUnserBuero: ueberUnserBuero.trim() || null,
          logoUrl: logoUrl ?? undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        const errMsg = data.error || (res.status === 401 ? 'Bitte melden Sie sich erneut an.' : 'Speichern fehlgeschlagen.')
        setError(errMsg)
        setLoading(false)
        return
      }
      setSuccess(true)
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
          Laden Sie Ihr Logo oder ein Profilfoto hoch (JPG, PNG, WebP, max. 2 MB)
        </p>
        <div className="mt-4 flex items-start gap-6">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            {logoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoPreview}
                alt="Logo"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-3xl text-slate-400">?</span>
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleLogoChange}
              className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-teal-700 hover:file:bg-teal-100"
            />
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
              placeholder="z.B. Max Mustermann (optional)"
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
          In welchen Immobilienbereichen sind Sie tätig?
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
          Welche Leistungen bieten Sie an?
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
          Beschreiben Sie Ihre Arbeitsweise, Ihr Team oder Ihre Philosophie – wird auf Ihrem Profil angezeigt.
        </p>
        <textarea
          value={ueberUnserBuero}
          onChange={(e) => setUeberUnserBuero(e.target.value)}
          rows={6}
          placeholder="z.B. Unser Team steht für persönliche Beratung und langjährige Erfahrung am Immobilienmarkt..."
          className="mt-4 block w-full rounded-lg border border-slate-300 px-4 py-2"
        />
      </div>

      {success && (
        <div className="rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm font-medium text-teal-800">
          ✓ Änderungen gespeichert.
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-teal-600 px-6 py-2 font-medium text-white hover:bg-teal-700 disabled:opacity-50"
      >
        {loading ? 'Speichern...' : 'Speichern'}
      </button>
    </form>
  )
}
