'use client'

import { useState, useCallback } from 'react'

export function useImageLoad() {
  const [isLoaded, setIsLoaded] = useState(false)

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
  }, [])

  return {
    isLoaded,
    handleLoad,
    className: `luxury-image-load ${isLoaded ? 'loaded' : ''}`
  }
}

