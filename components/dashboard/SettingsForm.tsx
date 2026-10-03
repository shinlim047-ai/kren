//components/dashboard/SettingsForm.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Profile = {
  full_name: string
  email: string
  phone: string
  farm_name: string
  location: string
  animal_count: number
}

export default function SettingsForm({ profile }: { profile: Profile }) {
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const form = new FormData(e.currentTarget)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: form.get('full_name'),
        phone: form.get('phone'),
        farm_name: form.get('farm_name'),
        location: form.get('location'),
        animal_count: parseInt(form.get('animal_count') as string, 10),
      })
      .eq('id', user.id)

    setSaving(false)
    setMessage(error ? 'Error: ' + error.message : 'Saved.')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="font-semibold">Farm details</h2>
          <div className="space-y-2">
            <Label htmlFor="farm_name">Farm name</Label>
            <Input id="farm_name" name="farm_name" defaultValue={profile.farm_name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" defaultValue={profile.location} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="animal_count">Number of animals</Label>
            <Input
              id="animal_count"
              name="animal_count"
              type="number"
              min="0"
              defaultValue={profile.animal_count}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="font-semibold">Account</h2>
          <div className="space-y-2">
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" name="full_name" defaultValue={profile.full_name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={profile.email}
              disabled
            />
            <p className="text-xs text-gray-500">Email is set at signup and cannot be changed here.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" name="phone" defaultValue={profile.phone} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="font-semibold">Notifications</h2>
          <div className="space-y-3">
            {['Geofence breaches', 'Low battery', 'Tamper alerts', 'Inactivity'].map((n) => (
              <label key={n} className="flex items-center justify-between">
                <span className="text-sm">{n}</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-gray-300 text-kren"
                />
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button
          type="submit"
          disabled={saving}
          className="bg-kren hover:bg-kren-dark text-white"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </Button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </div>
    </form>
  )
}