// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import LiveMap from '@/components/map/LiveMap'

export default async function OverviewPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, farm_name')
    .eq('id', user?.id)
    .maybeSingle()

  const { data: animals } = await supabase
    .from('animals')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: alerts } = await supabase
    .from('alerts')
    .select('*')
    .eq('resolved', false)
    .order('created_at', { ascending: false })
    .limit(5)

  const firstName = profile?.full_name?.split(' ')[0] || 'farmer'
  const list = animals || []
  const alertList = alerts || []
  const total = list.length
  const warnings = list.filter((a) => a.status === 'warning').length
  const active = list.filter((a) => a.status === 'alert').length

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {firstName}
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening on {profile?.farm_name || 'your farm'} today.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Animals tracked</p>
            <p className="text-3xl font-bold mt-1">{total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Warnings</p>
            <p className="text-3xl font-bold mt-1 text-yellow-600">{warnings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Active alerts</p>
            <p className="text-3xl font-bold mt-1 text-red-600">{active}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="h-[420px] rounded-lg overflow-hidden">
                <LiveMap animals={list} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold mb-4">Recent alerts</h2>
              <div className="space-y-3">
                {alertList.length === 0 && (
                  <p className="text-sm text-gray-400">No recent alerts.</p>
                )}
                {alertList.map((a) => (
                  <div
                    key={a.id}
                    className="border-l-4 pl-3 py-1"
                    style={{
                      borderColor:
                        a.severity === 'alert' ? '#dc2626' : '#eab308',
                    }}
                  >
                    <p className="text-sm font-medium">{a.animal_name}</p>
                    <p className="text-xs text-gray-600">{a.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(a.created_at).toLocaleString()}
                    </p>
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
              {list.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
                    No animals yet.
                  </td>
                </tr>
              )}
              {list.map((a) => (
                <tr key={a.id} className="border-b last:border-0">
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
                      {a.status === 'ok'
                        ? 'Healthy'
                        : a.status === 'warning'
                          ? 'Warning'
                          : 'Alert'}
                    </span>
                  </td>
                  <td className="py-3">{a.battery}%</td>
                  <td className="py-3 text-gray-500">
                    {new Date(a.last_seen).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}