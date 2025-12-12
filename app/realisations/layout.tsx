import type { Metadata } from 'next'
import { realisationsMetadata } from '@/lib/metadata-templates'

export const metadata: Metadata = realisationsMetadata

export default function RealisationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
