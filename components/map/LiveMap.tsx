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

export default function LiveMap({ animals }: { animals: Animal[] }) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])

  const located = animals.filter(
    (a) => a.last_lat !== null && a.last_lng !== null
  )

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    const center: [number, number] =
      located.length > 0
        ? [located[0].last_lng as number, located[0].last_lat as number]
        : [31.0335, -17.8252] // Harare

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center,
      zoom: 12,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [])

  useEffect(() => {
    if (!map.current) return

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    located.forEach((a) => {
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
        .addTo(map.current!)

      markersRef.current.push(marker)
    })
  }, [animals])

  return <div ref={mapContainer} className="w-full h-full" />
}