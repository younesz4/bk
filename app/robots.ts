import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/checkout/',
        '/cart/',
        '/confirmation/',
        '/success/',
        '/cancel/',
        '/commande/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
