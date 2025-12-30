export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  description: string;
  dimensions: string;
  materials: string;
  images: string[];
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  description: string;
  heroImage: string;
  images: string[];
}

export const categories = [
  'Chaise',
  'Fauteuil',
  'Table d\'appoint',
  'Table basse',
  'Console',
  'Meuble TV',
];

export const products: Product[] = [
  {
    id: '1',
    slug: 'chaise-contemporaine-01',
    name: 'Chaise Contemporaine 01',
    category: 'Chaise',
    price: 1250,
    description: 'Une chaise élégante alliant confort et design minimaliste. Parfaite pour compléter votre espace de vie avec style.',
    dimensions: 'H 85cm × L 55cm × P 55cm',
    materials: 'Noyer massif, cuir italien',
    images: [
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
      'https://images.unsplash.com/photo-1549497538-303791108f95?w=800',
    ],
  },
  {
    id: '2',
    slug: 'fauteuil-velours-01',
    name: 'Fauteuil Velours 01',
    category: 'Fauteuil',
    price: 2850,
    description: 'Fauteuil profond au design raffiné, recouvert d\'un velours de qualité supérieure. Un véritable écrin de confort.',
    dimensions: 'H 95cm × L 90cm × P 85cm',
    materials: 'Hêtre massif, velours premium',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    ],
  },
  {
    id: '3',
    slug: 'table-appoint-marbre',
    name: 'Table d\'appoint Marbre',
    category: 'Table d\'appoint',
    price: 950,
    description: 'Table d\'appoint au plateau en marbre naturel, reposant sur une base en métal laqué. Élégance intemporelle.',
    dimensions: 'H 45cm × L 60cm × P 40cm',
    materials: 'Marbre de Carrare, métal laqué noir',
    images: [
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800',
    ],
  },
  {
    id: '4',
    slug: 'table-basse-noyer',
    name: 'Table basse Noyer',
    category: 'Table basse',
    price: 1850,
    description: 'Table basse en noyer massif au design épuré. Un meuble central qui sublime votre salon.',
    dimensions: 'H 40cm × L 140cm × P 70cm',
    materials: 'Noyer massif, finition huile naturelle',
    images: [
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800',
    ],
  },
  {
    id: '5',
    slug: 'console-moderne-01',
    name: 'Console Moderne 01',
    category: 'Console',
    price: 2200,
    description: 'Console au design contemporain, alliant bois massif et métal. Parfaite pour votre entrée ou salon.',
    dimensions: 'H 85cm × L 180cm × P 40cm',
    materials: 'Chêne massif, métal brossé',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    ],
  },
  {
    id: '6',
    slug: 'meuble-tv-design',
    name: 'Meuble TV Design',
    category: 'Meuble TV',
    price: 3200,
    description: 'Meuble TV sur mesure au design minimaliste. Espaces de rangement optimisés et esthétique raffinée.',
    dimensions: 'H 50cm × L 240cm × P 45cm',
    materials: 'Chêne massif, laque mate',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    ],
  },
  {
    id: '7',
    slug: 'chaise-scandinave',
    name: 'Chaise Scandinave',
    category: 'Chaise',
    price: 890,
    description: 'Chaise au style scandinave, en bois clair et assise en tissu. Design intemporel et confortable.',
    dimensions: 'H 82cm × L 48cm × P 52cm',
    materials: 'Hêtre massif, tissu lin',
    images: [
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
    ],
  },
  {
    id: '8',
    slug: 'fauteuil-cuir-01',
    name: 'Fauteuil Cuir 01',
    category: 'Fauteuil',
    price: 3500,
    description: 'Fauteuil en cuir pleine fleur, structure en noyer massif. Un classique du mobilier de luxe.',
    dimensions: 'H 92cm × L 88cm × P 90cm',
    materials: 'Cuir italien, noyer massif',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    ],
  },
];

export const projects: Project[] = [
  {
    id: '1',
    slug: 'keyage',
    name: 'Keyage',
    description: 'Agencement sur-mesure pour Keyage Clinic. Espace médical et esthétique alliant élégance et fonctionnalité. Design contemporain avec mobilier haut de gamme et finitions raffinées pour créer une atmosphère de bien-être et de confiance.',
    heroImage: '/key.webp',
    images: [
      '/key.webp',
      '/le keyage2.webp',
      '/tall1.webp',
      '/box1.webp',
    ],
  },
  {
    id: '2',
    slug: 'hotel-atlantic',
    name: 'Hotel Atlantic',
    description: 'Agencement et mobilier sur-mesure pour Hotel Atlantic. Espaces hôteliers de luxe avec mobilier d\'exception, chambres raffinées et espaces communs élégants. Design contemporain alliant confort et sophistication pour une expérience d\'hospitalité exceptionnelle.',
    heroImage: '/atlantic.webp',
    images: [
      '/atlantic.webp',
      '/hotel atlantic2.webp',
      '/tall2.webp',
      '/box2.webp',
    ],
  },
  {
    id: '3',
    slug: 'nomai',
    name: 'Nomai',
    description: 'Agencement sur-mesure pour le restaurant Nomai. Design gastronomique contemporain avec mobilier d\'exception et espaces conviviaux. Ambiance raffinée alliant esthétique moderne et chaleur accueillante pour une expérience culinaire mémorable.',
    heroImage: '/nom1.webp',
    images: [
      '/nom1.webp',
      '/nomai2.webp',
      '/tall3.webp',
      '/box3.webp',
    ],
  },
  {
    id: '4',
    slug: 'rafinity',
    name: 'Rafinity',
    description: 'Agencement et mobilier sur-mesure pour Rafinity. Espace professionnel élégant alliant innovation et design contemporain. Mobilier haut de gamme et agencement raffiné pour créer un environnement de travail inspirant et sophistiqué.',
    heroImage: '/raff.webp',
    images: [
      '/raff.webp',
      '/raffinity2.webp',
      '/tall4.webp',
      '/box4.webp',
    ],
  },
  {
    id: '5',
    slug: 'visa',
    name: 'Visa',
    description: 'Agencement sur-mesure pour Visa. Espace professionnel d\'exception alliant fonctionnalité et design contemporain. Mobilier haut de gamme et agencement raffiné pour créer un environnement de travail élégant et performant.',
    heroImage: '/vi.webp',
    images: [
      '/visa2.webp',
    ],
  },
  {
    id: '6',
    slug: 'table3',
    name: 'Table 3',
    description: 'Agencement sur-mesure pour Table 3 Casablanca. Design gastronomique contemporain avec mobilier d\'exception et espaces conviviaux. Ambiance raffinée alliant esthétique moderne et élégance pour une expérience culinaire exceptionnelle.',
    heroImage: '/hero0.webp',
    images: [
      '/hero0.webp',
      '/projet2.webp',
      '/tall6.webp',
      '/box6.webp',
    ],
  },
  {
    id: '7',
    slug: 'cote-sushi',
    name: 'Côté Sushi',
    description: 'Agencement sur-mesure pour Côté Sushi. Espace gastronomique contemporain avec mise en valeur du mobilier et ambiance conviviale.',
    heroImage: '/uploads/cote shishi (1).jpg',
    images: [
      '/uploads/cote shishi (1).jpg',
      '/uploads/cote sushi 2(1).jpg',
      '/uploads/cote sushi 3 (1).jpg',
    ],
  },
  {
    id: '8',
    slug: 'hotel-la-folie-barbizon',
    name: 'Hotel La Folie Barbizon',
    description: 'Agencement et mobilier pour Hotel La Folie Barbizon. Ambiance élégante et raffinée adaptée aux clients d\'hôtel de prestige.',
    heroImage: '/uploads/la folie  (1).jpg',
    images: [
      '/uploads/la folie  (1).jpg',
      '/uploads/la folie 2(1).jpg',
      '/uploads/la folie 3(1).jpg',
    ],
  },
  {
    id: '9',
    slug: 'pizi',
    name: 'PIZI',
    description: 'Agencement sur-mesure pour PIZI. Projet culinaire contemporain avec mobilier sur mesure et finitions haut de gamme.',
    heroImage: '/uploads/pizi(1).jpg',
    images: [
      '/uploads/pizi(1).jpg',
      '/uploads/pizi2 (1).jpg',
      '/uploads/pizi3(1).jpg',
    ],
  },
];
