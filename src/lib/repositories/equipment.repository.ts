import { equipment } from '@/data/equipment'
import type { Equipment } from '@/types/equipment.types'

export function getAllEquipment(): Equipment[] {
  return equipment
}

export function getEquipmentById(id: string): Equipment | undefined {
  return equipment.find((e) => e.id === id)
}
