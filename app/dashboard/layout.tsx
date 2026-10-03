import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import SidebarNav from '@/components/dashboard/SidebarNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, farm_name, email, phone')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <Link href="/" className="text-2xl font-bold text-kren">
            Kren
          </Link>
          <p className="text-xs text-gray-500 mt-1">
            {profile?.farm_name || 'Your farm'}
          </p>
        </div>

        <SidebarNav />

        <div className="p-4 border-t">
          <p className="text-xs text-gray-500 mb-2 truncate">
            {profile?.full_name || user.email}
          </p>
          <form action="/auth/signout" method="post">
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="w-full"
            >
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}