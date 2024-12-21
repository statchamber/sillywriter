"use client"

import { useWorldInfo } from "@/contexts/world-info-context"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CollectionSelectorProps {
  selectedCollection: string | null
  onSelect: (collectionId: string | null) => void
}

export function CollectionSelector({ selectedCollection, onSelect }: CollectionSelectorProps) {
  const { collections = [] } = useWorldInfo()

  return (
    <Select
      value={selectedCollection || "all"}
      onValueChange={(value) => onSelect(value === "all" ? null : value)}
    >
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="All Collections" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Collections</SelectItem>
        {collections.map((collection) => (
          <SelectItem key={collection.id} value={collection.id}>
            {collection.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 