// app/dashboard/animals/new/page.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

export default function NewAnimalPage() {
  const router = useRouter()
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const marker = useRef<mapboxgl.Marker | null>(null)

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  )
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

    m.on('click', (e) => {
      const { lng, lat } = e.lngLat

      setCoords({ lat, lng })

      if (marker.current) {
        marker.current.setLngLat([lng, lat])
      } else {
        const el = document.createElement('div')
        el.style.backgroundColor = '#5DBB3F'
        el.style.width = '20px'
        el.style.height = '20px'
        el.style.borderRadius = '50%'
        el.style.border = '3px solid white'
        el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)'
        el.style.cursor = 'pointer'

        marker.current = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .addTo(m)
      }
    })

    map.current = m

    return () => {
      m.remove()
      map.current = null
      marker.current = null
    }
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!coords) {
      setError('Click on the map to set the animal position.')
      return
    }

    setLoading(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const name = form.get('name') as string
    const tag = form.get('tag') as string
    const species = form.get('species') as string

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Not signed in.')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from('animals').insert({
      owner_id: user.id,
      name,
      tag,
      species,
      battery: 100,
      status: 'ok',
      last_lat: coords.lat,
      last_lng: coords.lng,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard/animals')
    router.refresh()
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href="/dashboard/animals"
          className="text-sm text-gray-500 hover:text-kren"
        >
          ← Back to animals
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Add animal</h1>
        <p className="text-gray-600 mt-1">
          Click on the map to set the animal's position, then fill in the details.
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
                <Label htmlFor="name">Animal name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Mhofu"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tag">Collar tag / IMEI</Label>
                <Input
                  id="tag"
                  name="tag"
                  placeholder="KR-001"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="species">Species</Label>
                <select
                  id="species"
                  name="species"
                  required
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value="Cattle">Cattle</option>
                  <option value="Goat">Goat</option>
                  <option value="Horse">Horse</option>
                  <option value="Sheep">Sheep</option>
                </select>
              </div>

              <p className="text-xs text-gray-500">
                {coords
                  ? `Position set: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
                  : 'No position selected yet — click on the map.'}
              </p>

              {error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={loading || !coords}
                  className="bg-kren hover:bg-kren-dark text-white"
                >
                  {loading ? 'Saving...' : 'Add animal'}
                </Button>
                <Link href="/dashboard/animals">
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