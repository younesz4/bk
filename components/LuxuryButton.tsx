'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ReactNode } from 'react'

interface LuxuryButtonProps {
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'text' | 'white'
  children: ReactNode
  className?: string
  disabled?: boolean
  ariaLabel?: string
}

export default function LuxuryButton({
  href,
  onClick,
  type = 'button',
  variant = 'secondary',
  children,
  className = '',
  disabled = false,
  ariaLabel,
}: LuxuryButtonProps) {
  const baseClasses = `lux-btn lux-btn-${variant} ${className}`
  
  const arrowIcon = (
    <span className="lux-btn-arrow">
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="inline-block"
      >
        <path
          d="M6 1L11 6L6 11M11 6H1"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )

  const buttonContent = (
    <>
      {children}
      {variant !== 'text' && arrowIcon}
    </>
  )

  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={baseClasses}
        aria-label={ariaLabel}
      >
        {buttonContent}
      </Link>
    )
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      aria-label={ariaLabel}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.6, ease: [0.25, 0.00, 0.15, 1] }}
    >
      {buttonContent}
    </motion.button>
  )
}

