export type WorldInfoCategory = "location" | "object" | "lore" | "subplot" | "other" | "global"

export interface WorldInfoEntry {
  id: string
  name: string
  category: WorldInfoCategory
  description: string
  keywords: string[]
  isEnabled: boolean
  createdAt: string
  updatedAt: string
}

export interface WorldInfoCollection {
  id: string
  name: string
  description: string
  entries: WorldInfoEntry[]
  createdAt: string
  updatedAt: string
} 