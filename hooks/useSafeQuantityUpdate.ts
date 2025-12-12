'use client'

import { useState, useCallback } from 'react'
import { useCart } from '@/contexts/CartContext'

export function useSafeQuantityUpdate() {
  const { cartItems, updateQuantity } = useCart()
  const [warning, setWarning] = useState<string | null>(null)

  const safeUpdateQuantity = useCallback(
    (
      productId: string,
      newQuantity: number,
      material?: string,
      color?: string
    ) => {
      // Find the cart item
      const item = cartItems.find(
        (cartItem) =>
          cartItem.id === productId &&
          cartItem.selectedMaterial === material &&
          cartItem.selectedColor === color
      )

      if (!item) {
        updateQuantity(productId, newQuantity, material, color)
        return
      }

      // Check if new quantity exceeds stock
      if (newQuantity > item.stock) {
        // Show warning
        setWarning('Quantité maximale atteinte')
        
        // Clear warning after 2 seconds
        setTimeout(() => {
          setWarning(null)
        }, 2000)

        // Don't update if it exceeds stock
        return
      }

      // Safe to update
      updateQuantity(productId, newQuantity, material, color)
    },
    [cartItems, updateQuantity]
  )

  return {
    safeUpdateQuantity,
    warning,
  }
}

