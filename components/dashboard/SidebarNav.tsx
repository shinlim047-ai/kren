//components/dashboard/SidebarNav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/animals', label: 'Animals' },
  { href: '/dashboard/alerts', label: 'Alerts' },
  { href: '/dashboard/geofences', label: 'Geofences' },
  { href: '/dashboard/reports', label: 'Reports' },
  { href: '/dashboard/settings', label: 'Settings' },
]

export default function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 p-4 space-y-1">
      {nav.map((item) => {
        const active =
          item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              active
                ? 'block px-3 py-2 rounded-md text-sm font-medium bg-kren/10 text-kren'
                : 'block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:text-kren'
            }
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}