import type { Metadata } from 'next'
import { projectsMetadata } from '@/lib/metadata-templates'

export const metadata: Metadata = projectsMetadata

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
