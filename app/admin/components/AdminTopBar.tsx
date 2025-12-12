import Link from 'next/link'
import Image from 'next/image'

export default function AdminTopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 z-50">
      <div className="h-full flex items-center justify-between px-6">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <Image
                src="/logo-1.png"
                alt="BK Agencements"
                fill
                className="object-contain dark:invert"
                quality={75}
                sizes="32px"
              />
            </div>
            <span
              className="text-base font-medium text-neutral-900 dark:text-white"
              style={{ fontFamily: 'var(--font-bodoni)' }}
            >
              Dashboard Admin
            </span>
          </Link>
        </div>

        {/* Right: Logout */}
        <form action="/admin/logout" method="GET">
          <button
            type="submit"
            className="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-sm transition-colors"
            style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
          >
            Déconnexion
          </button>
        </form>
      </div>
    </header>
  )
}

