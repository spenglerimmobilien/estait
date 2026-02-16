import { NextRequest, NextResponse } from 'next/server'
import { expandStreetAbbreviations } from '@/lib/address-normalize'

type Suggestion = { label: string; address: string; plz: string; city: string }

interface PhotonFeature {
  properties?: { postcode?: string; street?: string; housenumber?: string; name?: string; countrycode?: string; city?: string; district?: string }
}

function parsePhoton(features: unknown[]): Suggestion[] {
  const seen = new Set<string>()
  const list = features as PhotonFeature[]
  return list
    .filter((f) => {
      const p = f.properties
      if (p?.countrycode && p.countrycode.toUpperCase() !== 'DE') return false
      return p?.postcode && (p?.street || p?.housenumber || p?.name)
    })
    .map((f) => {
      const p = f.properties!
      const streetRaw = [p.street, p.housenumber].filter(Boolean).join(' ') || p.name || ''
      const street = expandStreetAbbreviations(streetRaw)
      const city = p.city || p.district || ''
      const plz = String(p.postcode).replace(/\s/g, '').padStart(5, '0').slice(0, 5)
      const label = [street, plz, city].filter(Boolean).join(', ')
      return { label, address: label, plz, city }
    })
    .filter((s) => {
      const key = `${s.address}|${s.plz}|${s.city}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
}

interface NominatimItem {
  address?: { road?: string; house_number?: string; postcode?: string; city?: string; town?: string; village?: string }
}

function parseNominatim(items: unknown[]): Suggestion[] {
  const seen = new Set<string>()
  const list = items as NominatimItem[]
  return list
    .filter((item) => {
      const addr = item.address
      return addr?.postcode && (addr?.road || addr?.house_number)
    })
    .map((item) => {
      const addr = item.address!
      const street = expandStreetAbbreviations([addr.road, addr.house_number].filter(Boolean).join(' '))
      const city = addr.city || addr.town || addr.village || ''
      const plz = String(addr.postcode).replace(/\s/g, '').padStart(5, '0').slice(0, 5)
      const label = [street, plz, city].filter(Boolean).join(', ')
      return { label, address: label, plz, city }
    })
    .filter((s) => {
      const key = `${s.address}|${s.plz}|${s.city}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')
  if (!q || q.trim().length < 2) {
    return NextResponse.json({ suggestions: [] })
  }

  const query = q.trim()
  let suggestions: Suggestion[] = []

  // 1. Photon (schneller, gute Abdeckung)
  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=50&lang=de&bbox=5.8,47.2,15.0,55.1`
    const res = await fetch(photonUrl, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    })
    if (res.ok) {
      const data = await res.json()
      suggestions = parsePhoton(data.features || [])
    }
  } catch {
    // Photon fehlgeschlagen, Fallback nutzen
  }

  // 2. Fallback: Nominatim wenn Photon keine Treffer liefert
  if (suggestions.length === 0) {
    try {
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', Deutschland')}&format=json&addressdetails=1&countrycodes=de&limit=20`
      const res = await fetch(nominatimUrl, {
        headers: {
          'User-Agent': 'ESTAIT-Immobilienwertrechner/1.0',
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      })
      if (res.ok) {
        const data = await res.json()
        suggestions = parseNominatim(Array.isArray(data) ? data : [])
      }
    } catch {
      // Nominatim fehlgeschlagen
    }
  }

  return NextResponse.json({ suggestions })
}
