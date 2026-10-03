//app/dashboard/settings/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SettingsForm from '@/components/dashboard/SettingsForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your farm details and notification preferences.
        </p>
      </div>

      <SettingsForm
        profile={{
          full_name: profile?.full_name || '',
          email: profile?.email || user.email || '',
          phone: profile?.phone || '',
          farm_name: profile?.farm_name || '',
          location: profile?.location || '',
          animal_count: profile?.animal_count || 0,
        }}
      />
    </div>
  )
}