'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTransition } from '@/contexts/TransitionContext'

export default function PageReveal() {
  const { isAnimating, isExiting, onRevealComplete, onExitComplete } = useTransition()
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isAnimating || isExiting) {
      setShouldRender(true)
      document.body.style.overflow = 'hidden'
      document.body.style.height = '100vh'
    } else {
      // Immediately hide when not transitioning
      setShouldRender(false)
      document.body.style.overflow = ''
      document.body.style.height = ''
    }
  }, [isAnimating, isExiting])

  // Calculate target Y position based on animation phase
  const getTargetY = () => {
    if (isAnimating) return '0%'      // Reveal covering screen
    if (isExiting) return '-100%'    // Exiting upward
    return '100%'                    // Hidden at bottom
  }

  const targetY = getTargetY()

  // Only render when actually transitioning
  if (!shouldRender) return null

  return (
    <motion.div
      className="page-reveal"
      initial={{ y: '100%' }}
      animate={{ y: targetY }}
      transition={{
        duration: 0.6,
        ease: [0.77, 0, 0.175, 1],
      }}
      onAnimationComplete={() => {
        if (isAnimating && targetY === '0%') {
          // Reveal has covered screen - trigger navigation
          onRevealComplete()
        } else if (isExiting && targetY === '-100%') {
          // Exit animation complete
          onExitComplete()
        }
      }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '100vh',
        background: '#FAF9F7',
        zIndex: 9999,
        pointerEvents: 'none',
        willChange: 'transform',
      }}
    />
  )
}
