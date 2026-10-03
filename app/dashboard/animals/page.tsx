//app/dashboard/animals/page.tsx
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AnimalsPage() {
  const animals = [
    { name: 'Mhofu', tag: 'KR-001', species: 'Cattle', battery: 92, lastSeen: '2 min ago', status: 'ok' },
    { name: 'Nyati', tag: 'KR-002', species: 'Cattle', battery: 68, lastSeen: '5 min ago', status: 'ok' },
    { name: 'Shumba', tag: 'KR-003', species: 'Cattle', battery: 15, lastSeen: '12 min ago', status: 'warning' },
    { name: 'Tembo', tag: 'KR-004', species: 'Goat', battery: 88, lastSeen: '1 min ago', status: 'ok' },
    { name: 'Bhubesi', tag: 'KR-005', species: 'Cattle', battery: 42, lastSeen: '3 hours ago', status: 'alert' },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Animals</h1>
          <p className="text-gray-600 mt-1">All animals on your farm and their collars.</p>
        </div>
        <Button className="bg-kren hover:bg-kren-dark text-white">Add animal</Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Tag</th>
                <th className="pb-2 font-medium">Species</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Battery</th>
                <th className="pb-2 font-medium">Last seen</th>
              </tr>
            </thead>
            <tbody>
              {animals.map((a) => (
                <tr key={a.tag} className="border-b last:border-0">
                  <td className="py-3 font-medium">{a.name}</td>
                  <td className="py-3 text-gray-500">{a.tag}</td>
                  <td className="py-3">{a.species}</td>
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