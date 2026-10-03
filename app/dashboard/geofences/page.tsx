// app/dashboard/geofences/page.tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import LiveMap from '@/components/map/LiveMap'

export default async function GeofencesPage() {
  const supabase = await createClient()
  const { data: zones } = await supabase
    .from('geofences')
    .select('*')
    .order('created_at', { ascending: false })

  const list = zones || []

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Geofences</h1>
          <p className="text-gray-600 mt-1">
            Virtual boundaries for your animals.
          </p>
        </div>
        <Link href="/dashboard/geofences/new">
          <Button className="bg-kren hover:bg-kren-dark text-white">
            New geofence
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="h-[500px] rounded-lg overflow-hidden">
                <LiveMap animals={[]} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          {list.length === 0 && (
            <p className="text-sm text-gray-400">
              No geofences yet. Click "New geofence" to create one.
            </p>
          )}
          {list.map((z) => (
            <Card key={z.id}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{z.name}</h3>
                  <span
                    className={
                      z.status === 'active'
                        ? 'text-xs text-kren'
                        : 'text-xs text-gray-400'
                    }
                  >
                    {z.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{z.rule}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}