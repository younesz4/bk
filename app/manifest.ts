import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BK Agencements - Mobilier sur-mesure & Agencement intérieur',
    short_name: 'BK Agencements',
    description: 'Mobilier sur-mesure haut de gamme, menuiserie, tapisserie et ferronnerie. Agencement intérieur d\'exception au Maroc.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}


