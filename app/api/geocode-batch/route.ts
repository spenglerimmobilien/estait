import { NextRequest, NextResponse } from 'next/server'
import { geocode } from '@/lib/geocode'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const locations = Array.isArray(body.locations) ? body.locations : []
    if (locations.length > 50) {
      return NextResponse.json({ error: 'Max 50 Orte' }, { status: 400 })
    }

    const results = await Promise.all(
      locations.map(async (loc: { plz: string; city?: string }) => {
        if (!loc?.plz) return null
        const coords = await geocode(loc.plz, loc.city)
        return coords ? { plz: loc.plz, city: loc.city, lat: coords.lat, lng: coords.lng } : null
      })
    )
    return NextResponse.json({ results })
  } catch {
    return NextResponse.json({ error: 'Geocoding fehlgeschlagen' }, { status: 500 })
  }
}
