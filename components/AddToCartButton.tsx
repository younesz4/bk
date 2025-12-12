'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import type { Product, Category, ProductImage } from '@/types/product'

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    images: ProductImage[]
    category: Category
    stock: number
    selectedMaterial?: string
    selectedColor?: string
  }
  quantity?: number
  className?: string
}

export default function AddToCartButton({ product, quantity = 1, className = '' }: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  const [isDisabled, setIsDisabled] = useState(product.stock <= 0)

  const handleAddToCart = () => {
    if (product.stock <= 0 || isDisabled) {
      return
    }

    addToCart(product, quantity)
    setIsAdded(true)

    // Reset "Ajouté" message after 2 seconds
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  const isOutOfStock = product.stock <= 0

  return (
    <button
      onClick={handleAddToCart}
      disabled={isOutOfStock || isDisabled}
      className={className}
      style={{
        padding: '12px 32px',
        fontSize: '14px',
        fontWeight: 400,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        border: '1px solid #000',
        backgroundColor: isOutOfStock ? '#f5f5f5' : '#000',
        color: isOutOfStock ? '#999' : '#fff',
        cursor: isOutOfStock ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        opacity: isOutOfStock ? 0.5 : 1,
        minWidth: '160px',
        fontFamily: 'var(--font-raleway)',
      }}
      onMouseEnter={(e) => {
        if (!isOutOfStock && !isDisabled) {
          e.currentTarget.style.backgroundColor = '#333'
        }
      }}
      onMouseLeave={(e) => {
        if (!isOutOfStock && !isDisabled) {
          e.currentTarget.style.backgroundColor = '#000'
        }
      }}
    >
      {isAdded ? 'Ajouté' : isOutOfStock ? 'Rupture de stock' : 'Ajouter au panier'}
    </button>
  )
}
