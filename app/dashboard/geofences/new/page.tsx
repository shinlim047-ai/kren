// app/dashboard/geofences/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function NewGeofencePage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const name = form.get('name') as string
    const rule = form.get('rule') as string

    const { data: { user } } = await supabase.auth.getUser()
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
          Create a virtual boundary for your animals.
        </p>
      </div>

      <Card className="max-w-lg">
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

            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="bg-kren hover:bg-kren-dark text-white"
              >
                {loading ? 'Creating...' : 'Create geofence'}
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
  )
}