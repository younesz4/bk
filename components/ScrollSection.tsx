'use client'

import { motion, Variants } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface ScrollSectionProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  once?: boolean
}

export default function ScrollSection({ 
  children, 
  className = '', 
  staggerDelay = 0.35,
  once = true 
}: ScrollSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { 
    once, 
    margin: '-100px' 
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface ScrollStaggerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  once?: boolean
}

export function ScrollStagger({ 
  children, 
  className = '', 
  staggerDelay = 0.35,
  once = true 
}: ScrollStaggerProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { 
    once, 
    margin: '-100px' 
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {Array.isArray(children) 
        ? children.map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={itemVariants}>{children}</motion.div>
      }
    </motion.div>
  )
}

