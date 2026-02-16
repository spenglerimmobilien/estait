'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { calculatePropertyValue, type PropertyType, type Condition } from '@/lib/calculator'
import { downloadWertermittlungPdf } from '@/lib/wertermittlung-pdf'

const PROPERTY_OPTIONS: { type: PropertyType; label: string; icon: string }[] = [
  { type: 'wohnung', label: 'Wohnung', icon: '🏢' },
  { type: 'einfamilienhaus', label: 'Einfamilienhaus', icon: '🏠' },
  { type: 'mehrfamilienhaus', label: 'Mehrfamilienhaus', icon: '🏘️' },
  { type: 'grundstueck', label: 'Grundstück', icon: '🌳' },
]

const BAUJAHR_OPTIONS = [
  { label: 'Vor 1900', value: '1880' },
  { label: '1900–1949', value: '1925' },
  { label: '1950–1979', value: '1965' },
  { label: '1980–1999', value: '1990' },
  { label: '2000–2014', value: '2010' },
  { label: '2015–2024', value: '2020' },
  { label: 'Ab 2025', value: '2025' },
]

const HORIZONT_OPTIONS = [
  { label: 'Schnellstmöglich', icon: '⚡' },
  { label: '1–6 Monate', icon: '📅' },
  { label: '12 Monate', icon: '🗓️' },
  { label: 'Mehr als 12 Monate', icon: '📆' },
]

const TOTAL_STEPS = 7

export default function RechnerPage() {
  const [step, setStep] = useState(1)
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null)
  const [flaecheSlider, setFlaecheSlider] = useState(95)
  const [flaecheExact, setFlaecheExact] = useState('')
  const [baujahr, setBaujahr] = useState('')
  const [baujahrExact, setBaujahrExact] = useState('')
  const [horizont, setHorizont] = useState('')
  const [address, setAddress] = useState('')
  const [plz, setPlz] = useState('')
  const [city, setCity] = useState('')
  const [addressError, setAddressError] = useState('')
  const [addressValidating, setAddressValidating] = useState(false)
  const [addressSuggestions, setAddressSuggestions] = useState<{ label: string; address: string; plz: string; city: string }[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [agb, setAgb] = useState(false)
  const [datenschutz, setDatenschutz] = useState(false)
  const [result, setResult] = useState<{ min: number; max: number; plzFound: boolean; region?: string; exactMatch?: boolean } | null>(null)
  const [valueRevealed, setValueRevealed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [leadSubmitted, setLeadSubmitted] = useState(false)
  const [maklerCount, setMaklerCount] = useState<number | null>(null)

  const flaeche = flaecheExact ? parseFloat(flaecheExact.replace(',', '.')) : flaecheSlider
  const flaecheMax = propertyType === 'mehrfamilienhaus' ? 2000 : 600

  function handlePropertySelect(type: PropertyType) {
    setPropertyType(type)
    setStep(2)
  }

  function nextStep() {
    if (step < TOTAL_STEPS) setStep(step + 1)
  }

  function prevStep() {
    if (step > 1) setStep(step - 1)
  }

  useEffect(() => {
    if (step === 6) {
      const timer = setTimeout(() => setStep(7), 3000)
      return () => clearTimeout(timer)
    }
  }, [step])

  async function handleCheckoutSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !agb || !datenschutz) return

    setLoading(true)
    setLeadSubmitted(true)

    const flaecheNum = flaecheExact ? parseFloat(flaecheExact.replace(',', '.')) : flaecheSlider
    const baujahrNum = baujahrExact ? parseInt(baujahrExact, 10) : (baujahr ? parseInt(baujahr, 10) : undefined)

    const calcResult = propertyType
      ? calculatePropertyValue({
          plz,
          flaeche: flaecheNum,
          propertyType,
          baujahr: propertyType !== 'grundstueck' ? baujahrNum : undefined,
          condition: 'gut',
        })
      : null

    setResult(calcResult)

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          plz,
          propertyData: calcResult
            ? {
                min: calcResult.min,
                max: calcResult.max,
                flaeche: flaecheNum,
                propertyType,
                horizont,
                baujahr: baujahrNum,
                plz,
                address,
                region: city || calcResult.region,
              }
            : null,
          consent: datenschutz,
        }),
      })
    } catch {
      // Lead optional, continue
    }

    setLoading(false)
    setValueRevealed(true)
  }

  useEffect(() => {
    if (valueRevealed && plz) {
      fetch(`/api/makler?plz=${encodeURIComponent(plz)}`)
        .then((res) => res.json())
        .then((data) => setMaklerCount(Array.isArray(data) ? data.length : 0))
        .catch(() => setMaklerCount(0))
    }
  }, [valueRevealed, plz])

  useEffect(() => {
    if (address.trim().length < 2) {
      setAddressSuggestions([])
      setShowSuggestions(false)
      return
    }
    const timer = setTimeout(() => {
      setSuggestionsLoading(true)
      fetch(`/api/address-suggestions?q=${encodeURIComponent(address.trim())}`)
        .then((res) => res.json())
        .then((data) => {
          const suggestions = data.suggestions || []
          setAddressSuggestions(suggestions)
          setShowSuggestions(suggestions.length > 0)
        })
        .catch(() => {
          setAddressSuggestions([])
          setShowSuggestions(false)
        })
        .finally(() => setSuggestionsLoading(false))
    }, 200)
    return () => clearTimeout(timer)
  }, [address])

  function selectSuggestion(s: { label: string; address: string; plz: string; city?: string }) {
    setAddress(s.address)
    setPlz(s.plz)
    setCity(s.city || '')
    setAddressError('')
    setShowSuggestions(false)
  }

  const canProceedStep2 = flaeche >= 10 && flaeche <= flaecheMax
  const canProceedStep3 = propertyType === 'grundstueck' || baujahr || baujahrExact
  const canProceedStep4 = !!horizont
  const canProceedStep5 = !!plz && !!address.trim() && !addressError

  async function validateAddress() {
    if (!address.trim()) {
      setAddressError('Bitte geben Sie Straße und Hausnummer ein.')
      return false
    }
    if (plz) {
      return true
    }
    setAddressValidating(true)
    setAddressError('')
    try {
      const res = await fetch('/api/validate-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: address.trim() }),
      })
      const data = await res.json()
      if (!res.ok || !data.valid) {
        setAddressError(data.error || 'Bitte geben Sie eine gültige Adresse mit Hausnummer ein.')
        setAddressValidating(false)
        return false
      }
      setPlz(data.plz)
      setAddress(data.address || address.trim())
      setCity(data.city || '')
      setAddressError('')
      setAddressValidating(false)
      return true
    } catch {
      setAddressError('Adresse konnte nicht geprüft werden.')
      setAddressValidating(false)
      return false
    }
  }

  async function handleAddressNext() {
    if (plz) {
      nextStep()
      return
    }
    // Bei mehreren Adressvorschlägen muss der Nutzer auswählen, um falsche Stadt zu vermeiden
    if (addressSuggestions.length > 0) {
      setAddressError('Bitte wählen Sie die richtige Adresse aus der Liste aus (Straße kann in mehreren Städten existieren).')
      return
    }
    const ok = await validateAddress()
    if (ok) nextStep()
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
        <span>Schritt {step} von {TOTAL_STEPS}</span>
        <div className="h-1.5 flex-1 rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-teal-500 transition-all duration-300"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-slate-900">Immobilienwert-Rechner</h1>
      <p className="mt-2 text-slate-600">
        Erhalten Sie in wenigen Minuten eine grobe Schätzung des Werts Ihrer Immobilie.
      </p>

      {/* Step 1: Objektart */}
      {step === 1 && (
        <div className="mt-10">
          <p className="mb-6 text-sm font-medium text-slate-700">Was möchten Sie bewerten?</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {PROPERTY_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handlePropertySelect(opt.type)
                }}
                className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-slate-200 bg-white p-6 transition hover:border-teal-400 hover:bg-teal-50/50 focus:outline-none focus:ring-2 focus:ring-teal-500 active:scale-[0.98]"
              >
                <span className="text-4xl">{opt.icon}</span>
                <span className="text-center text-sm font-medium text-slate-700">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Fläche */}
      {step === 2 && propertyType && (
        <div className="mt-10 space-y-8">
          <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Zurück
          </button>

          <div className="rounded-2xl border-2 border-slate-100 bg-white p-6 shadow-sm">
            <label className="mb-4 block text-sm font-medium text-slate-700">
              {propertyType === 'grundstueck' ? 'Grundstücksfläche' : 'Wohnfläche'} in m²
            </label>
            <input
              type="range"
              min="10"
              max={flaecheMax}
              step="10"
              value={flaecheSlider}
              onChange={(e) => setFlaecheSlider(parseInt(e.target.value, 10))}
              className="w-full accent-teal-600"
            />
            <p className="mt-2 text-2xl font-bold text-teal-600">{flaecheSlider} m²</p>

            <p className="mt-6 text-sm text-slate-500">Alternativ genaue Angabe machen in Quadratmeter:</p>
            <input
              type="text"
              inputMode="decimal"
              value={flaecheExact}
              onChange={(e) => setFlaecheExact(e.target.value)}
              placeholder="z.B. 127"
              className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-teal-500 focus:ring-teal-500"
            />
          </div>

          <button
            type="button"
            onClick={nextStep}
            disabled={!canProceedStep2}
            className="w-full rounded-xl bg-teal-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
          >
            Weiter
          </button>
        </div>
      )}

      {/* Step 3: Baujahr */}
      {step === 3 && propertyType && propertyType !== 'grundstueck' && (
        <div className="mt-10 space-y-8">
          <button type="button" onClick={() => setStep(2)} className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Zurück
          </button>

          <div className="rounded-2xl border-2 border-slate-100 bg-white p-6 shadow-sm">
            <label className="mb-4 block text-sm font-medium text-slate-700">Baujahr</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {BAUJAHR_OPTIONS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setBaujahr(d.value)}
                  className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition ${
                    baujahr === d.value ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-500">Oder genaues Baujahr eingeben:</p>
            <input
              type="number"
              min="1800"
              max="2030"
              value={baujahrExact}
              onChange={(e) => setBaujahrExact(e.target.value)}
              placeholder="z.B. 1995"
              className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-teal-500 focus:ring-teal-500"
            />
          </div>

          <button
            type="button"
            onClick={nextStep}
            disabled={!canProceedStep3}
            className="w-full rounded-xl bg-teal-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
          >
            Weiter
          </button>
        </div>
      )}

      {/* Step 3 for Grundstück: Baujahr nicht relevant, direkt weiter */}
      {step === 3 && propertyType === 'grundstueck' && (
        <div className="mt-10 space-y-8">
          <button type="button" onClick={() => setStep(2)} className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Zurück
          </button>
          <p className="text-slate-600">Bei Grundstücken wird das Baujahr nicht berücksichtigt.</p>
          <button type="button" onClick={() => setStep(4)} className="w-full rounded-xl bg-teal-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-teal-700">
            Weiter
          </button>
        </div>
      )}

      {/* Step 4: Zeitlicher Horizont */}
      {step === 4 && propertyType && (
        <div className="mt-10 space-y-8">
          <button
            type="button"
            onClick={() => setStep(propertyType === 'grundstueck' ? 2 : 3)}
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Zurück
          </button>

          <div className="rounded-2xl border-2 border-slate-100 bg-white p-6 shadow-sm">
            <label className="mb-4 block text-sm font-medium text-slate-700">Zeitlicher Horizont</label>
            <div className="grid grid-cols-2 gap-4">
              {HORIZONT_OPTIONS.map((h) => (
                <button
                  key={h.label}
                  type="button"
                  onClick={() => setHorizont(h.label)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition ${
                    horizont === h.label ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl">{h.icon}</span>
                  <span className="text-center text-sm font-medium text-slate-700">{h.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={nextStep}
            disabled={!canProceedStep4}
            className="w-full rounded-xl bg-teal-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
          >
            Weiter
          </button>
        </div>
      )}

      {/* Step 5: Adresse – alle Orte als Dropdown */}
      {step === 5 && propertyType && (
        <div className="mt-10 space-y-8">
          <button type="button" onClick={() => setStep(4)} className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Zurück
          </button>

          <div className="overflow-visible rounded-2xl border-2 border-slate-100 bg-white p-6 shadow-sm">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Adresse der Immobilie (Straße und Hausnummer) *
            </label>
            <div className="relative overflow-visible">
              <input
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value)
                  setAddressError('')
                  if (!addressSuggestions.some((s) => s.address === e.target.value)) {
                    setPlz('')
                  }
                }}
                onFocus={() => addressSuggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="z.B. Kaiserstraße 10"
                autoComplete="off"
                spellCheck={false}
                className={`block w-full rounded-xl border-2 px-4 py-3 text-lg focus:ring-2 focus:ring-teal-500 ${
                  addressError ? 'border-red-300' : 'border-slate-200'
                }`}
              />
              {showSuggestions && addressSuggestions.length > 0 && (
                <ul
                  className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-auto rounded-xl border border-slate-200 bg-white py-2 shadow-xl"
                  role="listbox"
                  aria-label="Adressvorschläge"
                >
                  {addressSuggestions.map((s) => (
                    <li key={`${s.address}-${s.plz}`} role="option">
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          selectSuggestion(s)
                        }}
                        className="flex w-full flex-col items-start gap-0.5 px-4 py-2.5 text-left text-sm hover:bg-teal-50 focus:bg-teal-50 focus:outline-none"
                      >
                        <span className="font-medium text-slate-900">
                          {s.address.split(',')[0]?.trim() || s.address}
                        </span>
                        <span className="text-slate-500">
                          {[s.plz, s.city].filter(Boolean).join(' ')}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {suggestionsLoading && (
              <p className="mt-2 text-xs text-slate-500">Suche Adressen...</p>
            )}
            <p className="mt-2 text-xs text-slate-500">
              Straße und Hausnummer eingeben – alle passenden Adressen in verschiedenen Städten erscheinen im Dropdown. Bitte die richtige Stadt auswählen.
            </p>
            {addressError && <p className="mt-2 text-sm text-red-600">{addressError}</p>}
          </div>

          <button
            type="button"
            onClick={handleAddressNext}
            disabled={addressValidating || !address.trim()}
            className="w-full rounded-xl bg-teal-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
          >
            {addressValidating ? 'Adresse wird geprüft...' : 'Weiter'}
          </button>
        </div>
      )}

      {/* Step 6: Ladeanimation – automatische Weiterleitung nach 3 Sekunden */}
      {step === 6 && propertyType && (
        <div className="mt-10 flex flex-col items-center justify-center py-16">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600" />
          <p className="mt-6 text-center text-lg font-medium text-slate-700">
            Wir errechnen Ihren Preis und suchen den richtigen Anbieter für Ihr Vorhaben.
          </p>
        </div>
      )}

      {/* Step 7: Checkout */}
      {step === 7 && propertyType && (
        <form onSubmit={handleCheckoutSubmit} className="mt-10 space-y-6">
          {/* Info: Was passiert beim Absenden */}
          <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-emerald-50/50 p-5">
            <p className="text-sm font-semibold text-teal-800">Was passiert beim Absenden?</p>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-600">1</span>
                Sie erhalten im nächsten Schritt Ihre <strong>Immobilienbewertung</strong>.
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-600">2</span>
                Ihre Anfrage wird an einen <strong>qualifizierten Makler</strong> in Ihrer Region übermittelt.
              </li>
            </ul>
          </div>

          {/* Objekt-Zusammenfassung */}
          <div className="rounded-2xl border-2 border-teal-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-teal-600">Ihr Objekt</p>
            <p className="mt-1.5 text-base font-medium text-slate-800">
              {PROPERTY_OPTIONS.find((o) => o.type === propertyType)?.icon} {PROPERTY_OPTIONS.find((o) => o.type === propertyType)?.label} · {(flaecheExact ? parseFloat(flaecheExact.replace(',', '.')) : flaecheSlider)} m² · {address || plz}
            </p>
          </div>

          {/* Kontaktdaten */}
          <div className="space-y-4">
            <p className="text-sm font-semibold text-slate-800">Ihre Kontaktdaten</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-600">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Max Mustermann"
                  className="mt-1.5 block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600">E-Mail *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="ihre@email.de"
                  className="mt-1.5 block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600">Telefon</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Optional"
                className="mt-1.5 block w-full max-w-xs rounded-xl border border-slate-300 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </div>

          {/* Einwilligung (wie auf Foto) */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={agb && datenschutz}
                onChange={(e) => {
                  setAgb(e.target.checked)
                  setDatenschutz(e.target.checked)
                }}
                required
                className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm leading-relaxed text-slate-700">
                Mit dem Absenden meiner Anfrage stimme ich zu, dass die Jacasa GmbH meine personenbezogenen Daten (z.B. Telefon, E-Mail) zwecks einer aktuellen Bewertung verarbeitet und mich kontaktiert. Außerdem akzeptiere ich die{' '}
                <Link href="/agb" className="font-medium text-teal-600 underline decoration-teal-400 underline-offset-2 hover:text-teal-700" target="_blank">
                  AGB
                </Link>{' '}
                und habe die{' '}
                <Link href="/datenschutz" className="font-medium text-teal-600 underline decoration-teal-400 underline-offset-2 hover:text-teal-700" target="_blank">
                  Datenschutzerklärung
                </Link>{' '}
                zur Kenntnis genommen.
              </span>
            </label>
          </div>

          {!valueRevealed ? (
            <button
              type="submit"
              disabled={loading || !name || !email || !agb || !datenschutz}
              className="w-full rounded-xl bg-teal-600 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-teal-600/25 transition hover:bg-teal-700 disabled:opacity-50"
            >
              {loading ? 'Wird verarbeitet...' : 'Bewertung anzeigen & Anfrage absenden'}
            </button>
          ) : result ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center rounded-2xl border-2 border-teal-200 bg-teal-50/50 p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 animate-success-pop">
                  <span className="text-4xl font-bold text-teal-600">✓</span>
                </div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Ihr Immobilienwert wurde berechnet
                </h2>
                <p className="mt-2 text-slate-600">
                  Ihre Anfrage wurde an qualifizierte Makler übermittelt. Keine weiteren Schritte nötig.
                </p>
                <p className="mt-6 text-3xl font-bold text-teal-600">
                  ca. {result.min.toLocaleString('de-DE')} € – {result.max.toLocaleString('de-DE')} €
                </p>
                {(city || result.region) && (
                  <p className="mt-2 text-sm text-slate-600">
                    {city ? `Ihr Standort: ${city}` : `Region: ${result.region}`}
                  </p>
                )}
                <p className="mt-4 text-sm text-slate-500">
                  Dies ist eine grobe Schätzung und ersetzt keine professionelle Wertermittlung.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  downloadWertermittlungPdf({
                    min: result.min,
                    max: result.max,
                    propertyType: propertyType!,
                    flaeche,
                    address: address || undefined,
                    plz: plz || undefined,
                    city: city || undefined,
                    region: result.region,
                  })
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-teal-600 bg-white px-6 py-4 font-semibold text-teal-600 transition hover:bg-teal-50"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Wertermittlung als PDF herunterladen
              </button>

              {maklerCount !== null && maklerCount > 0 && (
                <div className="rounded-xl border border-teal-200 bg-teal-50/30 p-4">
                  <p className="text-sm font-medium text-teal-800">
                    🏠 {maklerCount} qualifizierte Makler {city ? `in ${city}` : 'in Ihrer Region'}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Ein Makler wird sich bei Ihnen melden. Optional können Sie auch direkt eine Beratung anfragen.
                  </p>
                  <Link
                    href={`/beratung?plz=${encodeURIComponent(plz)}&propertyData=${encodeURIComponent(JSON.stringify({ min: result.min, max: result.max, flaeche, propertyType }))}`}
                    className="mt-3 inline-block text-sm font-medium text-teal-600 hover:text-teal-700"
                  >
                    Jetzt Beratung anfragen →
                  </Link>
                </div>
              )}
            </div>
          ) : null}
        </form>
      )}
    </div>
  )
}
