// app/dashboard/animals/page.tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function AnimalsPage() {
  const supabase = await createClient()
  const { data: animals } = await supabase
    .from('animals')
    .select('*')
    .order('created_at', { ascending: false })

  const list = animals || []

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Animals</h1>
          <p className="text-gray-600 mt-1">
            All animals on your farm and their collars.
          </p>
        </div>
        <Link href="/dashboard/animals/new">
          <Button className="bg-kren hover:bg-kren-dark text-white">
            Add animal
          </Button>
        </Link>
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
              {list.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No animals yet. Click "Add animal" to get started.
                  </td>
                </tr>
              )}
              {list.map((a) => (
                <tr key={a.id} className="border-b last:border-0">
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