//app/dashboard/geofences/page.tsx
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function GeofencesPage() {
  const zones = [
    { name: 'North pasture', animals: 3, rule: 'Alert on exit', status: 'active' },
    { name: 'Homestead', animals: 5, rule: 'Alert on entry', status: 'active' },
    { name: 'Dipping tank', animals: 0, rule: 'Alert on entry', status: 'inactive' },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Geofences</h1>
          <p className="text-gray-600 mt-1">Virtual boundaries for your animals.</p>
        </div>
        <Button className="bg-kren hover:bg-kren-dark text-white">New geofence</Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="h-[500px] bg-gray-100 flex items-center justify-center rounded-lg">
                <p className="text-gray-400 text-sm">Map placeholder — draw zones here</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          {zones.map((z) => (
            <Card key={z.name}>
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
                <p className="text-xs text-gray-400 mt-2">
                  {z.animals} {z.animals === 1 ? 'animal' : 'animals'} assigned
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}