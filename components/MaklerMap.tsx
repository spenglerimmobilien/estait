'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ABO_STUFEN, getAboLabel } from '@/lib/abo-stufen'

export interface MaklerWithCoords {
  id: string
  name: string
  plz: string
  city: string
  address: string | null
  status: string
  logoUrl: string | null
  lat: number
  lng: number
}

interface MaklerMapProps {
  makler: MaklerWithCoords[]
}

function getMarkerConfig(status: string) {
  const abo = ABO_STUFEN[status as keyof typeof ABO_STUFEN]
  return abo?.marker ?? { size: 8, color: '#64748b', ring: false }
}

function FitBounds({ makler }: { makler: MaklerWithCoords[] }) {
  const map = useMap()
  useEffect(() => {
    if (makler.length === 0) return
    if (makler.length === 1) {
      map.setView([makler[0].lat, makler[0].lng], 12)
    } else {
      const bounds = L.latLngBounds(makler.map((m) => [m.lat, m.lng]))
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 12 })
    }
  }, [map, makler])
  return null
}

function createMarkerIcon(status: string) {
  const config = getMarkerConfig(status)
  const s = config.size
  const container = s + (config.ring ? 8 : 4)
  const ringStyle = config.ring
    ? `border:2px solid rgba(255,255,255,0.9);box-shadow:0 1px 3px rgba(0,0,0,0.15);`
    : `box-shadow:0 1px 2px rgba(0,0,0,0.2);`
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="display:flex;align-items:center;justify-content:center;width:${container}px;height:${container}px;"><div style="width:${s}px;height:${s}px;border-radius:50%;background:${config.color};${ringStyle}"></div></div>`,
    iconSize: [container, container],
    iconAnchor: [container / 2, container / 2],
  })
}

export default function MaklerMap({ makler }: MaklerMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const center: [number, number] =
    makler.length > 0 ? [makler[0].lat, makler[0].lng] : [51.1657, 10.4515]

  return (
    <div
      className="w-full overflow-hidden rounded-xl border border-slate-200"
      style={{ minHeight: 400, height: 400 }}
    >
      <MapContainer
        key={makler.length}
        center={center}
        zoom={makler.length > 0 ? 6 : 5}
        className="h-full w-full"
        style={{ height: '100%', minHeight: 400 }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {makler.map((m) => {
          const config = getMarkerConfig(m.status)
          return (
            <Marker
              key={m.id}
              position={[m.lat, m.lng]}
              icon={createMarkerIcon(m.status)}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5">
                      {m.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={m.logoUrl}
                          alt={(m as { firmenname?: string }).firmenname || m.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-sm font-semibold tracking-tight text-slate-400">
                          {((m as { firmenname?: string }).firmenname || m.name)
                            .split(/\s+/)
                            .map((w) => w[0])
                            .filter(Boolean)
                            .slice(0, 2)
                            .join('')
                            .toUpperCase() || '—'}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900">{(m as { firmenname?: string }).firmenname || m.name}</p>
                      <p className="text-sm text-slate-600">
                        {m.plz} {m.city}
                      </p>
                      <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {getAboLabel(m.status)}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`/makler/${m.id}`}
                    className="mt-3 block w-full rounded-lg bg-teal-600 px-3 py-2 text-center text-sm font-medium hover:bg-teal-700"
                    style={{ color: '#ffffff' }}
                  >
                    Profil ansehen
                  </a>
                </div>
              </Popup>
            </Marker>
          )
        })}
        <FitBounds makler={makler} />
      </MapContainer>
    </div>
  )
}
