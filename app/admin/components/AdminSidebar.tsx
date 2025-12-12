'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  href: string
  label: string
}

const navItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Produits' },
  { href: '/admin/categories', label: 'Catégories' },
  { href: '/admin/orders', label: 'Commandes' },
  { href: '/admin/bookings', label: 'Rendez-vous' },
  { href: '/admin/contacts', label: 'Messages' },
  { href: '/admin/customers', label: 'Clients' },
  { href: '/admin/settings', label: 'Paramètres' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-frost dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 pt-6">
      <nav className="px-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    block px-4 py-2.5 rounded-sm transition-colors
                    ${active
                      ? 'bg-neutral-50 dark:bg-neutral-800 text-black dark:text-white font-medium border-l-2 border-black dark:border-white'
                      : 'text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }
                  `}
                  style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

