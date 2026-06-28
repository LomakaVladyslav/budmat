import type { LocalizedString, LocalizedStringArray } from './common.types'

export interface EquipmentSpec {
  label: LocalizedString
  value: LocalizedString
}

export interface Equipment {
  id: string
  name: LocalizedString
  price: number | null
  priceLabel?: LocalizedString
  priceNote?: LocalizedString
  description: LocalizedString
  applications: LocalizedStringArray
  specifications: EquipmentSpec[]
  minimumHours?: number
  image: string
}
