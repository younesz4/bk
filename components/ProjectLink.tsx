'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CSSProperties } from 'react'
import { useTransition } from '@/contexts/TransitionContext'

interface ProjectLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  style?: CSSProperties
  onClick?: () => void
}

export default function ProjectLink({ href, children, className, style, onClick }: ProjectLinkProps) {
  const router = useRouter()
  const { startTransition } = useTransition()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only handle project detail links
    if (href.startsWith('/projets/') && href !== '/projets') {
      e.preventDefault()
      
      // Start transition with navigation callback
      startTransition(() => {
        router.push(href)
      })
    }
    
    onClick?.()
  }

  return (
    <Link href={href} className={className} style={style} onClick={handleClick}>
      {children}
    </Link>
  )
}

