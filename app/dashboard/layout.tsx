//app/dashboard/layout.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const nav = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/animals', label: 'Animals' },
  { href: '/dashboard/alerts', label: 'Alerts' },
  { href: '/dashboard/geofences', label: 'Geofences' },
  { href: '/dashboard/reports', label: 'Reports' },
  { href: '/dashboard/settings', label: 'Settings' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <Link href="/" className="text-2xl font-bold text-kren">
            Kren
          </Link>
          <p className="text-xs text-gray-500 mt-1">Mhofu Ranch</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:text-kren"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <p className="text-xs text-gray-500 mb-2 truncate">Tendai Moyo</p>
          <Link href="/login">
            <Button variant="outline" size="sm" className="w-full">
              Sign out
            </Button>
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}