'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Product, Category, ProductImage } from '@/types/product'

interface CartProduct {
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

interface CartItem extends CartProduct {
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: CartProduct; quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; material?: string; color?: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number; material?: string; color?: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'SET_IS_OPEN'; payload: boolean }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1 } = action.payload

      // Prevent adding if stock is 0 or less
      if (product.stock <= 0) {
        return state
      }

      const existingItem = state.items.find(
        (item) =>
          item.id === product.id &&
          item.selectedMaterial === product.selectedMaterial &&
          item.selectedColor === product.selectedColor
      )

      if (existingItem) {
        // Check if adding more would exceed stock
        if (existingItem.quantity + quantity > product.stock) {
          return state
        }
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === product.id &&
            item.selectedMaterial === product.selectedMaterial &&
            item.selectedColor === product.selectedColor
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
          isOpen: true,
        }
      }

      // Check if initial quantity exceeds stock
      if (quantity > product.stock) {
        return state
      }

      return {
        ...state,
        items: [...state.items, { ...product, quantity }],
        isOpen: true,
      }
    }

    case 'REMOVE_ITEM': {
      const { productId, material, color } = action.payload
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            !(
              item.id === productId &&
              item.selectedMaterial === material &&
              item.selectedColor === color
            )
        ),
      }
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity, material, color } = action.payload

      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) =>
              !(
                item.id === productId &&
                item.selectedMaterial === material &&
                item.selectedColor === color
              )
          ),
        }
      }

      return {
        ...state,
        items: state.items.map((item) => {
          if (
            item.id === productId &&
            item.selectedMaterial === material &&
            item.selectedColor === color
          ) {
            // Check if new quantity exceeds stock
            if (quantity > item.stock) {
              return item
            }
            return { ...item, quantity }
          }
          return item
        }),
      }
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      }

    case 'SET_CART':
      return {
        ...state,
        items: action.payload,
      }

    case 'SET_IS_OPEN':
      return {
        ...state,
        isOpen: action.payload,
      }

    default:
      return state
  }
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: CartProduct, quantity?: number) => void
  removeFromCart: (productId: string, material?: string, color?: string) => void
  updateQuantity: (productId: string, quantity: number, material?: string, color?: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const initialState: CartState = {
  items: [],
  isOpen: false,
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          dispatch({ type: 'SET_CART', payload: parsedCart })
        } catch (error) {
          console.error('Error loading cart from localStorage:', error)
        }
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(state.items))
    }
  }, [state.items])

  // Helper functions
  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.price / 100) * item.quantity, 0)
  }

  // Actions
  const addToCart = (product: CartProduct, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } })
  }

  const removeFromCart = (productId: string, material?: string, color?: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, material, color } })
  }

  const updateQuantity = (productId: string, quantity: number, material?: string, color?: string) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity, material, color } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const setIsOpen = (open: boolean) => {
    dispatch({ type: 'SET_IS_OPEN', payload: open })
  }

  return (
    <CartContext.Provider
      value={{
        cartItems: state.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isOpen: state.isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
