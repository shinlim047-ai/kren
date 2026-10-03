//app/dashboard/page.tsx
import { Card, CardContent } from '@/components/ui/card'

export default function OverviewPage() {
  const animals = [
    { name: 'Mhofu', status: 'ok', battery: 92, lastSeen: '2 min ago' },
    { name: 'Nyati', status: 'ok', battery: 68, lastSeen: '5 min ago' },
    { name: 'Shumba', status: 'warning', battery: 15, lastSeen: '12 min ago' },
    { name: 'Tembo', status: 'ok', battery: 88, lastSeen: '1 min ago' },
    { name: 'Bhubesi', status: 'alert', battery: 42, lastSeen: '3 hours ago' },
  ]

  const alerts = [
    { name: 'Bhubesi', message: 'No movement detected for 3 hours', time: '3 hours ago', severity: 'alert' },
    { name: 'Shumba', message: 'Battery below 20%', time: '12 min ago', severity: 'warning' },
    { name: 'Nyati', message: 'Left the North pasture', time: '1 hour ago', severity: 'warning' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Tendai</h1>
        <p className="text-gray-600 mt-1">Here's what's happening on your farm today.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Animals tracked</p>
            <p className="text-3xl font-bold mt-1">5</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Warnings</p>
            <p className="text-3xl font-bold mt-1 text-yellow-600">1</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Active alerts</p>
            <p className="text-3xl font-bold mt-1 text-red-600">1</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="h-[420px] bg-gray-100 flex items-center justify-center rounded-lg">
                <p className="text-gray-400 text-sm">Map placeholder</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold mb-4">Recent alerts</h2>
              <div className="space-y-3">
                {alerts.map((a, i) => (
                  <div
                    key={i}
                    className="border-l-4 pl-3 py-1"
                    style={{ borderColor: a.severity === 'alert' ? '#dc2626' : '#eab308' }}
                  >
                    <p className="text-sm font-medium">{a.name}</p>
                    <p className="text-xs text-gray-600">{a.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{a.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold mb-4">Your animals</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Battery</th>
                <th className="pb-2 font-medium">Last seen</th>
              </tr>
            </thead>
            <tbody>
              {animals.map((a) => (
                <tr key={a.name} className="border-b last:border-0">
                  <td className="py-3 font-medium">{a.name}</td>
                  <td className="py-3">
                    <span
                      className={
                        a.status === 'alert'
                          ? 'text-red-600'
                          : a.status === 'warning'
                            ? 'text-yellow-600'
                            : 'text-kren'
                      }
                    >
                      {a.status === 'ok' ? 'Healthy' : a.status === 'warning' ? 'Warning' : 'Alert'}
                    </span>
                  </td>
                  <td className="py-3">{a.battery}%</td>
                  <td className="py-3 text-gray-500">{a.lastSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}