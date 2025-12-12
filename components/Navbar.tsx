import Link from 'next/link'

export default function Navbar() {
  return (
    <nav aria-label="Navigation principale" className="fixed top-0 left-0 right-0 z-50 bg-cream-50/95 backdrop-blur-sm border-b border-walnut-100">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-2xl font-serif text-walnut-800 tracking-tight">
            Studio
          </Link>
          
          <div className="hidden md:flex items-center space-x-10">
            <Link href="/" className="text-sm font-light text-walnut-700 hover:text-walnut-900 transition-colors">
              Home
            </Link>
            <Link href="/shop" className="text-sm font-light text-walnut-700 hover:text-walnut-900 transition-colors">
              Shop
            </Link>
            <Link href="/projects" className="text-sm font-light text-walnut-700 hover:text-walnut-900 transition-colors">
              Projects
            </Link>
            <Link href="/about" className="text-sm font-light text-walnut-700 hover:text-walnut-900 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-light text-walnut-700 hover:text-walnut-900 transition-colors">
              Contact
            </Link>
          </div>

          {/* Mobile menu button - placeholder */}
          <button className="md:hidden text-walnut-700" aria-label="Ouvrir le menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}

