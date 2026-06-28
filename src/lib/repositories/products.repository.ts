import { products } from '@/data/products'
import type { Product, ProductCategory } from '@/types/product.types'

// This repository abstracts data access so swapping to an API later requires
// only changing the implementation here, not any component.

export function getAllProducts(): Product[] {
  return products.filter((p) => p.status !== 'hidden')
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return getAllProducts().filter((p) => p.category === category)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}
