//app/dashboard/alerts/page.tsx
import { Card, CardContent } from '@/components/ui/card'

export default function AlertsPage() {
  const alerts = [
    { name: 'Bhubesi', type: 'Inactivity', message: 'No movement detected for 3 hours', time: '3 hours ago', severity: 'alert' },
    { name: 'Shumba', type: 'Low battery', message: 'Battery below 20%', time: '12 min ago', severity: 'warning' },
    { name: 'Nyati', type: 'Geofence', message: 'Left the North pasture', time: '1 hour ago', severity: 'warning' },
    { name: 'Mhofu', type: 'Geofence', message: 'Entered the South pasture', time: '5 hours ago', severity: 'ok' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
        <p className="text-gray-600 mt-1">Recent activity and warnings from your herd.</p>
      </div>

      <div className="flex gap-2 mb-6">
        {['All', 'Geofence', 'Battery', 'Tamper', 'Inactivity'].map((f) => (
          <button
            key={f}
            className="px-3 py-1.5 text-xs rounded-full border border-gray-200 hover:border-kren hover:text-kren"
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {alerts.map((a, i) => (
          <Card key={i}>
            <CardContent className="p-5 flex items-start gap-4">
              <div
                className="w-2 h-2 rounded-full mt-2 shrink-0"
                style={{
                  backgroundColor:
                    a.severity === 'alert' ? '#dc2626' : a.severity === 'warning' ? '#eab308' : '#5DBB3F',
                }}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{a.name}</p>
                  <p className="text-xs text-gray-400">{a.time}</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">{a.type}</p>
                <p className="text-sm text-gray-700 mt-2">{a.message}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}