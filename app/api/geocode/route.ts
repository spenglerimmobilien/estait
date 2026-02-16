import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const plz = request.nextUrl.searchParams.get('plz')
  const city = request.nextUrl.searchParams.get('city')

  if (!plz || plz.trim().length < 2) {
    return NextResponse.json({ error: 'PLZ erforderlich' }, { status: 400 })
  }

  const normalizedPlz = plz.replace(/\s/g, '').padStart(5, '0').slice(0, 5)
  const query = city?.trim()
    ? `${normalizedPlz} ${city.trim()}`
    : `${normalizedPlz} Deutschland`
  const bbox = '5.8,47.2,15.0,55.1'

  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=1&bbox=${bbox}`
    const res = await fetch(url, { headers: { Accept: 'application/json' } })

    if (!res.ok) return NextResponse.json({ error: 'Geocoding fehlgeschlagen' }, { status: 502 })

    const data = await res.json()
    const feature = data.features?.[0]
    if (!feature?.geometry?.coordinates) {
      return NextResponse.json({ error: 'Ort nicht gefunden' }, { status: 404 })
    }

    const [lng, lat] = feature.geometry.coordinates
    return NextResponse.json({ lat, lng })
  } catch {
    return NextResponse.json({ error: 'Geocoding fehlgeschlagen' }, { status: 500 })
  }
}
