'use client'

import { ReactNode } from 'react'

interface HeroTitleProps {
  children: ReactNode
  className?: string
  delay?: number
  style?: React.CSSProperties
}

export default function HeroTitle({ children, className = '', delay = 0, style }: HeroTitleProps) {
  return (
    <h1
      className={className}
      style={style}
    >
      <span>
        {children}
      </span>
    </h1>
  )
}

