// app/dashboard/animals/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function NewAnimalPage() {
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
    const tag = form.get('tag') as string
    const species = form.get('species') as string

    const { data: { user } } = await supabase.auth.getUser()
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
          Register a new animal and its collar.
        </p>
      </div>

      <Card className="max-w-lg">
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
  )
}