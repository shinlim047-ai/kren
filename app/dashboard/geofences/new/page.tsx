// app/dashboard/geofences/new/page.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import mapboxgl from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

export default function NewGeofencePage() {
  const router = useRouter()
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [geometry, setGeometry] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [31.0335, -17.8252],
      zoom: 12,
    })

    m.addControl(new mapboxgl.NavigationControl(), 'top-right')

    m.on('load', () => {
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: { polygon: true, trash: true },
        defaultMode: 'simple_select',
        styles: [
          {
            id: 'gl-draw-polygon-fill',
            type: 'fill',
            filter: ['all', ['==', '$type', 'Polygon']],
            paint: {
              'fill-color': '#5DBB3F',
              'fill-opacity': 0.25,
            },
          },
          {
            id: 'gl-draw-polygon-stroke',
            type: 'line',
            filter: ['all', ['==', '$type', 'Polygon']],
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': '#3a8a24',
              'line-width': 3,
            },
          },
          {
            id: 'gl-draw-polygon-and-line-vertex-halo',
            type: 'circle',
            filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
            paint: {
              'circle-radius': 7,
              'circle-color': '#ffffff',
            },
          },
          {
            id: 'gl-draw-polygon-and-line-vertex',
            type: 'circle',
            filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
            paint: {
              'circle-radius': 5,
              'circle-color': '#5DBB3F',
            },
          },
          {
            id: 'gl-draw-polygon-midpoint',
            type: 'circle',
            filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
            paint: {
              'circle-radius': 3,
              'circle-color': '#3a8a24',
            },
          },
        ],
      })

      m.addControl(draw, 'top-left')

      m.on('draw.create', (e: any) => setGeometry(e.features[0]))
      m.on('draw.update', (e: any) => setGeometry(e.features[0]))
      m.on('draw.delete', () => setGeometry(null))

      m.on('draw.modechange', (e: any) => {
        if (e.mode === 'draw_polygon' || e.mode === 'draw_line_string') {
          m.dragPan.disable()
          m.boxZoom.disable()
          m.scrollZoom.disable()
        } else {
          m.dragPan.enable()
          m.boxZoom.enable()
          m.scrollZoom.enable()
        }
      })
    })

    map.current = m

    return () => {
      m.remove()
      map.current = null
    }
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!geometry) {
      setError('Draw a zone on the map first.')
      return
    }

    setLoading(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const name = form.get('name') as string
    const rule = form.get('rule') as string

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Not signed in.')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from('geofences').insert({
      owner_id: user.id,
      name,
      rule,
      status: 'active',
      geometry,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard/geofences')
    router.refresh()
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href="/dashboard/geofences"
          className="text-sm text-gray-500 hover:text-kren"
        >
          ← Back to geofences
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          New geofence
        </h1>
        <p className="text-gray-600 mt-1">
          Draw a polygon on the map, then name it.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="h-[500px] rounded-lg overflow-hidden">
                <div ref={mapContainer} className="w-full h-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Zone name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="North pasture"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rule">Alert rule</Label>
                <select
                  id="rule"
                  name="rule"
                  required
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value="Alert on exit">Alert on exit</option>
                  <option value="Alert on entry">Alert on entry</option>
                  <option value="Alert on both">Alert on both</option>
                </select>
              </div>

              <p className="text-xs text-gray-500">
                {geometry
                  ? 'Zone captured. Ready to save.'
                  : 'Use the polygon tool on the map to draw your zone.'}
              </p>

              {error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={loading || !geometry}
                  className="bg-kren hover:bg-kren-dark text-white"
                >
                  {loading ? 'Saving...' : 'Save geofence'}
                </Button>
                <Link href="/dashboard/geofences">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}