import { NextRequest, NextResponse } from 'next/server'
import { expandStreetAbbreviations } from '@/lib/address-normalize'

const FAKE_PATTERNS = [
  /test\s*(straße|str|strasse)/i,
  /beispiel\s*(straße|str|strasse)/i,
  /muster\s*(straße|str|strasse)/i,
  /dummy/i,
  /fake/i,
  /^test/i,
  /^xyz/i,
]

function hasHouseNumber(address: string): boolean {
  const t = address.trim()
  return (
    /\d+\s*[a-zA-Z]?\s*$/.test(t) ||
    /\d+\s*[a-zA-Z]?\s*,/.test(t) ||
    /\s+\d+\s*[a-zA-Z]?\s*$/.test(t) ||
    /^\d+\s+\D/.test(t)
  )
}

function isLikelyFake(address: string): boolean {
  const normalized = address.trim().toLowerCase()
  return FAKE_PATTERNS.some((p) => p.test(normalized))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { address } = body

    if (!address || typeof address !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Bitte geben Sie eine Adresse ein.' },
        { status: 400 }
      )
    }

    const trimmed = address.trim()
    if (trimmed.length < 10) {
      return NextResponse.json(
        { valid: false, error: 'Die Adresse ist zu kurz.' },
        { status: 400 }
      )
    }

    if (!hasHouseNumber(trimmed)) {
      return NextResponse.json(
        { valid: false, error: 'Bitte geben Sie eine Adresse mit Hausnummer ein (z.B. Musterstraße 12).' },
        { status: 400 }
      )
    }

    if (isLikelyFake(trimmed)) {
      return NextResponse.json(
        { valid: false, error: 'Diese Adresse ist nicht gültig.' },
        { status: 400 }
      )
    }

    // Fallback: PLZ aus Adresse extrahieren (Format: "Straße 1, 12345 Stadt")
    const plzMatch = trimmed.match(/,?\s*(\d{5})\s+([^,]+)\s*$/)
    if (plzMatch) {
      const extractedPlz = plzMatch[1]
      const extractedCity = plzMatch[2].trim()
      return NextResponse.json({
        valid: true,
        plz: extractedPlz,
        address: expandStreetAbbreviations(trimmed),
        city: extractedCity,
      })
    }

    const query = encodeURIComponent(`${trimmed}, Deutschland`)
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&countrycodes=de&limit=3`

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'ESTAIT-Immobilienwertrechner/1.0',
        'Accept-Language': 'de',
      },
    })

    if (!res.ok) {
      const fallbackPlz = trimmed.match(/\b(\d{5})\b/)?.[1]
      if (fallbackPlz) {
        return NextResponse.json({
          valid: true,
          plz: fallbackPlz,
          address: expandStreetAbbreviations(trimmed),
          city: '',
        })
      }
      return NextResponse.json(
        { valid: false, error: 'Adresse konnte nicht geprüft werden. Bitte versuchen Sie es mit PLZ und Ort (z.B. Nienhofstraße 10, 48159 Münster).' },
        { status: 400 }
      )
    }

    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) {
      const fallbackPlz = trimmed.match(/\b(\d{5})\b/)?.[1]
      if (fallbackPlz) {
        return NextResponse.json({
          valid: true,
          plz: fallbackPlz,
          address: expandStreetAbbreviations(trimmed),
          city: trimmed.split(',').pop()?.trim() || '',
        })
      }
      return NextResponse.json(
        { valid: false, error: 'Adresse nicht gefunden. Bitte geben Sie PLZ und Ort mit an (z.B. Straße 10, 48159 Münster).' },
        { status: 400 }
      )
    }

    const result = data[0]
    const addr = result.address
    const plz = addr?.postcode || addr?.postal_code
    if (!plz) {
      const fallbackPlz = trimmed.match(/\b(\d{5})\b/)?.[1]
      if (fallbackPlz) {
        return NextResponse.json({
          valid: true,
          plz: fallbackPlz,
          address: expandStreetAbbreviations(trimmed),
          city: addr?.city || addr?.town || addr?.village || '',
        })
      }
      return NextResponse.json(
        { valid: false, error: 'Die Adresse konnte nicht eindeutig zugeordnet werden. Bitte PLZ und Ort angeben.' },
        { status: 400 }
      )
    }

    const displayRaw = [addr?.road, addr?.house_number]
      .filter(Boolean)
      .join(' ')
    const display = expandStreetAbbreviations(displayRaw)
    const city = addr?.city || addr?.town || addr?.village || addr?.municipality || ''
    const fullAddress = [display, plz, city].filter(Boolean).join(', ')

    return NextResponse.json({
      valid: true,
      plz: String(plz).replace(/\s/g, '').padStart(5, '0').slice(0, 5),
      address: expandStreetAbbreviations(fullAddress || trimmed),
      city,
    })
  } catch (error) {
    console.error('Address validation error:', error)
    return NextResponse.json(
      { valid: false, error: 'Adresse konnte nicht geprüft werden.' },
      { status: 500 }
    )
  }
}
