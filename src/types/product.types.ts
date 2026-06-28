import type { LocalizedString, LocalizedStringArray } from './common.types'

export type ProductStatus = 'available' | 'order' | 'hidden'

export type ProductCategory =
  | 'cement'
  | 'sand'
  | 'crushed-stone'
  | 'blocks'
  | 'concrete-rings'
  | 'brick'

export interface Product {
  id: string
  category: ProductCategory
  name: LocalizedString
  price: number
  priceNote?: LocalizedString
  unit: LocalizedString
  description: LocalizedString
  applications: LocalizedStringArray
  features: LocalizedStringArray
  image: string
  status: ProductStatus
}
