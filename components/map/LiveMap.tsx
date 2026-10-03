// components/map/LiveMap.tsx
'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

type Animal = {
  id: string
  name: string
  tag: string
  species: string
  status: string
  battery: number
  last_lat: number | null
  last_lng: number | null
}

type Geofence = {
  id: string
  name: string
  geometry: any
}

export default function LiveMap({
  animals,
  geofences = [],
}: {
  animals: Animal[]
  geofences?: Geofence[]
}) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const isMounted = useRef(true)
  const mapLoaded = useRef(false)

  const located = animals.filter(
    (a) => a.last_lat !== null && a.last_lng !== null
  )

  useEffect(() => {
    isMounted.current = true

    if (!mapContainer.current || map.current) return

    const center: [number, number] =
      located.length > 0
        ? [located[0].last_lng as number, located[0].last_lat as number]
        : [31.0335, -17.8252]

    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center,
      zoom: 12,
    })

    m.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.current = m

    m.on('load', () => {
      mapLoaded.current = true
    })

    return () => {
      isMounted.current = false
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []
      m.remove()
      map.current = null
      mapLoaded.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!map.current || !isMounted.current) return

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    located.forEach((a) => {
      if (!map.current) return

      const color =
        a.status === 'alert'
          ? '#dc2626'
          : a.status === 'warning'
            ? '#eab308'
            : '#5DBB3F'

      const el = document.createElement('div')
      el.style.backgroundColor = color
      el.style.width = '20px'
      el.style.height = '20px'
      el.style.borderRadius = '50%'
      el.style.border = '3px solid white'
      el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)'
      el.style.cursor = 'pointer'

      const marker = new mapboxgl.Marker(el)
        .setLngLat([a.last_lng as number, a.last_lat as number])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="font-size:13px">
              <strong>${a.name}</strong><br/>
              <span style="color:#666">${a.tag}</span><br/>
              Battery: ${a.battery}%<br/>
              Status: ${a.status}
            </div>`
          )
        )
        .addTo(map.current)

      markersRef.current.push(marker)
    })
  }, [animals])

  useEffect(() => {
    if (!map.current || !isMounted.current) return

    const m = map.current
    const sourceId = 'geofences-source'
    const fillId = 'geofences-fill'
    const lineId = 'geofences-line'

    function renderGeofences() {
      if (!m || !isMounted.current) return

      if (m.getLayer(fillId)) m.removeLayer(fillId)
      if (m.getLayer(lineId)) m.removeLayer(lineId)
      if (m.getSource(sourceId)) m.removeSource(sourceId)

      const features = geofences
        .filter((g) => g.geometry)
        .map((g) => ({
          type: 'Feature' as const,
          properties: { id: g.id, name: g.name },
          geometry: g.geometry.geometry ? g.geometry.geometry : g.geometry,
        }))

      if (features.length === 0) return

      m.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features,
        },
      })

      m.addLayer({
        id: fillId,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': '#5DBB3F',
          'fill-opacity': 0.15,
        },
      })

      m.addLayer({
        id: lineId,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': '#5DBB3F',
          'line-width': 2,
        },
      })
    }

    if (mapLoaded.current) {
      renderGeofences()
    } else {
      m.once('load', renderGeofences)
    }
  }, [geofences])

  return <div ref={mapContainer} className="w-full h-full" />
}