'use client'

import { useCart } from '@/contexts/CartContext'

export default function CartIcon() {
  const { getTotalItems, setIsOpen } = useCart()
  const itemCount = getTotalItems()

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="relative p-2 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded"
      aria-label={itemCount > 0 ? `Panier, ${itemCount} article${itemCount > 1 ? 's' : ''}` : 'Panier'}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {itemCount > 0 && (
        <span
          className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-black text-white text-xs font-medium rounded-full"
          aria-hidden="true"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  )
}

