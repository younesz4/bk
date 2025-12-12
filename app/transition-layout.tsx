'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function TransitionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: 1,
          y: 0,
          filter: 'blur(0px)'
        }}
        exit={{ 
          opacity: [1, 0.85, 0],
          filter: 'blur(2px)',
          transition: {
            duration: 0.35,
            ease: [0.25, 0.1, 0.25, 1],
            times: [0, 0.5, 1] // Keyframe timing for opacity sequence
          }
        }}
        transition={{
          duration: 0.55,
          ease: [0.25, 0.1, 0.25, 1]
        }}
        className="relative min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
