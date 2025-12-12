import Image from 'next/image'

interface HeroProps {
  image: string
  title?: string
  subtitle?: string
}

export default function Hero({ image, title, subtitle }: HeroProps) {
  return (
    <div className="relative w-full h-[70vh] md:h-[85vh]">
      <Image
        src={image}
        alt={title || 'Hero image'}
        fill
        className="object-cover"
        priority
        quality={85}
        sizes="100vw"
      />
      {(title || subtitle) && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="text-center text-white px-6">
            {title && <h1 className="mb-4">{title}</h1>}
            {subtitle && <p className="text-lg md:text-xl font-light">{subtitle}</p>}
          </div>
        </div>
      )}
    </div>
  )
}

