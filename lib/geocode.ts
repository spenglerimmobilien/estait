const CACHE = new Map<string, { lat: number; lng: number }>()

/** Germany bounding box (lon,lat,lon,lat) to avoid PLZ queries matching Chile etc. */
const DE_BBOX = '5.8,47.2,15.0,55.1'

export async function geocode(plz: string, city?: string): Promise<{ lat: number; lng: number } | null> {
  const normalizedPlz = plz.replace(/\s/g, '').padStart(5, '0').slice(0, 5)
  const key = city?.trim() ? `${normalizedPlz}|${city.trim()}` : normalizedPlz
  const cached = CACHE.get(key)
  if (cached) return cached

  try {
    const query = city?.trim() ? `${normalizedPlz} ${city.trim()}` : `${normalizedPlz} Deutschland`
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=1&bbox=${DE_BBOX}`
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) return null
    const data = await res.json()
    const feature = data.features?.[0]
    if (!feature?.geometry?.coordinates) return null
    const [lng, lat] = feature.geometry.coordinates
    const result = { lat, lng }
    CACHE.set(key, result)
    return result
  } catch {
    return null
  }
}

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
