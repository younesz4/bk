'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Project } from '@/lib/data'
import { useImageLoad } from '@/hooks/useImageLoad'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { className: imageClassName, handleLoad } = useImageLoad()
  
  return (
    <Link href={`/projets/${project.slug}`} className="group luxury-link-ripple">
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-100 luxury-card-hover">
        <Image
          src={project.heroImage}
          alt={project.name}
          fill
          className={`object-cover luxury-image-hover ${imageClassName}`}
          quality={75}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          onLoad={handleLoad}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end">
          <div className="p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <h3 className="text-2xl mb-2">{project.name}</h3>
            <p className="text-sm font-light line-clamp-2">{project.description}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

