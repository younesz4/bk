export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  categoryId: string
  category: Category
  images: ProductImage[]
  materials: Material[]
  colors: Color[]
  stock: number
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  products?: Product[]
  createdAt: Date
  updatedAt: Date
}

export interface ProductImage {
  id: string
  url: string
  productId: string
  alt: string | null
  order: number
}

export interface Material {
  id: string
  name: string
  productId: string
}

export interface Color {
  id: string
  name: string
  hex: string
  productId: string
}

export interface CreateProductInput {
  name: string
  slug: string
  description?: string
  price: number
  categoryId: string
  stock?: number
  images: { url: string; alt?: string; order?: number }[]
  materials: { name: string }[]
  colors: { name: string; hex: string }[]
}

export interface UpdateProductInput {
  name?: string
  slug?: string
  description?: string
  price?: number
  categoryId?: string
  stock?: number
  images?: { url: string; alt?: string; order?: number }[]
  materials?: { name: string }[]
  colors?: { name: string; hex: string }[]
}

export interface CartItem {
  productId: string
  quantity: number
  selectedMaterial?: string
  selectedColor?: string
}

