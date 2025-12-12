'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react'

interface TransitionContextType {
  isAnimating: boolean
  isExiting: boolean
  startTransition: (callback: () => void) => void
  onRevealComplete: () => void
  onExitComplete: () => void
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined)

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const navigationCallbackRef = useRef<(() => void) | null>(null)

  const startTransition = useCallback((callback: () => void) => {
    navigationCallbackRef.current = callback
    setIsAnimating(true)
    setIsExiting(false)
  }, [])

  const onRevealComplete = useCallback(() => {
    // Reveal has covered screen - execute navigation
    if (navigationCallbackRef.current) {
      const callback = navigationCallbackRef.current
      navigationCallbackRef.current = null
      callback() // Navigate
      // Start exit animation after navigation
      setTimeout(() => {
        setIsAnimating(false)
        setIsExiting(true)
      }, 100)
    }
  }, [])

  const onExitComplete = useCallback(() => {
    // Exit animation complete - reset state
    setIsAnimating(false)
    setIsExiting(false)
  }, [])

  return (
    <TransitionContext.Provider value={{ 
      isAnimating, 
      isExiting,
      startTransition, 
      onRevealComplete,
      onExitComplete 
    }}>
      {children}
    </TransitionContext.Provider>
  )
}

export function useTransition() {
  const context = useContext(TransitionContext)
  if (context === undefined) {
    throw new Error('useTransition must be used within a TransitionProvider')
  }
  return context
}
