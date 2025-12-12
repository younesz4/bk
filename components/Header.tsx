'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'

export default function Header() {
  const pathname = usePathname()

  const isDarkHero =
    pathname === '/' ||
    pathname === '/about' ||
    pathname === '/services'

  const isBoutiquePage = pathname.startsWith('/boutique')
  const isProjectsPage = pathname === '/projets'

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)

  const { getTotalItems, setIsOpen } = useCart()
  const cartItemCount = getTotalItems?.() || 0

  // HEADER COLOR LOGIC FIXED
  const headerIsLight = isDarkHero
  const textColor = headerIsLight ? 'text-white' : 'text-black'
  const hamburgerColor = headerIsLight ? 'bg-white' : 'bg-black'
  const logoFilter = headerIsLight ? 'brightness(0) invert(1)' : 'brightness(0)'
  
  // Header background logic
  const getHeaderBackground = () => {
    if (isProjectsPage) {
      return 'bg-white'
    }
    if (isScrolled) {
      return 'bg-black/60 backdrop-blur-sm'
    }
    return 'bg-transparent'
  }
  
  // Header shadow when scrolled
  const getHeaderShadow = () => {
    if (isScrolled) {
      return 'shadow-[0_2px_8px_rgba(0,0,0,0.1)]'
    }
    return ''
  }
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset'
  }, [isMobileMenuOpen])

  const menuItems = [
    { label: 'Accueil', href: '/' },
    { label: 'À propos', href: '/about' },
    { label: 'Boutique', href: '/boutique' },
    { label: 'Projets', href: '/projets' },
    { label: 'Réalisations', href: '/realisations' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 ${getHeaderBackground()} ${getHeaderShadow()}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          
          {/* DESKTOP */}
          <div className="hidden lg:flex justify-between items-center h-20 relative">

            {/* left */}
            <div className="flex gap-8">
              {menuItems.slice(0,3).map(m => (
                <Link key={m.href} href={m.href}
                  className={`${textColor} uppercase text-sm luxury-nav-link`}
                >
                  {m.label}
                </Link>
              ))}
            </div>

            {/* center logo - absolutely positioned */}
            <Link 
              href="/" 
              className="absolute left-1/2 -translate-x-1/2 logo-link"
              style={{ transition: 'opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
              <div className="relative w-20 h-20">
                <Image
                  src="/logo-1.png"
                  alt="Logo BK Agencements"
                  fill
                  className="object-contain"
                  style={{ filter: logoFilter }}
                  quality={75}
                  sizes="80px"
                  loading="lazy"
                />
              </div>
            </Link>

            {/* right */}
            <div className="flex gap-8 items-center">
              {menuItems.slice(3).map(m => (
                <Link key={m.href} href={m.href}
                  className={`${textColor} uppercase text-sm luxury-nav-link`}
                >
                  {m.label}
                </Link>
              ))}

              {/* Cart */}
              <button 
                onClick={() => setIsOpen(true)} 
                className="relative luxury-interactive"
                aria-label={cartItemCount > 0 ? `Panier, ${cartItemCount} article${cartItemCount > 1 ? 's' : ''}` : 'Panier'}
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className={textColor}
                  aria-hidden="true"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full" aria-hidden="true">
                    {cartItemCount}
                  </span>
                )}
              </button>

            </div>
          </div>
          {/* MOBILE HEADER */}
          <div className="lg:hidden flex justify-between items-center h-16">

            {/* MENU */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Ouvrir le menu"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              className="luxury-interactive min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <span className={`${textColor} uppercase tracking-[0.2em] text-xs`}>MENU</span>
            </button>

            {/* LOGO CENTER FIXED */}
            <Link 
              href="/" 
              className="relative w-12 h-12 logo-link"
              style={{ transition: 'opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
              <Image
                src="/logo-1.png"
                alt="Logo BK Agencements"
                fill
                className="object-contain"
                style={{ filter: logoFilter }}
                quality={75}
                sizes="48px"
                loading="lazy"
              />
            </Link>

            {/* CART */}
            <button 
              onClick={() => setIsOpen(true)} 
              className="relative luxury-interactive min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={cartItemCount > 0 ? `Panier, ${cartItemCount} article${cartItemCount > 1 ? 's' : ''}` : 'Panier'}
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={textColor}
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full" aria-hidden="true">
                  {cartItemCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </motion.header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 bg-black z-50 flex flex-col"
          >

            {/* close */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white uppercase tracking-[0.2em] text-xs absolute top-6 left-6 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Fermer le menu"
            >
              Close
            </button>

            {/* logo */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2">
              <Image src="/logo-1.png" alt="Logo BK Agencements" width={65} height={65}
                className="invert opacity-90"
                quality={75}
                sizes="65px"
                loading="lazy"
              />
            </div>

            {/* cart */}
            <button 
              onClick={() => setIsOpen(true)}
              className="absolute top-6 right-6 text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={cartItemCount > 0 ? `Panier, ${cartItemCount} article${cartItemCount > 1 ? 's' : ''}` : 'Panier'}
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </button>

            {/* links */}
            <div className="flex flex-col items-center justify-center flex-1 gap-6 sm:gap-8 py-8 overflow-y-auto">
              {menuItems.map((item,i)=>(
                <motion.div key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <Link href={item.href}
                    onClick={()=>setIsMobileMenuOpen(false)}
                    className="text-white text-2xl sm:text-3xl uppercase tracking-wide luxury-link-ripple min-h-[44px] flex items-center justify-center"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* footer */}
            <div className="flex justify-between px-6 sm:px-10 pb-8 sm:pb-12 pt-4 text-white text-xs tracking-wide border-t border-white/10">
              <div className="space-y-1">
                <p>INSTAGRAM</p>
                <p>PINTEREST</p>
                <p>LINKEDIN</p>
              </div>
              <div className="space-y-1">
                <p>LEGAL NOTICE</p>
                <p>PRIVACY POLICY</p>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
